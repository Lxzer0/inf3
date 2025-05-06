"use client";
import { newQuestionType } from "@/app/lib/questions";
import { transformQuestions } from "@/app/lib/utils";
import { useEffect, useRef, useState } from "react";

export function QuestionList({ questions }: { questions: newQuestionType[] }) {
    type data = {
        currentQuestion: number;
        ongoing: boolean;
        questions: newQuestionType[];
    };
    const [data, setData] = useState<data>({
        currentQuestion: 0,
        ongoing: true,
        questions,
    });

    function handleClick(index: number) {
        setData((prev) => {
            if (prev.currentQuestion >= prev.questions.length) return prev;
            const next = { ...prev };
            if (next.ongoing) next.questions[next.currentQuestion].selected = index;
            next.currentQuestion++;
            return next;
        });
    }

    function viewQuestions() {
        setData((prev) => {
            return {
                currentQuestion: 0,
                ongoing: false,
                questions: prev.questions,
            };
        });
    }

    async function newQuestions() {
        try {
            const response = await fetch("/api/questions");
            if (!response.ok) throw new Error("Fetch failed");
            setData({
                currentQuestion: 0,
                ongoing: true,
                questions: transformQuestions(
                    await response.json(),
                ) as newQuestionType[],
            });
        } catch (error) {
            console.error(error);
        }
    }

    function handleEvent(event: KeyboardEvent) {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.repeat) return;
        switch (event.key) {
            case "a":
            case "f": {
                handleClick(0);
                break;
            }
            case "b":
            case "g": {
                handleClick(1);
                break;
            }
            case "c":
            case "h": {
                handleClick(2);
                break;
            }
            case "d":
            case "j": {
                handleClick(3);
                break;
            }
            case "ArrowRight": {
                setData((prev) => {
                    const next = { ...prev };
                    next.currentQuestion++;
                    return next;
                });
                break;
            }
            case "ArrowLeft": {
                setData((prev) => {
                    const next = { ...prev };
                    next.currentQuestion = next.currentQuestion < 1
                        ? next.currentQuestion
                        : next.currentQuestion - 1;
                    return next;
                });
                break;
            }
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleEvent);
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center">
            {data.currentQuestion < data.questions.length ? (
                <Question
                    el={data.questions[data.currentQuestion]}
                    num={data.currentQuestion + 1}
                    onSelect={handleClick}
                    update={data.ongoing}
                />
            ) : (
                <Last
                    n={data.questions.length}
                    correct={data.questions.reduce((acc, cur) => acc + (cur.selected == cur.correctI ? 1 : 0), 0)}
                    viewQuestions={viewQuestions}
                    newQuestions={newQuestions}
                    ongoing={data.ongoing}
                />
            )}
        </div>
    );
}

function getClasses(i: number, el: newQuestionType, update: boolean): string {
    if (update && i == el.selected) return " bg-white text-black";
    if (update) return " btn";
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
    ongoing,
}: {
    correct: number;
    n: number;
    viewQuestions: () => void;
    newQuestions: () => void;
    ongoing: boolean;
}) {
    return (
        <div className="border border-white text-xl p-4 flex max-w-2/3 items-center justify-center">
            <div className="w-full flex-col flex items-center justify-center gap-8 my-4">
                <div>Click "Done" to show the stats and answers</div>
                {ongoing ? null : <div>{correct} correct ({100 * correct / n}%), {n - correct} wrong.</div>}
                <div className="flex flex-row gap-2">
                    <button className="border border-white cursor-pointer hover:text-black hover:bg-white p-2" onClick={newQuestions}>Try again</button>
                    <button className="border border-white cursor-pointer hover:text-black hover:bg-white p-2" onClick={viewQuestions}>Done</button>
                </div>
            </div>
        </div>
    );
}
