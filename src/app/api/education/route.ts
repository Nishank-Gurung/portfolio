import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function GET() {
    try {
        const educations = await prisma.education.findMany({
            orderBy: {
                startDate: "desc",
            },
        });
        return NextResponse.json(
            {
                message: "Educations retrieved successfully",
                success: true,
                educations,
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
    try {
    } catch (e) {
        console.error("Error creating event:", e);
        return NextResponse.json({
            message: "Failed to create event",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}
