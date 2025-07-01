import type { ProblemSetStatus } from "./Types";

// IndexedDB
export function initUserDB(): Promise<IDBDatabase | null> {
	let req: IDBOpenDBRequest;
	let db: IDBDatabase;

	return new Promise((resolve) => {
		req = indexedDB.open("user");
		req.onupgradeneeded = () => {
			db = req.result;

			if (db.objectStoreNames.contains("problemStatus")) {
				return;
			}

			const objectStore = db.createObjectStore("problemStatus", { keyPath: "key", autoIncrement: true });
			objectStore.createIndex("status", "status", { unique: false });
		}
		req.onsuccess = () => {
			db = req.result
			resolve(db);
		}
		req.onerror = () => {
			resolve(null);
		}
	})
}
export function getProblemStatus(db: IDBDatabase): Promise<Map<number, ProblemSetStatus> | null> {
	return new Promise((resolve) => {
		const db_transaction = db.transaction("problemStatus", "readonly");
		const objectStore = db_transaction.objectStore("problemStatus");		
		const response = objectStore.getAll();
		
		response.onsuccess = () => {
			let result = new Map<number, ProblemSetStatus>()
			response.result.forEach((val) => {
				const status = val.status as ProblemSetStatus;
				result.set(status.problemSetID, status);
			})
			resolve(result);
		}
		response.onerror = () => {
			resolve(null)
		}
	})
}
export function writeProblemStatus(db: IDBDatabase, status: ProblemSetStatus): Promise<boolean> {
	return new Promise((resolve) => {
		const db_transaction = db.transaction("problemStatus", "readwrite")
		const objectStore = db_transaction.objectStore("problemStatus")
		objectStore.add({
			status: status,
		});

		db_transaction.addEventListener("complete", () => {
			resolve(true);
		})
	})
}

// Streaks and Points
export function streakValid(lastDate: number): boolean {
	const currentDate: number = new Date().getHours();
	return (currentDate - lastDate) < 24;
}
export function processScore(streak: number) {
	return streak + 1;
}
