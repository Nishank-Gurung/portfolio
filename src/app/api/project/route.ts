import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { projectSchema } from "@/lib/schemas";
import { generateSlug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const projects = await prisma.project.findMany();
        return NextResponse.json(
            {
                message: "Projects retrieved successfully",
                success: true,
                project: projects,
            },
            {
                status: 200,
            },
        );
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
            techStack: JSON.parse(formData.get("techStack") as string),
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
            folder: "/portfolio/project",
        });

        uploadedFileId = uploadResponse.fileId;

        const project = await prisma.$transaction(async (tx) => {
            const createdProject = await tx.project.create({
                data: {
                    title: data.title,
                    slug: generateSlug(data.title),
                    description: data.description,
                    url: data.url,
                    image: uploadResponse.url,
                    fileId: uploadResponse.fileId,
                    techStack: data.techStack,
                    isFeatured: data.isFeatured,
                    category: data.category,
                },
            });

            return createdProject;
        });

        return NextResponse.json({
            success: true,
            message: "Project added successfully.",
            project: project,
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

/*
         "message": {
        "fileId": "699090785c7cd75eb8592e94",
        "name": "v1_baThwj2MP.jpg",
        "size": 1360161,
        "versionInfo": {
            "id": "699090785c7cd75eb8592e94",
            "name": "Version 1"
        },
        "filePath": "/DevEvent/v1_baThwj2MP.jpg",
        "url": "https://ik.imagekit.io/nroxmllhk/DevEvent/v1_baThwj2MP.jpg",
        "fileType": "image",
        "height": 2624,
        "width": 3936,
        "thumbnailUrl": "https://ik.imagekit.io/nroxmllhk/tr:n-ik_ml_thumbnail/DevEvent/v1_baThwj2MP.jpg",
        "AITags": null,
        "description": null
    }
        */
