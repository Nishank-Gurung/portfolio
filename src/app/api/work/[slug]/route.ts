import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { experienceSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const workId = Number((await params).slug);
        const work = await prisma.workExperience.findUnique({
            where: { id: workId },
        });

        if (!work) {
            return NextResponse.json(
                { success: false, message: "Work Experience not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, work });
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch work experience",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const workId = Number((await params).slug);

        const existingWork = await prisma.workExperience.findUnique({
            where: { id: workId },
        });

        if (!existingWork) {
            return NextResponse.json(
                { success: false, message: "Work Experience not found" },
                { status: 404 },
            );
        }

        const formData = await req.formData();
        console.log("formData", formData);
        const rawData = {
            ...Object.fromEntries(formData.entries()),
            skills: JSON.parse(formData.get("skills") as string),
        };
        console.log("rawData", rawData)
        const result = experienceSchema.safeParse(rawData);

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
        console.log("daa",data)
        const updatedWork = await prisma.$transaction(async (tx) => {
            const updated = await tx.workExperience.update({
                where: { id: workId },
                data: {
                    ...data,
                },
            });
            return updated;
        });

        return NextResponse.json({
            success: true,
            message: "Work Experience updated successfully",
            work: updatedWork,
        });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update work experience",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const workId = Number((await params).slug);

        const existingWork = await prisma.workExperience.findUnique({
            where: { id: workId },
        });

        if (!existingWork) {
            return NextResponse.json(
                { success: false, message: "Work Experience not found" },
                { status: 404 },
            );
        }

        await prisma.workExperience.delete({
            where: { id: workId },
        });

        return NextResponse.json({
            success: true,
            message: "Work Experience deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete work experience",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
