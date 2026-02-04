import prisma from "@/lib/db";
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
            works,
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
        
    } catch (e) {
        console.error("Error creating event:", e);
        return NextResponse.json({
            message: "Failed to create event",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}