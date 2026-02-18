// import { imagekit } from "@/lib/imagekit";
// import { educationSchema } from "@/lib/schemas";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(
//     req: NextRequest,
//     { params }: { params: { slug: string } },
// ) {
//     let newUploadedFileId: string | null = null;

//     try {



//         const formData = await req.formData();
//         const rawData = Object.fromEntries(formData.entries());

//         const result = educationSchema.safeParse(rawData);

//         if (!result.success) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Invalid input",
//                     details: result.error.message,
//                 },
//                 { status: 400 },
//             );
//         }

//         const data = result.data;


        
//         return NextResponse.json({
//             success: true,
//             message: "Project updated successfully",
//             // project: updatedProject,
//         });
//     } catch (error) {
//         console.error("Update error:", error);

//         // 🔄 Rollback uploaded image if DB fails
//         if (newUploadedFileId) {
//             try {
//                 await imagekit.deleteFile(newUploadedFileId);
//             } catch (deleteError) {
//                 console.error("Image rollback failed:", deleteError);
//             }
//         }

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Failed to update project",
//                 error: error instanceof Error ? error.message : "Unknown error",
//             },
//             { status: 500 },
//         );
//     }
// }
