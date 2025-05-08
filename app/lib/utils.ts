import { questionType, newQuestionType } from "@/app/lib/questions";

export function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export function transformQuestions(questions: questionType[]): newQuestionType[] {
    return questions.map((q) => {
        const answers = shuffleArray([
            q.answer_correct,
            q.answer_incorrect0,
            q.answer_incorrect1,
            q.answer_incorrect2,
        ]);
        return {
            ...q,
            selected: -1,
            answers,
            correctI: answers.findIndex((e) => e === q.answer_correct),
        };
    });
}