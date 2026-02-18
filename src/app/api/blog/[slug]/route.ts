import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { postSchema } from "@/lib/schemas";
import { generateSlug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const blogId = Number((await params).slug);
        const blog = await prisma.post.findUnique({
            where: { id: blogId },
        });

        if (!blog) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, blog });
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch blog",
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
        const blogId = Number((await params).slug);

        const existingBlog = await prisma.post.findUnique({
            where: { id: blogId },
        });

        if (!existingBlog) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 },
            );
        }

        const formData = await req.formData();
        const rawData = {
            ...Object.fromEntries(formData.entries()),
            tag: JSON.parse(formData.get("tag") as string),
            category: JSON.parse(formData.get("category") as string),
        };

        const result = postSchema.safeParse(rawData);

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

        let imageUrl = existingBlog.coverImage;
        let fileId = existingBlog.fileId;

        // 🖼 If new image provided → upload it
        if (data.image) {
            const arrayBuffer = await data.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: data.image.name,
                folder: "/portfolio/blog",
            });

            newUploadedFileId = uploadResponse.fileId;
            imageUrl = uploadResponse.url;
            fileId = uploadResponse.fileId;
        }

        const updatedBlog = await prisma.$transaction(async (tx) => {
            const updated = await tx.post.update({
                where: { id: blogId },
                data: {
                    title: data.title,
                    content: data.content,
                    coverImage: imageUrl,
                    fileId: fileId,
                    status: data.status,
                    seoTitle: data.seoTitle,
                    seoDescription: data.seoDescription,
                    category: data.category,
                    slug: generateSlug(data.title),
                    publishedAt:
                        data.status === "PUBLISHED" ? new Date() : null,
                },
            });
            return updated;
        });

        return NextResponse.json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog,
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
                message: "Failed to update blog",
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
        const blogId = Number((await params).slug);

        const existingBlog = await prisma.post.findUnique({
            where: { id: blogId },
        });

        if (!existingBlog) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 },
            );
        }

        await prisma.post.delete({
            where: { id: blogId },
        });

        if (existingBlog.fileId) {
            try {
                await imagekit.deleteFile(existingBlog.fileId);
            } catch (deleteError) {
                console.error("Image deletion failed:", deleteError);
            }
        }
        return NextResponse.json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete blog",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
