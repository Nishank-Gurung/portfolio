import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
       const user = await prisma.user.findFirst();
       return NextResponse.json(
        {
            message: "User retrieved successfully",
            success: true,
            user,
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