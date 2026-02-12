import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { educationSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const educationId = Number(params.id);
        const education = await prisma.education.findUnique({
            where: { id: educationId },
        });

        if (!education) {
            return NextResponse.json(
                { success: false, message: "Education not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, education:education, message:"Education fetched successfully" });
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch education",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const educationId = Number(params.id);

        const existingEducation = await prisma.education.findUnique({
            where: { id: educationId },
        });

        if (!existingEducation) {
            return NextResponse.json(
                { success: false, message: "Education not found" },
                { status: 404 },
            );
        }


        const formData = await req.formData();
        const rawData = Object.fromEntries(formData.entries());

        const result = educationSchema.safeParse(rawData);

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

        const updatedEducation = await prisma.$transaction(async (tx) => {
            const updated = await tx.education.update({
                where: { id: educationId },
                data: {
                    ...data,
                },
            });
            return updated;
        });

        return NextResponse.json({
            success: true,
            message: "Education updated successfully",
            education: updatedEducation,
        });
    } catch (error) {
        console.error("Update error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update education",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const educationId = Number(params.id);

        const existingEducation = await prisma.education.findUnique({
            where: { id: educationId },
        });

        if (!existingEducation) {
            return NextResponse.json(
                { success: false, message: "Education not found" },
                { status: 404 },
            );
        }

        await prisma.education.delete({
            where: { id: educationId },
        });

        return NextResponse.json({
            success: true,
            message: "Education deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete education",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}