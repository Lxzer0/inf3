"use client";
import { questionType } from "@/app/lib/questions";
import { useState } from "react";
import { shuffleArray } from "@/app/lib/utils";

type newQuestionType = questionType & {
    answers: string[];
    selected: number;
    correctI: number;
};

export function QuestionList({ questions }: { questions: questionType[] }) {
    const [cid, setCid] = useState<number>(0);
    const [nq, setNq] = useState<newQuestionType[]>(
        questions
            .map((q) => {
                return {
                    ...q,
                    selected: -1,
                    answers: shuffleArray([
                        q.answer_correct,
                        q.answer_incorrect0,
                        q.answer_incorrect1,
                        q.answer_incorrect2,
                    ]),
                };
            })
            .map((q) => {
                return {
                    ...q,
                    correctI: q.answers.findIndex((e) => e == q.answer_correct),
                };
            }),
    );

    function handleClick(index: number) {
        setNq((prev) => {
            const updated = [...prev];
            updated[cid] = { ...updated[cid], selected: index };
            return updated;
        });
        setCid((prev) => prev + 1);
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            {cid < nq.length ? (
                <Question el={nq[cid]} num={cid + 1} onSelect={handleClick} />
            ) : (
                <Last
                    n={nq.length}
                    correct={nq.reduce((acc, cur) => acc + (cur.selected == cur.correctI ? 1 : 0), 0)}
                />
            )}
        </div>
    );
}

function Question({
    el,
    num,
    onSelect,
}: {
    el: newQuestionType;
    num: number;
    onSelect: (index: number) => void;
}) {
    return (
        <div className="border border-white text-xl p-4 flex flex-col gap-4 max-w-2/3">
            <div>
                {num}. {el.question}
            </div>
            <div className="text-lg flex flex-col gap-1">
                {el.answers.map((e, i) => (
                    <div key={i} className="cursor-pointer hover:text-black hover:bg-white" onClick={() => onSelect(i)}>
                        {"ABCD"[i] || "what"}. {e}
                    </div>
                ))}
            </div>
            {el.image ? (
                <img className="max-w-full" src={`/api/img/${el.image}`} alt="" />
            ) : null}
        </div>
    );
}

function Last({ correct, n }: { correct: number; n: number }) {
    return (
        <div className="border border-white text-xl p-4 flex flex-col max-w-2/3">
            You have finished, {correct} correct, {n - correct} wrong.
        </div>
    );
}
