"use server";

import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { socialMediaSchema, socialMediaSchemaType } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/utils";

export const createSocial = async (socialData: socialMediaSchemaType) => {
    let uploadedFileId: string | null = null;
    try {
        const result = socialMediaSchema.safeParse(socialData);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }
        const data = result.data;
        if (!data.image) {
            throw new Error("Image for social media is required");
        }
        const arrayBuffer = await data.image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: data.image.name,
            folder: "/portfolio/social-media",
        });

        uploadedFileId = uploadResponse.fileId;

        const social = await prisma.$transaction(async (tx) => {
            const lastItem = await tx.socialMedia.findFirst({
                orderBy: { order: "desc" },
            });

            const nextOrder = lastItem ? lastItem.order + 1 : 1;

            const createSocial = await tx.socialMedia.create({
                data: {
                    platform: data.platform,
                    url: data.url,
                    image: uploadResponse.url,
                    fileId: uploadResponse.fileId,
                    order: nextOrder,
                },
            });

            return createSocial;
        });

        return {
            success: true,
            message: "Social media created successfully",
            data: social,
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

export const deleteSocial = async (id: number) => {
    try {
        const social = await prisma.socialMedia.findUnique({
            where: { id },
        });

        if (!social) {
            throw new Error("Social media not found");
        }

        await prisma.$transaction(async (tx) => {
            await tx.socialMedia.delete({
                where: { id },
            });

            if (social.fileId) {
                try {
                    await imagekit.deleteFile(social.fileId);
                } catch (deleteError) {
                    console.error(
                        "Failed to delete associated image:",
                        deleteError,
                    );
                }
            }
        });

        return {
            success: true,
            message: "Social media deleted successfully",
            data: null,
        };
    } catch (error) {
        console.error("Error deleting social media:", error);
        return {
            success: false,
            message: getErrorMessage(error),
            data: null,
        };
    }
}

interface UpdateSocialProps {
    id: number;
    socialData: socialMediaSchemaType;
}
export const updateSocial = async ({ id, socialData }: UpdateSocialProps) => {
    let newUploadedFileId: string | null = null;
    try {
        const existingSocial = await prisma.socialMedia.findUnique({
            where: { id },
        });

        if (!existingSocial) {
            throw new Error("Social media not found");
        }

        const result = socialMediaSchema.safeParse(socialData);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }
        const data = result.data;

        let imageUrl = existingSocial.image;
        let fileId = existingSocial.fileId;

        if (data.image) {
            const arrayBuffer = await data.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: data.image.name,
                folder: "/portfolio/social-media",
            });

            newUploadedFileId = uploadResponse.fileId;
            imageUrl = uploadResponse.url;
            fileId = uploadResponse.fileId;
        }

        const updateSocial = await prisma.$transaction(async (tx) => {
            const updated = await tx.socialMedia.update({
                where: { id: id },
                data: {
                    platform: data.platform,
                    url: data.url,
                    image: imageUrl,
                    fileId: fileId,
                    order: data.order
                },
            });
            return updated;
        });

        if (
            newUploadedFileId &&
            existingSocial.fileId &&
            existingSocial.fileId !== newUploadedFileId
        ) {
            await imagekit.deleteFile(existingSocial.fileId);
        }

        return {
            success: true,
            message: "Social media updated successfully",
            data: updateSocial,
        };
    } catch (error) {
        console.error("Error updating social media:", error);

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
