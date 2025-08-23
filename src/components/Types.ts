import type { User } from "firebase/auth";

/*
 * Map Types
 */
export type MapItemType = {
    id: number;
    problemSetName: string;
    completed: boolean;
};

/*
 * Answer Types
 */
export type Problem = {
    setIndex: string;
    id: string;
    problem: string;
    options?: string[];
    type: "input" | "tf" | "multi";
	difficulty: "easy" | "medium" | "hard";
};
export type ProblemSet = {
    problems: Problem[];
};
export const ProblemDifficultyScores = {
	"easy": 1,
	"medium": 3,
	"hard": 5,
};

export type AdminProblem = Problem & { answer: string };
export type AdminProblemSet = {
	problems: AdminProblem[];
}

/*
 * Auth Context
 */
export type AuthContextValue = {
	currentUser: User | null | undefined;
	updateUser({ username, profilePicture }: { username?: string, profilePicture?: string }): Promise<void>;
	signup(email: string, password: string): Promise<void>;
	login(email: string, password: string): Promise<void>;
	resetPassword(email: string): Promise<void>;
	logout(): Promise<void>;
	deleteCurrentUser(): Promise<void>;
}

/*
 * Profile Types
 */
export type UserStatisticsType = {
	coins: number;
	streak: number;
	daysSinceLastLog: number;
}
export type ProfileConfig = {
    size: number;
    eyebrows:
        | "variant01"
        | "variant02"
        | "variant03"
        | "variant04"
        | "variant05"
        | "variant06"
        | "variant07"
        | "variant08"
        | "variant09"
        | "variant10"
        | "variant11"
        | "variant12"
        | "variant13"
        | "variant14"
        | "variant15";
    eyes:
        | "variant01"
        | "variant02"
        | "variant03"
        | "variant04"
        | "variant05"
        | "variant06"
        | "variant07"
        | "variant08"
        | "variant09"
        | "variant10"
        | "variant11"
        | "variant12"
        | "variant13"
        | "variant14"
        | "variant15"
        | "variant16"
        | "variant17"
        | "variant18"
        | "variant19"
        | "variant20"
        | "variant21"
        | "variant22"
        | "variant23"
        | "variant24"
        | "variant25"
        | "variant26";
    mouth:
        | "variant01"
        | "variant02"
        | "variant03"
        | "variant04"
        | "variant05"
        | "variant06"
        | "variant07"
        | "variant08"
        | "variant09"
        | "variant10"
        | "variant11"
        | "variant12"
        | "variant13"
        | "variant14"
        | "variant15"
        | "variant16"
        | "variant17"
        | "variant18"
        | "variant19"
        | "variant20"
        | "variant21"
        | "variant22"
        | "variant23"
        | "variant24"
        | "variant25"
        | "variant26"
        | "variant27"
        | "variant28"
        | "variant29"
        | "variant30";
    glasses:
        | "variant01"
        | "variant02"
        | "variant03"
        | "variant04"
        | "variant05";
    backgroundColor: string;
};

/*
 * Dropdown
 */
export type DropdownType = {
    items: string[];
    selected: number;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    setSelected: React.Dispatch<React.SetStateAction<number>>;
};
