import { useState } from "react";
import { useFetcher, useLoaderData, useParams } from "react-router";

import { type ProblemSet } from "../components/Types";
import { initUserDB, writeProblemStatus } from "../components/services";

export default function AnswerPage() {
    const loaderParams = useLoaderData<ProblemSet | null>();
	const params = useParams();
    const fetcher = useFetcher();
    let isBusy = fetcher.state !== "idle";

    const [index, setIndex] = useState<number>(0);
    const [finished, setFinished] = useState<boolean>(false);

	/** Fallback **/
    if (!loaderParams) {
        return (
            <div className="flex flex-column items-center justify-center h-dvh bg-slate-950">
                <div className="bg-white rounded-sm w-50% h-50% p-10 text-red-500 text-xl">
                    Failed to load problem set, come back later
                </div>
            </div>
        );
    }

    async function handleChangeToNextQuestion(
        e: React.MouseEvent<HTMLButtonElement>
    ) {
        e.preventDefault();
        if (index + 1 === loaderParams?.problems.length) {
			const browserDB = await initUserDB();
			if (browserDB) {
				await writeProblemStatus(browserDB, { problemSetID: Number(params.id), completed: true })
			}
			setFinished(true);
        } else {
            setIndex(index + 1);
        }
        fetcher.data = {};
    }

    return (
        <>
            {loaderParams.problems.length > 0 && !finished && (
                <fetcher.Form
                    className="block p-4 rounded-sm text-white text-center bg-zinc-600"
                    action=""
                    method="post"
                >
                    <h3 className="text-2xl text-left" id="name">
                        {loaderParams.problems[index]?.problem}
                    </h3>
                    {loaderParams.problems[index]?.type === "input" && (
                        <Input />
                    )}
                    {loaderParams.problems[index]?.type === "tf" && <TF />}
                    {loaderParams.problems[index]?.type === "multi" && (
                        <Multi
                            options={loaderParams.problems[index]?.options}
                        />
                    )}
                    <input
                        className="bg-lime-400 w-full mt-1 rounded-sm text-xl font-bold text-white text-shadow-lg"
                        type="submit"
                        value="Submit"
                        disabled={isBusy}
                    />
					<input value={loaderParams.problems[index]?.id} onChange={() => {}} name="id" hidden/>
					<input value={loaderParams.problems[index]?.setIndex} onChange={() => {}} name="setIndex" hidden/>
                </fetcher.Form>
            )}
            {!isBusy && !finished && fetcher.data?.state == "Correct" && (
                <div className="rounded-sm border-lime-400 border-2 p-3">
                    <h3 className="text-2xl text-left text-lime-200">
                        {fetcher.data.state}
                    </h3>
                    <button
                        onClick={handleChangeToNextQuestion}
                        className="bg-lime-400 w-full px-3 mt-1 rounded-sm text-xl font-bold text-white text-shadow-lg"
                    >
                        Next Question
                    </button>
                </div>
            )}
            {!isBusy && !finished && fetcher.data?.state == "Incorrect" && (
                <div className="rounded-sm border-red-400 border-2 p-3">
                    <h3 className="text-2xl text-left text-red-300">
                        {fetcher.data.state}
                    </h3>
                    <p className="text-lg text-left text-red-200">
                        Please Try Again
                    </p>
                </div>
            )}
            {!isBusy && finished && (
                <div className="rounded-sm border-lime-400 border-2 p-3">
                    <h3 className="text-2xl text-left text-lime-200">
                        Completed
                    </h3>
                </div>
            )}
        </>
    );
}

function Input() {
    return (
        <>
            <input
                className="w-full pr-1 pl-1 text-lg border-white border-b-2 outline-hidden"
                name="answer"
                type="text"
                placeholder="Answer"
            />
            <input name="type" value="input" onChange={() => {}} hidden />
        </>
    );
}

function Multi({ options }: { options: string[] | undefined }) {
    return (
        <>
            <select
                name="answer"
                className="bg-stone-400 text-lg p-2 rounded-sm"
            >
                {options?.map((val, key) => {
                    return <option key={key}>{val}</option>;
                })}
            </select>
            <input name="type" value="multi" hidden />
        </>
    );
}

function TF() {
    return (
        <>
            <select
                name="answer"
                className="bg-stone-400 text-lg p-2 rounded-sm"
            >
                <option className="">True</option>
                <option className="">False</option>
            </select>
            <input name="type" value="tf" hidden />
        </>
    );
}
