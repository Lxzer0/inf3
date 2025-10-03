import { questionType, getQuestions } from "@/app/lib/questions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ exam_id: string }> }) {
    const { exam_id } = await params;

    if (!exam_id) return new NextResponse(JSON.stringify({ error: "Missing params" }), { status: 400 });

    let questions: questionType[];
    try {
        questions = await getQuestions(10, exam_id);
    } catch (error) {
        return new NextResponse("[]", { status: 500 });
    }

    return new NextResponse(JSON.stringify(questions), {
        status: 200,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
