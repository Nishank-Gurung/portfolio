import prisma from "@/lib/db";
import { educationSchema } from "@/lib/schemas";
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
                education:educations,
            },
            {
                status: 200,
            },
        );
    } catch (e) {
        console.error("Error retrieving educations:", e);
        return NextResponse.json({
            message: "Failed to retrieve educations",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        console.log("startDate raw:", formData.get("startDate"));
        console.log("endDate raw:", formData.get("endDate"));

        const rawData = Object.fromEntries(formData.entries());
        const result = educationSchema.safeParse(rawData);

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

        const newEducation = await prisma.$transaction(async (tx) => {
            const edu = await tx.education.create({
                data: {
                    institution: data.institution,
                    degree: data.degree,
                    field: data.fieldOfStudy,
                    description: data.description,
                    isCurrent: data.isCurrent,
                    startDate: data.startDate,
                    endDate: data.endDate,
                },
            });
            return edu;
        });
        return NextResponse.json({
            success: true,
            message: "Education created successfully",
            education: newEducation,
        });
    } catch (e) {
        console.error("Error creating education:", e);
        return NextResponse.json({
            message: "Failed to create education",
            error: e instanceof Error ? e.message : "Unknown error",
            status: 500,
        });
    }
}
