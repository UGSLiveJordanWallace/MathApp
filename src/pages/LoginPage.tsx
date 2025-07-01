import { useRef, useState } from "react";
import { Form, NavLink, useNavigate } from "react-router";

// AuthContext
import { useAuth } from "../components/AuthContext";

export default function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");
	const [formPending, setFormPending] = useState<boolean>(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setSuccess("");
		setError("");
		setFormPending(true);

		try {
			await login(emailRef.current?.value, passwordRef.current?.value);
			setSuccess("Successfully Logged In");
			setFormPending(false);

			return navigate("/profile");
		} catch(error: any) {
			setError("Error: Failed To Login");
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
			{success && <div className="rounded-sm border-lime-400 border-2 p-3">
				<h3 className="text-2xl text-left text-lime-200">
					{success}
				</h3>
			</div>}
			<Form className="relative flex flex-col p-3 bg-white rounded-sm" onSubmit={handleSubmit}>
				<label className="text-lg">Email <span className="text-red-500">*</span></label>
				<input className="text-lg bg-gray-100 border-b-1 mb-2 focus:border-b-2 focus:outline-hidden" type="email" ref={emailRef} required/>
				<label className="text-lg">Password <span className="text-red-500">*</span></label>
				<input className="text-lg bg-gray-100 border-b-1 mb-2 focus:border-b-2 focus:outline-hidden" type="password" ref={passwordRef} required/>

				<button className="bg-lime-100 p-2 mt-3 rounded-md hover:bg-lime-300" type="submit" disabled={formPending}>Login</button>
				<hr className="my-4 w-full"/>
				<NavLink className="block w-full text-center text-blue-400" to="/signup">Create An Account Here</NavLink>
			</Form>
		</>
	)
}
