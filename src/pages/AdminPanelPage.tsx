import { useNavigate } from "react-router";
import { useAuth } from "../components/AuthContext"
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import Dropdown from "../components/Dropdown";
import { DataSnapshot, get, push, ref, remove, set, update } from "firebase/database";
import { db } from "../firebase";
import type { AdminProblemSet, AdminProblem } from "../components/Types";

export default function AdminPanelPage() {
	const auth = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(true);

	const [campaignNames, setCampaignNames] = useState<string[]>([]);
	const [problemSetNames, setProblemSetNames] = useState<{id: string, parentID: string, setName: string}[]>([]);

	const [problemSet, setProblemSet] = useState<AdminProblemSet>({problems: []});
	const [problemSetName, setProblemSetName] = useState<string>("");
	const [problemSetID, setProblemSetID] = useState<string>("");
	const [problemID, setProblemID] = useState<string>("");
	const [problemName, setProblemName] = useState<string>("problem");
	const [problemType, setProblemType] = useState<string>("input");
	const [problemDifficulty, setProblemDifficulty] = useState<string>("easy");
	const [problemAnswer, setProblemAnswer] = useState<string>("");
	const [multiAnswers, setMultiAnswers] = useState<string[]>([]);
	const [isModifying, setIsModifying] = useState<boolean>(false);

	const [selected, setSelected] = useState<number>(0);
	const [show, setShow] = useState<boolean>(false);

	const [status, setStatus] = useState<{status: "error" | "success" | "idle", message: string}>({status: "idle", message: ""});

	const updateProblemSetList = useCallback(() => {
		get(ref(db, 'problemsetnames/' + campaignNames[selected])).then((snapshot: DataSnapshot) => {
			if (!snapshot.exists()) {
				return;
			}
			const setNames: {[key: string]: { id: string, parentID: string, setName: string }} = snapshot.val();
			const setNamesList = [];
			for (const key in setNames) {
				if (key === 'default') {
					continue;
				}
				setNamesList.push({
					...setNames[key],
					parentID: key
				});
			}
			setProblemSetNames(setNamesList);
		}).catch(() => {})
	}, [setProblemSetNames, campaignNames, selected])

	useEffect(() => {
		setLoading(true);
		if (auth && auth.currentUser) {
			auth.currentUser.getIdTokenResult().then((idTokenResult) => {
				if (!idTokenResult || !idTokenResult.claims.admin) {
					navigate("/");
				}
			}).catch(() => {
				navigate("/");
			});
		}
		setLoading(false);
	}, [auth, auth?.currentUser, navigate])

	useEffect(() => {
		if (!auth || !auth.currentUser) {
			return;
		}
		get(ref(db, 'problemsetnames')).then((snapshot: DataSnapshot) => {
			if (!snapshot.exists()) {
				return;
			}
			setCampaignNames(Object.keys(snapshot.val()));
		}).catch(() => {})
	}, [auth, auth?.currentUser])

	useEffect(() => {
		if (campaignNames.length <= 0) {
			return;
		}
		updateProblemSetList()
	}, [campaignNames.length, updateProblemSetList])

	if (loading) {
		return (
			<div className="flex flex-row justify-center items-center w-full h-full text-white">
				<h1>Loading...</h1>
			</div>
		)
	}

	function handleAddProblemSet(event: React.FormEvent) {
		resetStatus();
		event.preventDefault();

		if (!campaignNames[selected]) {
			setStatus({
				status: 'error',
				message: 'Create a campaign first!'
			})
			return;
		}

		const formData = new FormData(event.target as HTMLFormElement);
		const problemSetRef = push(ref(db, 'problemsets/'));
		push(problemSetRef, { 
			problem: "problem name", 
			type: "input", 
			difficulty: "easy", 
			answer: "answer"
		})
		push(ref(db, 'problemsetnames/'+campaignNames[selected]), {
			id: problemSetRef.key as string,
			setName: formData.get("setName") as string
		}).then(() => {
			updateProblemSetList();
		}).catch(() => {
			updateProblemSetList();
		})
	}
	function handleSelectProblemSet(id: string, setName: string) {
		resetStatus();

		get(ref(db, 'problemsets/'+id)).then((snapshot: DataSnapshot) => {
			if (!snapshot.exists()) {
				return;
			}
			const problemSetSnapshot = snapshot.val();
			const problemSetList: AdminProblemSet = { problems: [] };
			for (const key in problemSetSnapshot) {
				problemSetList.problems.push({
					...problemSetSnapshot[key],
					id: key
				})
			}
			setProblemSet(problemSetList);
			setProblemSetName(setName);
			setProblemSetID(id);
		}).catch(() => {
			setStatus({
				status: 'error',
				message: 'Failed to load problem set'
			});
		})
	}
	function handleExitProblemSet() {
		resetStatus();

		setProblemSet({ problems: [] });
		setProblemSetName("");
	}
	function handleDeleteProblemSet(key: number) {
		resetStatus();

		remove(ref(db, 'problemsets/' + problemSetNames[key].id));
		remove(ref(db, 'problemsetnames/' + campaignNames[selected] + "/" + problemSetNames[key].parentID)).then(() => {
			updateProblemSetList();
		}).catch(() => {
			setStatus({
				status: 'error',
				message: 'Failed to remove problem set'
			});
			updateProblemSetList();
		});
	}

	function handleSelectProblem(id: string) {
		resetStatus();

		const problem: AdminProblem | undefined = problemSet.problems.find((value) => {
			return value.id === id
		});
		if (!problem) {
			setStatus({
				status: 'error',
				message: 'Failed to load selected problem'
			});
			return;
		}
		setProblemID(id);
		setProblemName(problem.problem);
		setProblemType(problem.type);
		setProblemDifficulty(problem.difficulty);
		setIsModifying(true);

		if (problem.options) {
			setMultiAnswers(problem.options);
		}

		switch(problem.type) {
			case "tf":
				setProblemAnswer(problem.answer);
				break;
			case "input":
				setProblemAnswer(problem.answer);
				break;
			case "multi":
				setProblemAnswer(problem.answer);
				break;
		}
	}
	function handleDeleteProblem(key: number) {
		resetStatus();

		remove(ref(db, 'problemsets/' + problemSetID + "/" + key)).then(() => {
			handleSelectProblemSet(problemSetID, problemSetName);
		}).catch(() => {
			handleSelectProblemSet(problemSetID, problemSetName);
		})
	}

	function updateProblem(updates: { problem?: string, type?: string, difficulty?: string, answer?: string, options?: string[] }) {
 		update(ref(db, 'problemsets/' + problemSetID + "/" + problemID), updates);
		handleSelectProblemSet(problemSetID, problemSetName);
	}
	async function createProblem(newProblem: { problem?: string, type?: string, difficulty?: string, answer?: string, options?: string[] }) {
		if (problemSetID === "") {
			setStatus({
				status: 'error',
				message: 'Please select a problem set',
			});
			return;
		}
		const problemSetRef = await push(ref(db, 'problemsets/' + problemSetID), newProblem);
		if (!problemSetRef || problemSetRef.key === null) {
			setStatus({
				status: 'error',
				message: 'Failed to create problem set'
			})
			return;
		}
		handleSelectProblemSet(problemSetID, problemSetName);
	}
	function handleSubmit(event: React.FormEvent) {
		resetStatus();

		event.preventDefault();
		if (problemName.length <= 0 || problemAnswer.length <= 0 || problemSetName.length <= 0) {
			setStatus({
				status: 'error',
				message: "Problem Name is empty, Answer is empty, or Set was not entered"
			})
			return;
		}
		
		if (isModifying) {
			if (problemType === 'input' || problemType === 'tf') {
				updateProblem({problem: problemName, type: problemType, difficulty: problemDifficulty, answer: problemAnswer});
			}
			if (problemType === 'multi') {
				updateProblem({problem: problemName, type: problemType, difficulty: problemDifficulty, answer: problemAnswer, options: multiAnswers});
			}
		} else {
			if (problemType === 'input' || problemType === 'tf') {
				createProblem({problem: problemName, type: problemType, difficulty: problemDifficulty, answer: problemAnswer});
			}
			if (problemType === 'multi') {
				createProblem({problem: problemName, type: problemType, difficulty: problemDifficulty, answer: problemAnswer, options: multiAnswers});
			}
		}
	}

	function handleCreateCampaign(event: React.FormEvent) {
		resetStatus();

		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const campaign = formData.get("campaign") as string;
		set(ref(db, 'problemsetnames/'+campaign), { default: "" })
		window.location.reload();
	}

	function resetStatus() {
		setStatus({
			status: 'idle',
			message: ""
		})
	}

	return (
		<div className="min-w-4/5 max-h-1/2 flex flex-row text-white">
			<form className="flex flex-col grow-1 h-full p-2 gap-2 overflow-y-auto" onSubmit={handleCreateCampaign}>
				<h2 className="text-2xl">Create Campaign</h2>
				<input name="campaign" className="outline-none bg-slate-800 border-b-1 border-white p-2" placeholder="Campaign Name"/>
				<input className="justify-self-end bg-lime-500 text-lg" type="submit" value="Create"/>
			</form>
			<div className="flex flex-col grow-999 gap-1 h-full overflow-hidden">
				<span className="flex flex-row w-full items-center gap-3">
					<h3 className="">{problemSetName.length > 0 ? "Problem Sets" : "Problems"}</h3>
					<div className="grow-1">
					<Dropdown
						items={campaignNames}
						selected={selected}
						show={show}
						setShow={setShow}
						setSelected={setSelected}
					/>
					</div>
				</span>
				<ul className="list-none h-full border border-white border-2 overflow-y-auto">
					{problemSet.problems.length > 0 ? (
						<>
							{problemSet.problems.map((val: AdminProblem, key: number) => {
								return (
									<li key={key} className="flex flex-row w-full justify-between items-center border-b-1">
										<h3 className="block w-full h-full p-2" onClick={() => handleSelectProblem(val.id)}>{val.problem}</h3>
										<button className="bg-red-400 text-white p-1 rounded-sm" onClick={() => handleDeleteProblem(val.id)}>Delete</button>
									</li>
								)
							})}
						</>
					) : (
						<>
							{problemSetNames.length > 0 && problemSetNames.map((val: { id: string, setName: string }, key: number) => {
								return (
									<li key={key} className="flex flex-row w-full justify-between items-center border-b-1">
										<h3 className="block w-full h-full p-2" onClick={() => handleSelectProblemSet(val.id, val.setName)}>{val.setName}</h3>
										<button className="bg-red-400 text-white p-1 rounded-sm" onClick={() => handleDeleteProblemSet(key)}>Delete</button>
									</li>
								)
							})}
							<form className="flex flex-row items-center w-full gap-3" onSubmit={handleAddProblemSet}>
								<label>Problem Set Name: </label>
								<input name="setName" className="grow-1 outline-none bg-slate-800 border-b-1 border-white p-2" />
								<input className="bg-lime-500 p-1 rounded-sm" type="submit" value="Add"/>
							</form>
						</>
					)}
				</ul>
				{problemSet.problems.length > 0 && <button className="bg-slate-200 text-black hover:bg-slate-300" onClick={handleExitProblemSet}>Back</button>}
			</div>
			<form className="flex flex-col grow-1 h-full p-2 gap-2 overflow-y-auto" onSubmit={handleSubmit}>
            {status.status === 'error' && (
                <div className="rounded-sm border-lime-400 border-2 p-3">
                    <h3 className="text-2xl text-left text-lime-200">
						Error
                    </h3>
                    <p className="text-lg text-left text-red-200">
						{status.message}
                    </p>
                </div>
            )}
            {status.status === 'success' && (
                <div className="rounded-sm border-red-400 border-2 p-3">
                    <h3 className="text-2xl text-left text-red-300">
						Success
                    </h3>
                    <p className="text-lg text-left text-red-200">
						{status.message}
                    </p>
                </div>
            )}
			<h2 className="text-2xl">{problemSetName}</h2>
			<label>Problem</label>
			<input name="problem" className="text-lg border-b-1 border-white p-1 bg-slate-700" value={problemName} onChange={(e: React.ChangeEvent) => {
				setProblemName((e.target as HTMLInputElement).value)
				resetStatus()
			}}/>
			<label>Type</label>
			<select name="type" className="text-lg border-b-1 border-white p-1 bg-slate-700" value={problemType} onChange={(e: ChangeEvent) => {
				setProblemType((e.target as HTMLSelectElement).value);
				switch((e.target as HTMLSelectElement).value) {
					case "input":
						setProblemAnswer("");
						break;
					case "multi":
						setProblemAnswer(multiAnswers.length > 0 ? multiAnswers[0] : "");
						break;
					case "tf":
						setProblemAnswer("true");
						break;
				}
				resetStatus()
			}}>
				<option value="input">Input</option>
				<option value="multi">Multiple Choice</option>
				<option value="tf">True/False</option>
			</select>
			<label>Difficulty</label>
			<select name="difficulty" className="text-lg border-b-1 border-white p-1 bg-slate-700" value={problemDifficulty} onChange={(e: ChangeEvent) => {
				setProblemDifficulty((e.target as HTMLSelectElement).value);
				resetStatus();
			}}>
				<option value="easy">Easy</option>
				<option value="medium">Medium</option>
				<option value="hard">Hard</option>
			</select>

			<label>{problemType === 'multi' ? "Options" : "Answer"}</label>
			<ProblemType problemType={problemType} problemAnswer={problemAnswer} multiAnswers={multiAnswers} setAnswer={setProblemAnswer} setMultiAnswers={setMultiAnswers} />

			<hr className="mt-4 border-1"/>
			<input className="justify-self-end bg-lime-500 text-lg" type="submit" value={isModifying ? "Save" : "Create"}/>
			{isModifying && <button className="bg-slate-200 text-black" onClick={() => setIsModifying(false)}>Create New Problem</button>}
			</form>
			</div>
		)
}

