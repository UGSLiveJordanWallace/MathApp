import { useEffect, useState } from "react";
import { NavLink } from "react-router";

// AuthContext
import { useAuth } from "../components/AuthContext";

// firebase
import { db } from "../firebase";
import { onValue, ref, set } from "firebase/database";

export default function ProfilePage() {
	const { currentUser, deleteCurrentUser } = useAuth();
    const [editting, setEditting] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
	const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (!currentUser) {
			return
		}
		const unsubscribe = onValue(ref(db, 'users/' + currentUser.uid), (snapshot) => {
			if (!snapshot.exists()) {
				console.log("User Not Available");
			}

			if (snapshot.val().username) {
				setUsername(snapshot.val().username);
			}
			if (snapshot.val().profilePic) {
				setProfilePicture(snapshot.val().profilePic as string);
			}
		}, { onlyOnce: true })

		return unsubscribe;
	}, [currentUser])

	/** Fallback **/
    if (!currentUser) {
        return (
            <div className="flex flex-column items-center justify-center h-dvh bg-slate-950 gap-10">
                <NavLink to="/login">
				<div className="bg-white rounded-sm w-50% h-50% p-10 text-xl">
                    Already a user login here
                </div>
				</NavLink>
                <NavLink to="/signup">
				<div className="bg-white rounded-sm w-50% h-50% p-10 text-xl">
                    Create account here
                </div>
				</NavLink>
            </div>
        );
    }

    function handleEditProfile(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
		if (editting) {
			set(ref(db, 'users/' + currentUser.uid), {
				"username": username,
				"profilePic": profilePicture
			})
		}
        setEditting(!editting);
    }
	
	async function handleDeleteProfile(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		try {
			await deleteCurrentUser();
		} catch(error: any & { code: string }) {
			const code: string = error?.code
			if (code === "auth/requires-recent-login") {
			}
		}
	}

    return (
        <div className="relative flex flex-col w-11/20 bg-stone-900 shadow-xl rounded-sm text-white sm:w-1/3 lg:w-1/6">
            <img
                className="block rounded-sm m-2"
                src={profilePicture}
            />
            <hr className="w-full" />
            {editting ? (
                <>
					<input className="text-lg text-black bg-gray-100 border-b-1 m-2 focus:border-b-2 focus:outline-hidden" type="text" value={username} onChange={e => setUsername(e.target.value)} required/>
					<NavLink className={"p-1 text-center text-black m-2 rounded-sm bg-gray-300"} to="/reset-password">ResetPassword</NavLink>
                </>
            ) : (
                <>
                    {username ? (
                        <h3 className="text-center">{username}</h3>
                    ) : (
                        <h3 className="text-center">
                            Click Edit To Enter Your Username
                        </h3>
                    )}
                </>
            )}
            <button
                className={
                    "p-3 text-center m-2 rounded-sm " +
                    (editting ? "bg-lime-600" : "bg-gray-600")
                }
                onClick={handleEditProfile}
            >
                {editting ? "Save" : "Edit"}
            </button>
			<button className="p-1 bg-red-500 m-2 rounded-sm" onClick={handleDeleteProfile}>Delete Account</button>
        </div>
    );
}
