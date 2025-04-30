import "server-only";

import { db } from "@/app/lib/database";
import { shuffleArray } from "@/app/lib/utils";

export type questionType = Awaited<ReturnType<typeof getQuestions>>[0];

let cachedQuestions: Awaited<ReturnType<typeof fetchQuestions>> | null = null;

async function fetchQuestions() {
    return await db
        .selectFrom("questions")
        .select([
            "question",
            "answer_correct",
            "answer_incorrect0",
            "answer_incorrect1",
            "answer_incorrect2",
            "image",
        ])
        .execute();
}

export async function getQuestions(n: number) {
    if (cachedQuestions) return shuffleArray(cachedQuestions).slice(0, n);
    cachedQuestions = await fetchQuestions();
    return shuffleArray(cachedQuestions).slice(0, n);
}