function ProblemType({ problemType, problemAnswer, multiAnswers, setAnswer, setMultiAnswers }: { problemType: string, problemAnswer: string, multiAnswers: string[], setAnswer: React.Dispatch<React.SetStateAction<string>>, setMultiAnswers: React.Dispatch<React.SetStateAction<string[]>> }) {
	const addMultiAnswerInput = useRef<HTMLInputElement>(null);

	if (problemType === "input") {
		return <input name="answer" className="text-lg border-b-1 border-white p-1 bg-slate-700" value={problemAnswer} onChange={(e: React.ChangeEvent) => {
			setAnswer((e.target as HTMLInputElement).value);
		}}/>
	}
	if (problemType === "multi") {
		return (
			<>
			<input placeholder="Add Option" ref={addMultiAnswerInput}/>
			<button type="button" className="bg-slate-400" onClick={() => {
				if (addMultiAnswerInput.current && !multiAnswers.includes(addMultiAnswerInput.current.value)) {
					setMultiAnswers([...multiAnswers, addMultiAnswerInput.current.value])
				}
			}}>Add Option</button>
			<ul>
			{multiAnswers && multiAnswers.length > 0 && multiAnswers.map((val, key) => {
				return <li className={"px-2 " + (val === problemAnswer ? "bg-slate-600" : "bg-transparent")} key={key} onClick={() => {
					setAnswer(val);
				}}>{val}</li>
			})}
			</ul>
			<button type="button" className="bg-red-400" onClick={() => {
				setMultiAnswers([])
			}}>Clear</button>
			</>
		)
	}
	if (problemType === "tf") {
		return (
			<select name="tf" className="text-lg border-b-1 border-white p-1 bg-slate-700" onChange={(e: React.ChangeEvent) => {
				setAnswer((e.target as HTMLSelectElement).value);
			}}>
				<option value={"true"}>True</option>
				<option value={"false"}>False</option>
			</select>
		)
	}
}
