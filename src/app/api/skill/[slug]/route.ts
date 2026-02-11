import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { skillSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const skillId = Number(params.id);
        const skill = await prisma.skill.findUnique({
            where: { id: skillId },
        });

        if (!skill) {
            return NextResponse.json(
                { success: false, message: "Skill not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, skill });
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch skill",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } },
) {
    let newUploadedFileId: string | null = null;

    try {
        const skillId = Number(params.id);
        const existingSkill = await prisma.skill.findUnique({
            where: { id: skillId },
        });

        if (!existingSkill) {
            return NextResponse.json(
                { success: false, message: "Skill not found" },
                { status: 404 },
            );
        }

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

        let imageUrl = existingSkill.image;
        let fileId = existingSkill.fileId;
        if (data.image) {
            const arrayBuffer = await data.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await imagekit.upload({
                file: buffer,
                fileName: data.image.name,
                folder: "/portfolio/skill",
            });
            newUploadedFileId = uploadResult.fileId;
            imageUrl = uploadResult.url;
            fileId = uploadResult.fileId;
        }

        const updatedSkill = await prisma.$transaction(async () => {
            const updated = await prisma.skill.update({
                where: { id: skillId },
                data: {
                    name: data.name,
                    image: imageUrl,
                    fileId: fileId,
                    category: data.category,
                    level: data.level,
                },
            });
            return updated;
        });
        if (
            newUploadedFileId &&
            existingSkill.fileId &&
            existingSkill.fileId !== newUploadedFileId
        ) {
            await imagekit.deleteFile(existingSkill.fileId);
        }
        return NextResponse.json({ success: true, skill: updatedSkill });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update skill",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const skillId = Number(params.id);
        const existingSkill = await prisma.skill.findUnique({
            where: { id: skillId },
        });

        if (!existingSkill) {
            return NextResponse.json(
                { success: false, message: "Skill not found" },
                { status: 404 },
            );
        }

        // Delete image from ImageKit
        if (existingSkill.fileId) {
            await imagekit.deleteFile(existingSkill.fileId);
        }

        await prisma.skill.delete({
            where: { id: skillId },
        });

        return NextResponse.json({
            success: true,
            message: "Skill deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete skill",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
