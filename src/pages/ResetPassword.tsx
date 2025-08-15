import { useRef, useState } from "react";
import { Form } from "react-router";

// AuthContext
import { useAuth } from "../components/AuthContext";

export default function ResetPasswordPage() {
    const auth = useAuth();
    const emailRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formPending, setFormPending] = useState<boolean>(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        console.log(event);

        setError(null);
        setSuccess(null);
        setFormPending(true);

		if (!auth || !emailRef.current) {
			return;
		}

        try {
            await auth.resetPassword(emailRef.current?.value);
            setSuccess("");
        } catch (error) {
			console.log(error);
            setError("Failed to send password reset request");
        }
        setFormPending(false);
    }

    return (
        <>
            {error && (
                <div className="rounded-sm border-red-400 border-2 p-3">
                    <h3 className="text-2xl text-left text-red-200">{error}</h3>
                </div>
            )}
            {success && (
                <div className="rounded-sm border-lime-400 border-2 p-3">
                    <h3 className="text-2xl text-left text-lime-200">
                        Request successfully sent, check your email
                    </h3>
                    <h3 className="text-2xl text-left text-lime-200">
                        Check spam if necessary
                    </h3>
                </div>
            )}
            <Form
                className="relative flex flex-col p-3 bg-white rounded-sm"
                onSubmit={handleSubmit}
            >
                <label className="text-lg">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    className="text-lg bg-gray-100 border-b-1 mb-2 focus:border-b-2 focus:outline-hidden"
                    type="email"
                    ref={emailRef}
                    required
                />
                <button
                    className="bg-lime-100 p-2 mt-3 rounded-md hover:bg-lime-300"
                    type="submit"
                    disabled={formPending}
                >
                    Send Reset Link
                </button>
            </Form>
        </>
    );
}
