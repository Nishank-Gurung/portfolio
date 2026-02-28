import prisma from "@/lib/db";
import { experienceSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const works = await prisma.workExperience.findMany({
            orderBy: {
                startDate: "desc",
            },
        });
        return NextResponse.json(
            {
                message: "Work Experience retrieved successfully",
                success: true,
                work:works,
            },
            {
                status: 200,
            },
        );
    } catch (e) {
        console.error("Error retrieving work experience:", e);
        return NextResponse.json({
            message: "Failed to retrieve work experience",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const rawData = {
            ...Object.fromEntries(formData.entries()),
            skills: JSON.parse(formData.get("skills") as string),
        };
        const result = experienceSchema.safeParse(rawData);

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

        const newWork = await prisma.workExperience.create({
            data: {
                ...data,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Work Experience created successfully",
            work: newWork,
        });
    } catch (e) {
        console.error("Error creating event:", e);
        return NextResponse.json({
            message: "Failed to create event",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}
