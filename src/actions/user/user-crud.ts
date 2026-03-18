"use server";
import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { userSchema, userSchemaType } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/utils";

export const updateUser = async (userInfo: userSchemaType) => {
    let uploadFileId: string | null = null;
    try {
        const userData = await prisma.user.findUnique({
            where: { id: 1 },
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
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.update({
                where: { id: userData.id },
                data: {
                    name: data.name,
                    email: data.email,
                    title: data.title,
                    image: image,
                    fileId: fileId,
                    about: data.about,
                    phone: data.phone,
                    address: data.address,
                    password: password,
                },
            });
            return newUser;
        });

        return {
            success: true,
            message: "User updated successfully",
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
        return {
            success: false,
            message: getErrorMessage(error),
            data: null,
        };
    }
};
