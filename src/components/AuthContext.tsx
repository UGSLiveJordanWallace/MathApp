import { createContext, useContext, useEffect, useState } from "react";

// firebase
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { ref, remove, set } from "firebase/database";
import type { Profile } from "./Types";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";

const AuthContext = createContext(null);

export function useAuth(): any {
	return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const [currentUser, setCurrentUser] = useState<User | null>();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
			if (user) {
				setCurrentUser(user);
			} else {
				setCurrentUser(null);
			}
		})

		return unsubscribe;
	}, [currentUser])

	async function signup(email: string, password: string) {
		return await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
			const avatar = createAvatar(adventurerNeutral, {
				size: 128,
				seed: "Felix"
			}).toDataUri();

			set(ref(db, 'users/' + userCredential.user.uid), {
				profilePic: avatar
			})
			setCurrentUser(userCredential.user);
		}).catch((error) => {
			throw error;
		})
	}
	async function login(email: string, password: string) {
		return await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
			setCurrentUser(userCredential.user);
		}).catch((error) => {
			throw error;
		})
	}
	async function logout() {
		return await signOut(auth);
	}
	async function resetPassword(email: string) {
		return await sendPasswordResetEmail(auth, email).then(() => {}).catch((error) => {
			throw error
		})
	}
	async function updateUsername(username: string) {
		if (!currentUser) {
			throw "Could Not Update Username";
		}

		await set(ref(db, 'users/' + currentUser.uid), {
			username
		})
	}
	async function deleteCurrentUser() {
		if (!currentUser) {
			return;
		}

		remove(ref(db, 'users/' + currentUser.uid)).then(() => {}).catch((error) => {
			throw error;
		})
		return await deleteUser(currentUser).then(() => {}).catch((error) => {
			throw error;
		})
	}

	const value: any = {
		currentUser,
		updateUsername,
		signup,
		login,
		logout,
		resetPassword,
		deleteCurrentUser
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}
