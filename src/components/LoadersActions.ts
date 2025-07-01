import type { Params } from "react-router";

// firebase
import { db } from "../firebase";
import { DataSnapshot, get, ref, type IteratedDataSnapshot } from "firebase/database";
import type { MapItemType, Problem, ProblemSet, ProblemSetStatus } from "./Types";
import { getProblemStatus, initUserDB } from "./services";

// MapPage
export async function mapPageLoader(_params: { params: Params<string> }): Promise<MapItemType[] | null> {
	const snapshot: DataSnapshot = await get(ref(db, 'problemsetnames'));
	if (!snapshot.exists()) {
		console.log("Problem Sets Not Available");
		return null;
	}

	const browserDB = await initUserDB();
	let problemSetStatus = null;
	if (browserDB) {
		problemSetStatus = await getProblemStatus(browserDB);
	}

	const problemSets: MapItemType[] = [];
	snapshot.forEach((child: IteratedDataSnapshot) => {
		const data: MapItemType = {
			id: Number(child.key),
			problemSetName: child.val(),
			completed: false,
		}

		if (!problemSetStatus) {
			problemSets.push(data)
			return;
		}

		const status = problemSetStatus.get(Number(child.key));
		if (!status) {
			problemSets.push(data);
			return;
		}
		
		data.completed = status.completed;
		problemSets.push(data);
	})

	return problemSets;
}

// AnswerPage
export async function answerPageLoader({ params }: { params: Params<string> }): Promise<ProblemSet | null> {
	const index: number = Number(params.id);
	const problemset: ProblemSet = {
		problems: []
	}
	try {
		const snapshot = await get(ref(db, 'problemsets'))
		if (!snapshot.exists()) {
			return null;
		}
		if (snapshot.val().length <= index) {
			return null;
		}

		const problemSetSnapshot = snapshot.val()[index]
		problemSetSnapshot.forEach((item: Problem, key: number) => {
			const problem: Problem = {
				setIndex: index,
				id:	key, 
				problem: item.problem,
				options: item?.options,
				type: item.type,
			};
			problemset.problems.push(problem);
		})
		return problemset;
	} catch(error) {
		return null;
	}
}
export async function answerPageAction({ request }: { request: Request }) {
	const formData = await request.formData();
	const type = formData.get("type") as string;
	const id = Number(formData.get("id"));
	const index = Number(formData.get("setIndex"));
	let correct: string = "";
	let result: string = "";

	const snapshot = await get(ref(db, 'problemsets'))
	if (!snapshot.exists()) {
		return { state: "Unknown" };
	}
	if (snapshot.val().length <= index) {
		return { state: "Unknown" };
	}

	const problemSetSnapshot = snapshot.val()[index]
	problemSetSnapshot.forEach((item: Object, key: number) => {
		if (key === id) {
			correct = item.answer;
		}
	})

	if (type === "input" || "multi") {
		const guess = formData.get("answer") as string;
		result = guess === correct ? "Correct" : "Incorrect";
	}
	if (type === "tf") {
		const guess = formData.get("answer") === "True" ? true : false;
		result = guess ? "Correct" : "Incorrect";
	}

	return { state: result };
}
