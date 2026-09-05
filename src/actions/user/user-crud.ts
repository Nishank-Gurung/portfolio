"use server";
import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { userSchema, userSchemaType } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth";

export const updateUser = async (userInfo: userSchemaType) => {
    let uploadFileId: string | null = null;
    let uploadResumeFileId: string | null = null;
    try {
        const session = await verifyAuth();
        const userData = await prisma.user.findUnique({
            where: { id: session.id },
        });

        if (!userData) {
            return {
                success: false,
                message: "No user found",
            };
        }
        const result = userSchema.safeParse(userInfo);

        if (!result.success) {
            return {
                success: false,
                message: "Invalid input",
                details: result.error.message,
            };
        }
        const data = result.data;
        let image = userData.image;
        let fileId = userData.fileId;
        let resumeUrl = userData.resumeUrl;
        let resumeFileId = userData.resumeFileId;
        const password = userData.password;

        if (data.image) {
            const arrayBuffer = await data.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: data.image.name,
                folder: "/portfolio/user",
            });
            uploadFileId = uploadResponse.fileId;
            image = uploadResponse.url;
            fileId = uploadResponse.fileId;
        }

        if (data.resume) {
            const resumeArrayBuffer = await data.resume.arrayBuffer();
            const resumeBuffer = Buffer.from(resumeArrayBuffer);

            const resumeUploadResponse = await imagekit.upload({
                file: resumeBuffer,
                fileName: data.resume.name || `resume-${Date.now()}.pdf`,
                folder: "/portfolio/resume",
            });
            uploadResumeFileId = resumeUploadResponse.fileId;
            resumeUrl = resumeUploadResponse.url;
            resumeFileId = resumeUploadResponse.fileId;
        }

        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.update({
                where: { id: userData.id },
                data: {
                    name: data.name,
                    email: data.email,
                    title: data.title,
                    image: image,
                    fileId: fileId,
                    resumeUrl: resumeUrl,
                    resumeFileId: resumeFileId,
                    about: data.about,
                    phone: data.phone,
                    address: data.address,
                    password: password,
                },
            });
            return newUser;
        });

        // Clean up previous image if new image was uploaded
        if (data.image && userData.fileId && userData.fileId !== uploadFileId) {
            try {
                await imagekit.deleteFile(userData.fileId);
            } catch (err) {
                console.error("Old image cleanup error:", err);
            }
        }

        // Clean up previous resume if new resume was uploaded
        if (data.resume && userData.resumeFileId && userData.resumeFileId !== uploadResumeFileId) {
            try {
                await imagekit.deleteFile(userData.resumeFileId);
            } catch (err) {
                console.error("Old resume cleanup error:", err);
            }
        }

        revalidatePath("/admin/editor/user");
        revalidatePath("/admin/user");
        revalidatePath("/");

        return {
            success: true,
            message: "User profile updated successfully",
            user: user,
        };
    } catch (error) {
        if (uploadFileId) {
            try {
                await imagekit.deleteFile(uploadFileId);
            } catch (deleteError) {
                console.error("Image rollback failed:", deleteError);
            }
        }
        if (uploadResumeFileId) {
            try {
                await imagekit.deleteFile(uploadResumeFileId);
            } catch (deleteError) {
                console.error("Resume rollback failed:", deleteError);
            }
        }
        return {
            success: false,
            message: getErrorMessage(error),
            data: null,
        };
    }
};
