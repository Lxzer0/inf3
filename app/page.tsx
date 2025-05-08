import { QuestionList } from "@/app/components/question";
import { getQuestions } from "@/app/lib/questions";
import { transformQuestions } from "@/app/lib/utils";

export default async function Home() {
    const questions = await getQuestions(10);
    return <QuestionList questions={ transformQuestions(questions) } />;
}
