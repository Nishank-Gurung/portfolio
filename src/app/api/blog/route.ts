import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { postSchema } from "@/lib/schemas";
import { generateSlug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
    } catch (e) {
        console.error("Error creating event:", e);
        return NextResponse.json({
            message: "Failed to create event",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}

export async function POST(req: NextRequest) {
    let uploadedFileId: string | null = null;

    try {
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
            folder: "/portfolio/blog",
        });

        uploadedFileId = uploadResponse.fileId;

        const blog = await prisma.$transaction(async (tx) => {
            const updated = await tx.post.create({
                data: {
                    title: data.title,
                    content: data.content,
                    coverImage: uploadResponse.url,
                    fileId: uploadResponse.fileId,
                    status: data.status,
                    seoTitle: data.seoTitle,
                    seoDescription: data.seoDescription,
                    category: data.category,
                    slug: generateSlug(data.title),
                    publishedAt:
                        data.status === "PUBLISHED" ? new Date() : null,
                    authorId: 1,
                },
            });
            return updated;
        });

        return NextResponse.json({
            success: true,
            message: "Blog created successfully",
            blog: blog,
        });
    } catch (e) {
        console.error("Error creating event:", e);

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
            message: "Failed to create event",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}
