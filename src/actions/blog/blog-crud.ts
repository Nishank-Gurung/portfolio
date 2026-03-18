"use server";

import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { postSchema, postSchemaType } from "@/lib/schemas";
import { generateSlug, getErrorMessage } from "@/lib/utils";

export const createBlog = async (postData: postSchemaType) => {
    let uploadedFileId: string | null = null;
    try {
        const result = postSchema.safeParse(postData);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }

        const data = result.data;
        if (!data.image) {
            throw new Error("Image for blog is required");
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
        return {
            success: true,
            message: "Blog created successfully",
            data: blog,
        };
    } catch (error) {
        console.error("Error creating event:", error);

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
        return {
            success: false,
            message: getErrorMessage(error),
            data: null,
        };
    }
};

export const deleteBlog = async (id: number) => {
    try {
        const blog = await prisma.post.findUnique({
            where: { id },
        });

        if (!blog) {
            throw new Error("Blog not found");
        }

        if (blog.fileId) {
            try {
                await imagekit.deleteFile(blog.fileId);
            } catch (deleteError) {
                console.error(
                    "Failed to delete associated image:",
                    deleteError,
                );
            }
        }

        await prisma.post.delete({
            where: { id },
        });

        return {
            success: true,
            message: "Blog deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting blog:", error);
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

interface UpdateBlogProps {
    id: number;
    blogData: postSchemaType;
}
export const updateBlog = async (
    { id, blogData }: UpdateBlogProps
) => {
    let newUploadedFileId: string | null = null;
    try {
        const result = postSchema.safeParse(blogData);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }

        const existingBlog = await prisma.post.findUnique({
            where: { id },
        });

        if (!existingBlog) {
            throw new Error("Blog not found");
        }

        const data = result.data;
        let imageUrl = existingBlog.coverImage;
        let fileId = existingBlog.fileId;

        if (data.image) {
            const arrayBuffer = await data.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await imagekit.upload({
                file: buffer,
                fileName: data.image.name,
                folder: "/portfolio/blog",
            }); 
            newUploadedFileId = uploadResult.fileId;
            imageUrl = uploadResult.url;
            fileId = uploadResult.fileId;
        }

        const updatedBlog = await prisma.$transaction(async (tx) => {
            if (data.image && existingBlog.fileId) {
                try {
                    await imagekit.deleteFile(existingBlog.fileId);
                } catch (deleteError) {
                    console.error(
                        "Failed to delete old image:",
                        deleteError,
                    );
                }
            }

            const blog = await tx.post.update({
                where: { id },
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
                        data.status === "PUBLISHED" && !existingBlog.publishedAt
                            ? new Date()
                            : existingBlog.publishedAt,
                },
            });
            return blog;
        });

        return {
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog,
        };
    } catch (error) {
        console.error("Error updating blog:", error);

        if (newUploadedFileId) {
            try {
                await imagekit.deleteFile(newUploadedFileId);
            } catch (deleteError) {
                console.error(
                    "Failed to rollback uploaded image:",
                    deleteError,
                );
            }
        }

        return {
            success: false,
            message: getErrorMessage(error),
            data: null,
        };
    }
};
