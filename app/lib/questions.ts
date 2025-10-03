import "server-only";

import { db } from "@/app/lib/database";
import { shuffleArray } from "@/app/lib/utils";

export type questionType = Awaited<ReturnType<typeof getQuestions>>[0];

export type newQuestionType = questionType & {
    answers: string[];
    selected: number;
    correctI: number;
};

let cachedQuestions: Record<string, Awaited<ReturnType<typeof fetchQuestions>>> = {};

async function fetchQuestions(exam_id: string) {
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
        .where("exam_id", "=", exam_id)
        .execute();
}

export async function getQuestions(n: number, exam_id: string) {
    if (cachedQuestions[exam_id])
        return shuffleArray(cachedQuestions[exam_id]).slice(0, n);
    cachedQuestions[exam_id] = await fetchQuestions(exam_id);
    return shuffleArray(cachedQuestions[exam_id]).slice(0, n);
}
