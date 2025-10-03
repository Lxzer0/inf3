export const dynamic = "force-dynamic";

import { QuestionList } from "@/app/components/question";
import { getQuestions } from "@/app/lib/questions";
import { transformQuestions } from "@/app/lib/utils";

export default async function Exam({ params }: { params: Promise<{ exam_id: string }> }) {
    const { exam_id } = await params;
    const questions = await getQuestions(10, exam_id);
    return <QuestionList questions={transformQuestions(questions)} exam_id={exam_id} />;
}
