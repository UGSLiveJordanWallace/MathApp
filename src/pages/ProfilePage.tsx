import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";

// AuthContext
import { useAuth } from "../components/AuthContext";

// firebase
import { db } from "../firebase";
import { onValue, ref, } from "firebase/database";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import type { ProfileConfig } from "../components/Types";

export default function ProfilePage() {
    const { currentUser, updateUser, login, deleteCurrentUser } = useAuth()!!;
    const [username, setUsername] = useState<string>("");
    const [editting, setEditting] = useState<boolean>(false);
    const [profilePicture, setProfilePicture] = useState<string | undefined>(
        undefined
    );

	const [error, setError] = useState<string>("");

    const eyebrowsRef = useRef<HTMLSelectElement>(null);
    const eyesRef = useRef<HTMLSelectElement>(null);
    const mouthRef = useRef<HTMLSelectElement>(null);
    const glassesRef = useRef<HTMLSelectElement>(null);
    const glassesOnRef = useRef<HTMLInputElement>(null);
    const backgroundColorRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!currentUser) {
            return;
        }
        const unsubscribe = onValue(
            ref(db, "users/" + currentUser.uid),
            (snapshot) => {
                if (!snapshot.exists()) {
					return;
                }

                if (snapshot.val().username) {
                    setUsername(snapshot.val().username);
                }
                if (snapshot.val().profilePic) {
                    setProfilePicture(snapshot.val().profilePic as string);
                }
            },
            { onlyOnce: true }
        );

        return unsubscribe;
    }, [currentUser]);

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
			updateUser({username, profilePicture});
        }
        setEditting(!editting);
    }

    async function handleDeleteProfile(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        try {
            await deleteCurrentUser();
        } catch (error: any & { code: string }) {
            const code: string = error?.code;
			setError(code);
        }
    }

    function updateUserProfile() {
        const eyebrows = eyebrowsRef.current
            ?.value as ProfileConfig["eyebrows"];
        const eyes = eyesRef.current?.value as ProfileConfig["eyes"];
        const glasses = glassesRef.current?.value as ProfileConfig["glasses"];
        const backgroundColor = backgroundColorRef.current?.value.substring(
            1
        ) as ProfileConfig["backgroundColor"];
		const mouth = mouthRef.current?.value as ProfileConfig['mouth'];

        const avataar = createAvatar(adventurerNeutral, {
            size: 128,
            eyebrows: [eyebrows],
            eyes: [eyes],
			mouth: [mouth],
            glasses: [glasses],
            glassesProbability: glassesOnRef.current?.checked ? 100 : 0,
            backgroundColor: [backgroundColor],
        });
        setProfilePicture(avataar.toDataUri());
    }

    if (!editting) {
        return (
            <div className="relative flex flex-col w-11/20 bg-stone-900 shadow-xl rounded-sm text-white sm:w-1/3 lg:w-1/6">
                <img className="block rounded-sm m-2" src={profilePicture} />
                <hr className="w-full" />
                {username ? (
                    <h3 className="text-center">{username}</h3>
                ) : (
                    <h3 className="text-center">
                        Click Edit To Update Your Username
                    </h3>
                )}
                <button
                    className={"p-3 text-center m-2 rounded-sm bg-gray-600"}
                    onClick={handleEditProfile}
                >
                    Edit
                </button>
				<NavLink className={"p-1 mx-2 mb-2 text-center rounded-sm bg-gray-600"} to="/stats">Stats</NavLink>
            </div>
        );
    }

    return (
		<>
		{error === "auth/requires-recent-login" && <div className="rounded-sm border-red-400 border-2 p-3">
			<h3 className="inline text-2xl text-left text-red-200">
				Too Much Time Elapsed Since Last Login
			</h3>
			<p className="text-1xl text-red-200">Please Logout, Log back in, navigate to this page, and click the delete button again to delete the account.</p>
		</div>}
        <div className="relative flex flex-col w-11/20 bg-stone-900 shadow-xl rounded-sm text-white sm:w-1/3 lg:w-1/4">
            <div className="relative flex flex-row">
                <img className="block rounded-sm m-2" src={profilePicture} />
                <div className="flex flex-col w-full m-2">
                    <h3>Eyebrows</h3>
                    <Select ref={eyebrowsRef} onChange={updateUserProfile}>
                        <option>variant01</option>
                        <option>variant02</option>
                        <option>variant03</option>
                        <option>variant04</option>
                        <option>variant05</option>
                        <option>variant06</option>
                        <option>variant07</option>
                        <option>variant08</option>
                        <option>variant09</option>
                        <option>variant10</option>
                        <option>variant11</option>
                        <option>variant12</option>
                        <option>variant13</option>
                        <option>variant14</option>
                        <option>variant15</option>
                    </Select>
                    <h3>Eyes</h3>
                    <Select ref={eyesRef} onChange={updateUserProfile}>
                        <option>variant01</option>
                        <option>variant02</option>
                        <option>variant03</option>
                        <option>variant04</option>
                        <option>variant05</option>
                        <option>variant06</option>
                        <option>variant07</option>
                        <option>variant08</option>
                        <option>variant09</option>
                        <option>variant10</option>
                        <option>variant11</option>
                        <option>variant12</option>
                        <option>variant13</option>
                        <option>variant14</option>
                        <option>variant15</option>
                        <option>variant16</option>
                        <option>variant17</option>
                        <option>variant18</option>
                        <option>variant19</option>
                        <option>variant20</option>
                        <option>variant21</option>
                        <option>variant22</option>
                        <option>variant23</option>
                        <option>variant24</option>
                        <option>variant25</option>
                        <option>variant26</option>
                    </Select>
					<h3>Mouth</h3>
					<Select ref={mouthRef} onChange={updateUserProfile}>
						<option>variant01</option>
						<option>variant02</option>
						<option>variant03</option>
						<option>variant04</option>
						<option>variant05</option>
						<option>variant06</option>
						<option>variant07</option>
						<option>variant08</option>
						<option>variant09</option>
						<option>variant10</option>
						<option>variant11</option>
						<option>variant12</option>
						<option>variant13</option>
						<option>variant14</option>
						<option>variant15</option>
						<option>variant16</option>
						<option>variant17</option>
						<option>variant18</option>
						<option>variant19</option>
						<option>variant20</option>
						<option>variant21</option>
						<option>variant22</option>
						<option>variant23</option>
						<option>variant24</option>
						<option>variant25</option>
						<option>variant26</option>
						<option>variant27</option>
						<option>variant28</option>
						<option>variant29</option>
						<option>variant30</option>
					</Select>
                    <h3>Glasses</h3>
                    <Select ref={glassesRef} onChange={updateUserProfile}>
                        <option>variant01</option>
                        <option>variant02</option>
                        <option>variant03</option>
                        <option>variant04</option>
                        <option>variant05</option>
                        <option>variant06</option>
                    </Select>
                    <div className="flex flex-row gap-1">
                        <h3>Glasses On</h3>
                        <input
                            type="checkbox"
                            ref={glassesOnRef}
                            onChange={updateUserProfile}
                        />
                    </div>
                    <h3>Skin Color</h3>
                    <input
                        type="color"
                        ref={backgroundColorRef}
                        onChange={updateUserProfile}
                    />
                </div>
            </div>
            <hr className="w-full" />
            <input
                className="text-lg text-black bg-gray-100 border-b-1 m-2 focus:border-b-2 focus:outline-hidden"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <button
                className={"p-3 text-center m-2 rounded-sm bg-lime-600"}
                onClick={handleEditProfile}
            >
                Save
            </button>
			<button
				className={"p-3 text-center m-2 rounded-sm bg-gray-600"}
				onClick={() => setEditting(false)}
			>
				Discard Changes
			</button>
            <button
                className="p-1 bg-red-500 m-2 rounded-sm"
                onClick={handleDeleteProfile}
            >
                Delete Account
            </button>
        </div>
		</>
    );
}

function Select({
    ref,
    children,
    onChange,
}: {
    ref: React.RefObject<HTMLSelectElement | null>;
    children: React.ReactNode;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
}) {
    return (
        <select className="bg-stone-800 p-1" ref={ref} onChange={onChange}>
            {children}
        </select>
    );
}
