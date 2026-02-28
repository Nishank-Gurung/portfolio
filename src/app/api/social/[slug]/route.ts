import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { socialMediaSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const socialId = Number((await params).slug);
        const social = await prisma.socialMedia.findUnique({
            where: { id: socialId },
        });

        if (!social) {
            return NextResponse.json(
                { success: false, message: "Social media not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, social:social });
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch social media",
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
        const socialId = Number((await params).slug);
        const existingSocial = await prisma.socialMedia.findUnique({
            where: { id: socialId },
        });

        if (!existingSocial) {
            return NextResponse.json(
                { success: false, message: "Social media not found" },
                { status: 404 },
            );
        }
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

        let imageUrl = existingSocial.image;
        let fileId = existingSocial.fileId;

        if (data.image) {
            const arrayBuffer = await data.image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: data.image.name,
                folder: "/portfolio/project",
            });

            newUploadedFileId = uploadResponse.fileId;
            imageUrl = uploadResponse.url;
            fileId = uploadResponse.fileId;
        }

        const updateSocial = await prisma.$transaction(async (tx) => {
            const updated = await tx.socialMedia.update({
                where: { id: socialId },
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

        return NextResponse.json({
            success: true,
            message: "Scoial media updated successfully.",
            social: updateSocial,
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
                message: "Failed to update social media",
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
        const socialId = Number((await params).slug);

        const existingSocial = await prisma.socialMedia.findUnique({
            where: { id: socialId },
        });

        if (!existingSocial) {
            return NextResponse.json(
                { success: false, message: "Social media not found" },
                { status: 404 },
            );
        }

        await prisma.socialMedia.delete({
            where: { id: socialId },
        });

        if (existingSocial.fileId) {
            try {
                await imagekit.deleteFile(existingSocial.fileId);
            } catch (deleteError) {
                console.error("Image deletion failed:", deleteError);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Social media deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete social media",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}   