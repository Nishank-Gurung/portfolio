import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
       const socials = await prisma.socialMedia.findMany();
       return NextResponse.json(
        {
            message: "Social Medias retrieved successfully",
            success: true,
            socials,
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