import "server-only";

import { db } from "@/app/lib/database";

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

export function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
