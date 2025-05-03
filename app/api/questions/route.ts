import { getQuestions } from "@/app/lib/questions";
import { NextResponse } from "next/server";

export async function GET() {
    let questions: any;
    try {
        questions = await getQuestions(10);
    } catch (error) {
        return new NextResponse("[]", {
            status: 500,
        });
    }

    return new NextResponse(JSON.stringify(questions), {
        status: 200,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
