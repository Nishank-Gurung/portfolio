import prisma from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { userSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await prisma.user.findFirst();
        return NextResponse.json(
            {
                message: "User retrieved successfully",
                success: true,
                user:user,
            },
            {
                status: 200,
            },
        );
    } catch (e) {
        console.error("Error retrieving user:", e);
        return NextResponse.json({
            message: "Failed to retrieve user",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}

export async function POST(req: NextRequest) {
    let uploadFileId: string | null = null;
    try {
        const userData = await prisma.user.findUnique({
            where: { id: 1 },
        });

        if (!userData) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No user found",
                },
                {
                    status: 500,
                },
            );
        }
        const formData = await req.formData();

        const rawData = Object.fromEntries(formData.entries());
        const result = userSchema.safeParse(rawData);

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
                where: {id: userData.id},
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
            return newUser
        });

        return NextResponse.json({
            success: true,
            message: "User updated successfully",
            user: user,
        });

    } catch (e) {
        console.error("Error updating user:", e);
        if (uploadFileId) {
            try {
                await imagekit.deleteFile(uploadFileId);
            } catch (deleteError) {
                console.error("Image rollback failed:", deleteError);
            }
        }
        return NextResponse.json({
            message: "Failed to update user",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}
