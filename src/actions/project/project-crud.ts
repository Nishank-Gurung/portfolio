"use server";

import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { projectSchema, projectSchemaType } from "@/lib/schemas";
import { generateSlug, getErrorMessage } from "@/lib/utils";
import { verifyAuth } from "@/lib/auth";

export const createProject = async (projectData: projectSchemaType) => {
    let uploadedFileId: string | null = null;
    try {
        await verifyAuth();
        const result = projectSchema.safeParse(projectData);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }
        const data = result.data;
        if (!data.image) {
            throw new Error("Image for project is required");
        }

        const arrayBuffer = await data.image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await imagekit.upload({
            file: buffer,
            fileName: data.image.name,
            folder: "/portfolio/project"
        });

        uploadedFileId = uploadResult.fileId;

        const project = await prisma.$transaction(async (tx) => {
            const createdProject = await tx.project.create({
                data: {
                    title: data.title,
                    slug: generateSlug(data.title),
                    description: data.description,
                    url: data.url,
                    image: uploadResult.url,
                    fileId: uploadResult.fileId,
                    techStack: data.techStack,
                    isFeatured: data.isFeatured,
                    category: data.category,
                },
            });

            return createdProject;
        });
        return {
            success: true,
            message: "Project created successfully",
            data: project,
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

export const deleteProject = async (id: number) => {
    try {
        await verifyAuth();
        const project = await prisma.project.findUnique({
            where: { id },
        });

        if (!project) {
            return {
                success: false,
                message: "Project not found",
            };
        }

        if (project.fileId) {
            await imagekit.deleteFile(project.fileId);
        }

        await prisma.project.delete({
            where: { id },
        });

        return {
            success: true,
            message: "Project deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting project:", error);
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};
interface UpdateProjectProps {
    id: number;
    projectData: projectSchemaType;
}
export const updateProject = async (
    { id, projectData }: UpdateProjectProps
) => {
    let uploadedFileId: string | null = null;
    try {
        await verifyAuth();
        const existingProject = await prisma.project.findUnique({
            where: { id },
        });

        if (!existingProject) {
            throw new Error("Project not found");
        }

        const result = projectSchema.safeParse(projectData);
        if (!result.success) {
            const first = result.error.issues[0];
            throw new Error(first?.message ?? "Validation failed");
        }

        const data = result.data;
        let imageUrl = existingProject.image;
        let fileId = existingProject.fileId;

        if (data.image) {
            const arrayBuffer = await data.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await imagekit.upload({
                file: buffer,
                fileName: data.image.name,
            });

            uploadedFileId = uploadResult.fileId;
            imageUrl = uploadResult.url;
            fileId = uploadResult.fileId;
        }

        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                title: data.title,
                slug: generateSlug(data.title),
                description: data.description,
                url: data.url,
                image: imageUrl,
                fileId: fileId,
                techStack: data.techStack,
                isFeatured: data.isFeatured,
                category: data.category,
            },
        });

        return {
            success: true,
            message: "Project updated successfully",
            data: updatedProject,
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
