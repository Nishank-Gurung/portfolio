import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { skillSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const skills = await prisma.skill.findMany();
        return NextResponse.json(
            {
                message: "Skills retrieved successfully",
                success: true,
                skill: skills,
            },
            {
                status: 200,
            },
        );
    } catch (e) {
        console.error("Error retrieving skills:", e);
        return NextResponse.json({
            message: "Failed to retrieve skills",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}

export async function POST(req: Request) {
    let uploadedFileId: string | null = null;
    try {
        const formData = await req.formData();
        const rawData = Object.fromEntries(formData.entries());
        const result = skillSchema.safeParse(rawData);
        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid input",
                    details: result.error.message,
                },
                { status: 400 },
            );
        }

        const data = result.data;
        if (!data.image) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Image for project is required",
                },
                {
                    status: 409,
                },
            );
        }

        const arrayBuffer = await data.image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: data.image.name,
            folder: "/portfolio/skill",
        });

        uploadedFileId = uploadResponse.fileId;

        const newSkill = await prisma.$transaction(async (tx) => {
            const skill = await tx.skill.create({
                data: {
                    name: data.name,
                    category: data.category,
                    level: data.level,
                    image: uploadResponse.url,
                    fileId: uploadedFileId,
                },
            });
            return skill;
        });

        return NextResponse.json(
            {
                success: true,
                message: "Skill created successfully",
                skill: newSkill,
            },
            {
                status: 201,
            },
        );
    } catch (e) {
        console.error("Error creating skill:", e);
        if (uploadedFileId) {
            try {
                await imagekit.deleteFile(uploadedFileId);
            } catch (deleteError) {
                console.error(
                    "Failed to rollback uploaded image:",
                    deleteError,
                );
            }
        }
        return NextResponse.json({
            message: "Failed to create skill",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}
