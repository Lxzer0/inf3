import { db } from "@/app/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    let { id }  = await params;

    if (!id) return new NextResponse(JSON.stringify({ error: 'Missing params' }), { status: 400 });

    try { id = Number(id) } catch (error) { return new NextResponse(JSON.stringify({ error: 'Invalid params' }), { status: 400 }); }

    let image;

    try {
        image = await db
            .selectFrom('images')
            .select(['data', 'mime'])
            .where('id', '=', id)
            .executeTakeFirst();
    } catch (error) {
        console.error('Error fetching image:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }

    if (!image) return new NextResponse(JSON.stringify({ error: 'Image not found' }), { status: 404 });

    return new NextResponse(image.data, {
        status: 200,
        headers: {
            'Content-Type': image.mime,
            'Cache-Control': 'max-age=604800'
        },
    });
}
