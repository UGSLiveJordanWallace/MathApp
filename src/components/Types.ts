/* 
* Map Types
*/
export type MapItemType = {
	id: number,
	problemSetName: string,
	completed: boolean,
}

/* 
* IndexedDB Types
*/
export type ProblemSetStatus = {
	problemSetID: number,
	completed: boolean,
}

/* 
* Answer Types
*/
export type Problem = {
	setIndex: number,
	id: number,
	problem: string,
	options?: string[],
	type: "input" | "tf" | "multi",
}
export type ProblemSet = {
	problems: Problem[],
};

/* 
* Profile Types
*/
export type Profile = {
	size: number,
	seed: "Felix" | "Aneka" | undefined,
	backgroundColor: string | undefined,
	eyebrows: "variant01" | "variant02" | "variant03" | "variant04" | "variant05" | "variant06" | "variant07" | "variant08" | "variant09" | "variant10" | "variant11" | "variant12" | "variant13" | "variant14" | "variant15" | undefined,
	eyes: "variant01" | "variant02" | "variant03" | "variant04" | "variant05" | "variant06" | "variant07" | "variant08" | "variant09" | "variant10" | "variant11" | "variant12" | "variant13" | "variant14" | "variant15" | "variant16" | "variant17" | "variant18" | "variant19" | "variant20" | "variant21" | "variant22" | "variant23" | "variant24" | "variant25" | "variant26" | undefined,
	glasses: "variant01" | "variant02" | "variant03" | "variant04" | "variant05" | "variant06" | undefined
};
