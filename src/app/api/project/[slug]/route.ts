import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { projectSchema } from "@/lib/schemas";
import { generateSlug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const projectId = Number((await params).slug);
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, project: project });
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch project",
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
    let newUploadedFileId: string | null = null;

    try {
        const projectId = Number((await params).slug);

        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 },
            );
        }

        const formData = await req.formData();
        const rawData = {
            ...Object.fromEntries(formData.entries()),
            techStack: JSON.parse(formData.get("techStack") as string),
            category: JSON.parse(formData.get("category") as string),          
        };

        const result = projectSchema.safeParse(rawData);

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

        let imageUrl = existingProject.image;
        let fileId = existingProject.fileId;

        // 🖼 If new image provided → upload it
        if (data.image) {
            const arrayBuffer = await data.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: data.image.name,
                folder: "/portfolio/project",
            });

            newUploadedFileId = uploadResponse.fileId;
            imageUrl = uploadResponse.url;
            fileId = uploadResponse.fileId;
        }

        // 🔥 Transaction
        const updatedProject = await prisma.$transaction(async (tx) => {
            const updated = await tx.project.update({
                where: { id: projectId },
                data: {
                    title: data.title,
                    slug: generateSlug(data.title),
                    description: data.description,
                    url: data.url,
                    techStack: data.techStack,
                    isFeatured: data.isFeatured,
                    category: data.category,
                    image: imageUrl,
                    fileId: fileId,
                },
            });

            return updated;
        });

        // 🗑 Delete old image AFTER successful DB update
        if (
            newUploadedFileId &&
            existingProject.fileId &&
            existingProject.fileId !== newUploadedFileId
        ) {
            await imagekit.deleteFile(existingProject.fileId);
        }

        return NextResponse.json({
            success: true,
            message: "Project updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Update error:", error);

        // 🔄 Rollback uploaded image if DB fails
        if (newUploadedFileId) {
            try {
                await imagekit.deleteFile(newUploadedFileId);
            } catch (deleteError) {
                console.error("Image rollback failed:", deleteError);
            }
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update project",
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
        const projectId = Number((await params).slug);

        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 },
            );
        }

        await prisma.project.delete({
            where: { id: projectId },
        });

        // Delete image from ImageKit
        if (existingProject.fileId) {
            try {
                await imagekit.deleteFile(existingProject.fileId);
            } catch (imageError) {
                console.error(
                    "Failed to delete image from ImageKit:",
                    imageError,
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete project",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
