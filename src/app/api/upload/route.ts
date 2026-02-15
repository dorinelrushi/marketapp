
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

// Image schema to store images in MongoDB
const ImageSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: String, // Base64 encoded image data
    createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("file");

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
        }

        await connectToDatabase();

        const uploadedUrls: string[] = [];

        for (const file of files) {
            if (file instanceof File) {
                // Convert file to buffer
                const buffer = Buffer.from(await file.arrayBuffer());

                // Convert to Base64
                const base64Data = buffer.toString('base64');

                // Create data URL
                const dataUrl = `data:${file.type};base64,${base64Data}`;

                // Save to MongoDB
                const imageDoc = await Image.create({
                    filename: file.name,
                    contentType: file.type,
                    data: dataUrl
                });

                // Return the data URL directly (it can be used in img src)
                uploadedUrls.push(dataUrl);

                console.log(`Uploaded image ${file.name} to MongoDB with ID: ${imageDoc._id}`);
            }
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload images", details: error.message },
            { status: 500 }
        );
    }
}
