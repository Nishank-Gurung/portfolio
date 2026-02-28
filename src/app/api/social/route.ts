import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { socialMediaSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const socials = await prisma.socialMedia.findMany();
        return NextResponse.json(
            {
                message: "Social Medias retrieved successfully",
                success: true,
                social:socials,
            },
            {
                status: 200,
            },
        );
    } catch (e) {
        console.error("Error retrieving social medias:", e);
        return NextResponse.json({
            message: "Failed to retrieve social medias",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}

export async function POST(req: NextRequest) {
    let uploadedFileId: string | null = null;
    try {
        const formData = await req.formData();
        const rawData = Object.fromEntries(formData.entries());
        const result = socialMediaSchema.safeParse(rawData);

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
        return NextResponse.json({
            success: true,
            message: "Scoial media added successfully.",
            social: social,
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
