import { useRef, useState } from "react";
import { Form, NavLink, useNavigate } from "react-router";

// AuthContext
import { useAuth } from "../components/AuthContext"

export default function SignupPage() {
	const { signup } = useAuth();
	const navigate = useNavigate();
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);

	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");
	const [formPending, setFormPending] = useState<boolean>(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setSuccess("");
		setError("");
		setFormPending(true);

		try {
			if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
				return setError("Passwords Don't Match");
			}

			await signup(emailRef.current?.value, passwordRef.current?.value);
			setSuccess("Successfully Signed Up");

			return navigate("/profile");
		} catch(error: any) {
			setError("Error: Failed To Signup");
		}

		setFormPending(false);
	}

	return (
		<>
			{error && <div className="rounded-sm border-red-400 border-2 p-3">
				<h3 className="text-2xl text-left text-red-200">
					{error}
				</h3>
			</div>}
			{success && <NavLink to="/profile"><div className="rounded-sm border-lime-400 border-2 p-3">
				<h3 className="text-2xl text-left text-lime-200">
					{success} See Your Profile Here
				</h3>
			</div></NavLink>}
			<Form className="relative flex flex-col gap-1 p-3 bg-white rounded-sm" onSubmit={handleSubmit}>
				<label className="text-lg">Email <span className="text-red-500">*</span></label>
				<input className="text-lg bg-gray-100 border-b-1 mb-2 focus:border-b-2 focus:outline-hidden" type="email" ref={emailRef} required/>
				<label className="text-lg">Password <span className="text-red-500">*</span></label>
				<input className="text-lg bg-gray-100 border-b-1 mb-2 focus:border-b-2 focus:outline-hidden" type="password" ref={passwordRef} required/>
				<label className="text-lg">Confirm Password <span className="text-red-500">*</span></label>
				<input className="text-lg bg-gray-100 border-b-1 focus:border-b-2 focus:outline-hidden" type="password" ref={confirmPasswordRef} required/>

				<button className="bg-lime-100 p-2 mt-3 rounded-md hover:bg-lime-300" type="submit" disabled={formPending}>Signup</button>
				<hr className="my-4 w-full"/>
				<NavLink className="block w-full text-center text-blue-400" to="/login">Already Have An Account? Login Here</NavLink>
			</Form>
		</>
	)
}
