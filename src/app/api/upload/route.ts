
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
    const formData = await request.formData();
    const files = formData.getAll("file");

    if (!files || files.length === 0) {
        return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadsDir, { recursive: true });

    for (const file of files) {
        if (file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
            const filepath = path.join(uploadsDir, filename);
            await writeFile(filepath, buffer);
            uploadedUrls.push(`/uploads/${filename}`);
        }
    }

    return NextResponse.json({ urls: uploadedUrls });
}
