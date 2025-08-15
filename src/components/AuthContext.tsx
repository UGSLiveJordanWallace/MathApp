import { createContext, useContext, useEffect, useState } from "react";

// firebase
import { auth, db } from "../firebase";
import {
    createUserWithEmailAndPassword,
    deleteUser,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    type User,
} from "firebase/auth";
import { ref, remove, set, update } from "firebase/database";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import type { AuthContextValue } from "./Types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue | null {
    return useContext<AuthContextValue | null>(AuthContext);
}

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [currentUser, setCurrentUser] = useState<User | null>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return unsubscribe;
    }, [currentUser]);

    async function signup(email: string, password: string) {
        return await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const avatar = createAvatar(adventurerNeutral, {
                    size: 128,
                    seed: "Felix",
                }).toDataUri();

                set(ref(db, "users/" + userCredential.user.uid), {
                    profilePic: avatar,
					streak: 1,
					coins: 0,
					lastDate: Date.now() / (1000 * 60 * 60),
                });
                setCurrentUser(userCredential.user);
            })
            .catch((error) => {
                throw error;
            });
    }
    async function login(email: string, password: string) {
        return await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setCurrentUser(userCredential.user);
            })
            .catch((error) => {
                throw error;
            });
    }
    async function logout() {
        return await signOut(auth);
    }
    async function resetPassword(email: string) {
        return await sendPasswordResetEmail(auth, email)
            .then(() => {})
            .catch((error) => {
                throw error;
            });
    }
    async function updateUser({ username, profilePicture }: { username?: string, profilePicture?: string }) {
        if (!currentUser) {
            throw "Could Not Update Username";
        }

        await update(ref(db, "users/" + currentUser.uid), {
            username: username,
			profilePic: profilePicture,
        });
    }
    async function deleteCurrentUser() {
        if (!currentUser) {
            return;
        }

        remove(ref(db, "users/" + currentUser.uid))
            .then(() => {})
            .catch((error) => {
                throw error;
            });
        return await deleteUser(currentUser)
            .then(() => {})
            .catch((error) => {
                throw error;
            });
    }

    const value: AuthContextValue = {
        currentUser,
        updateUser,
        signup,
        login,
        logout,
        resetPassword,
        deleteCurrentUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
