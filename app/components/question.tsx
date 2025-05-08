"use client";
import { newQuestionType } from "@/app/lib/questions";
import { transformQuestions } from "@/app/lib/utils";
import { useState } from "react";

export function QuestionList({ questions }: { questions: newQuestionType[] }) {
    const [cid, setCid] = useState<number>(0);
    const [ongoing, setOngoing] = useState<boolean>(true);
    const [nq, setNq] = useState<newQuestionType[]>(questions);

    function handleClick(index: number) {
        setNq((prev) => {
            if (!ongoing) return prev;
            const updated = [...prev];
            updated[cid] = { ...updated[cid], selected: index };
            return updated;
        });
        setCid((prev) => prev + 1);
    }

    function viewQuestions() {
        setOngoing(false);
        setCid(0);
    }

    async function newQuestions() {
        try {
            const response = await fetch('/api/questions');
            if (!response.ok) {
                throw new Error('Fetch failed');
            }
            const newQuestions: newQuestionType[] = transformQuestions(await response.json());
            setNq(newQuestions);
            setCid(0);
            setOngoing(true);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            {cid < nq.length ? (
                <Question el={nq[cid]} num={cid + 1} onSelect={handleClick} update={ongoing} />
            ) : (
                <Last
                    n={nq.length}
                    correct={nq.reduce((acc, cur) => acc + (cur.selected == cur.correctI ? 1 : 0), 0)}
                    viewQuestions={viewQuestions}
                    newQuestions={newQuestions}
                />
            )}
        </div>
    );
}

function getClasses(i: number, el: newQuestionType, update: boolean): string {
    if (update) return " hover:text-black hover:bg-white";
    if (i == el.correctI) return " bg-green-950";
    if (i == el.selected) return " bg-red-900";
    return "";
}

function Question({
    el,
    num,
    onSelect,
    update,
}: {
    el: newQuestionType;
    num: number;
    onSelect: (index: number) => void;
    update: boolean;
}) {
    return (
        <div className="border border-white text-xl p-4 flex flex-col gap-4 max-w-2/3">
            <div>
                {num}. {el.question}
            </div>
            <div className="text-lg flex flex-col gap-1">
                {el.answers.map((e, i) => (
                    <div key={i} className={`cursor-pointer${getClasses(i, el, update)}`} onClick={() => onSelect(i)}>
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

function Last({
    correct,
    n,
    viewQuestions,
    newQuestions,
}: {
    correct: number;
    n: number;
    viewQuestions: () => void;
    newQuestions: () => void;
}) {
    return (
        <div className="border border-white text-xl p-4 flex max-w-2/3 items-center justify-center">
            <div className="w-full flex-col flex items-center justify-center gap-8 my-4">
                <div>You have finished, {correct} correct ({100 * correct / n}%), {n - correct} wrong.</div>
                <div className="flex flex-row gap-2">
                    <button className="border border-white cursor-pointer hover:text-black hover:bg-white p-2" onClick={newQuestions}>Try again</button>
                    <button className="border border-white cursor-pointer hover:text-black hover:bg-white p-2" onClick={viewQuestions}>View questions</button>
                </div>
            </div>
        </div>
    );
}
