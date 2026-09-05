"use server";

import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { skillSchema, skillSchemaType } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/utils";
import { verifyAuth } from "@/lib/auth";

export const createSkill = async (skillData: skillSchemaType) => {
    let uploadedFileId: string | null = null;
    try {
        await verifyAuth();
        const result = skillSchema.safeParse(skillData);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }
        const data = result.data;
        if (!data.image) {
            throw new Error("Image for skill is required");
        }

        const arrayBuffer = await data.image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: data.image.name,
            folder: "/portfolio/skill",
        });

        uploadedFileId = uploadResponse.fileId;

        const newSkill = await prisma.$transaction(async (tx) => {
            const skill = await tx.skill.create({
                data: {
                    name: data.name,
                    category: data.category,
                    level: data.level,
                    image: uploadResponse.url,
                    fileId: uploadedFileId,
                },
            });
            return skill;
        });
        return {
            success: true,
            message: "Skill created successfully",
            data: newSkill,
        };
    } catch (error) {
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

export const deleteSkill = async (id: number) => {
    try {
        await verifyAuth();
        const skill = await prisma.skill.findUnique({
            where: { id },
        });

        if (!skill) {
            throw new Error("Skill not found");
        }

        if (skill.fileId) {
            await imagekit.deleteFile(skill.fileId);
        }

        await prisma.skill.delete({
            where: { id },
        });

        return {
            success: true,
            message: "Skill deleted successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

interface UpdateSkillProps {
    id: number;
    skillData: skillSchemaType;
}
export const updateSkill = async ({ id, skillData }: UpdateSkillProps) => {
    let uploadedFileId: string | null = null;
    try {
        await verifyAuth();
        const existingSkill = await prisma.skill.findUnique({
            where: { id },
        });

        if (!existingSkill) {
            throw new Error("Skill not found");
        }

        const result = skillSchema.safeParse(skillData);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }
        const data = result.data;
        let imageUrl = existingSkill.image;
        let fileId = existingSkill.fileId;

        if (data.image) {
            const arrayBuffer = await data.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: data.image.name,
                folder: "/portfolio/skill",
            });
            uploadedFileId = uploadResponse.fileId;
            imageUrl = uploadResponse.url;
            fileId = uploadedFileId;
        }

        const updatedSkill = await prisma.$transaction(async (tx) => {
            const updated = await tx.skill.update({
                where: { id },
                data: {
                    name: data.name,
                    category: data.category,
                    level: data.level,
                    image: imageUrl,
                    fileId: fileId,
                },
            });
            return updated;
        });

        if (data.image && existingSkill.fileId) {
            await imagekit.deleteFile(existingSkill.fileId);
        }

        return {
            success: true,
            message: "Skill updated successfully",
            data: updatedSkill,
        };
    } catch (error) {
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
