import { QuestionList } from "@/app/components/question";
import { getQuestions } from "@/app/lib/questions";

export default async function Home() {
    const questions = await getQuestions(10);
    return <QuestionList questions={ questions} />;
}
