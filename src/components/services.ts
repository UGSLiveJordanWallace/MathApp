import type { Params } from "react-router";

// Types
import type { MapItemType, UserStatisticsType } from "./Types";
import type { Problem, ProblemSet } from "./Types";

// firebase
import { db } from "../firebase";
import {
    get,
    ref,
    update,
    type DataSnapshot,
    type IteratedDataSnapshot,
} from "firebase/database";

export async function getProblemSetNames(
    campaign: string, uid: string | null
): Promise<MapItemType[] | null> {
    const problemSetSnapshot: DataSnapshot = await get(
        ref(db, "problemsetnames/" + campaign)
    );
    if (!problemSetSnapshot.exists()) {
        return null;
    }

	const problemSetsCompleted: Map<number, boolean> = new Map<number, boolean>();
	if (uid) {
		const problemSetsCompletedSnapshot: DataSnapshot = await get(
			ref(db, "users/" + uid + "/problemSetsCompleted")
		)
		if (problemSetsCompletedSnapshot.exists()) {
			for (const key in problemSetsCompletedSnapshot.val()) {
				problemSetsCompleted.set(Number(key), problemSetsCompletedSnapshot.val()[key]);
			}
		}
	}

    const problemSets: MapItemType[] = [];
    problemSetSnapshot.forEach((child: IteratedDataSnapshot) => {
        const data: MapItemType = {
            id: child.val().id,
            problemSetName: child.val().setName,
            completed: problemSetsCompleted.get(child.val().id) === undefined ? false : true,
        };

        problemSets.push(data);
    });

    return problemSets;
}

export async function getUserStatistics(uid: string): Promise<UserStatisticsType> {
	const snapshot = await get(ref(db, "users/" + uid));

	const days: number = Math.floor(((Date.now() / (1000 * 60 * 60)) - snapshot.val().lastDate) / 24);

	const statistics: UserStatisticsType = {
		coins: snapshot.val().coins,
		streak: snapshot.val().streak,
		daysSinceLastLog: days,
	};
	return statistics;
}

// Loaders and Actions
export async function answerPageLoader({
    params,
}: {
    params: Params<string>;
}): Promise<ProblemSet | null> {
    const index: number = Number(params.id);
    const problemset: ProblemSet = {
        problems: [],
    };
    try {
        const snapshot = await get(ref(db, "problemsets/" + index));
        if (!snapshot.exists()) {
            return null;
        }

        const problemSetSnapshot = snapshot.val();
        problemSetSnapshot.forEach((item: Problem, key: number) => {
            const problem: Problem = {
                setIndex: index,
                id: key,
                problem: item.problem,
                options: item?.options,
                type: item.type,
				difficulty: item.difficulty
            };
            problemset.problems.push(problem);
        });
        return problemset;
    } catch (error) {
		console.log(error);
        return null;
    }
}
export async function answerPageAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const type = formData.get("type") as string;
    const id = Number(formData.get("id"));
    const index = Number(formData.get("setIndex"));
    let correct: unknown;
    let result: string = "";

    const snapshot = await get(ref(db, "problemsets"));
    if (!snapshot.exists()) {
        return { state: "Unknown" };
    }
    if (snapshot.val().length <= index) {
        return { state: "Unknown" };
    }

    const problemSetSnapshot = snapshot.val()[index];
    problemSetSnapshot.forEach((item: IteratedDataSnapshot & { answer: string | boolean }, key: number) => {
        if (key === id) {
			correct = item.answer
        }
    });

    if (type === "input" || type === "multi") {
        const guess: string = formData.get("answer") as string;
        result = guess === correct ? "Correct" : "Incorrect";
    }
    if (type === "tf") {
        const guess: string = formData.get("answer") as string;
        result = guess === correct ? "Correct" : "Incorrect";
    }

    return { state: result };
}

// Streaks and Points
export async function validateStreak(uid: string, score: number) {
	const currDate: number = Date.now() / (1000 * 60 * 60);
	const snapshot: DataSnapshot = await get(ref(db, 'users/' + uid))
	const result = snapshot.val() as { lastDate: number, streak: number, coins: number };

    const elapsedTime: number = currDate - result.lastDate;
	const isValid: boolean = elapsedTime >= 24 && elapsedTime < 48;
	let coins: number;

	if (!isValid) {
		coins = calculateCoins(1, score);
		if (elapsedTime >= 48) {
			await update(ref(db, "users/" + uid), { coins: result.coins + coins, streak: 1, lastDate: Date.now() / (1000 * 60 * 60) });
		}
		await update(ref(db, "users/" + uid), { coins: result.coins + coins });
	}
	if (isValid) {
		coins = calculateCoins(result.streak + 1, score);
		await update(ref(db, "users/" + uid), { coins: result.coins + coins, streak: result.streak + 1, lastDate: Date.now() / (1000 * 60 * 60) });
	}
}
export function calculateCoins(streak: number, score: number): number {
    return streak + score;
}
export async function updateProblemSetCompleted( setID: number, completed: boolean, uid: string) {
	await update(ref(db, "users/" + uid + "/problemSetsCompleted"), {
		[setID]: completed
	})
}
