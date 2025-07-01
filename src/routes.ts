import { createBrowserRouter } from "react-router";

// Pages
import App from "./App";
import AnswerPage from "./pages/AnswerPage";
import ProfilePage from "./pages/ProfilePage";
import Page404 from "./pages/Page404";

// Profile Avatars
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import { type Problem, type ProblemSet } from "./components/Types";
import { get, ref } from "firebase/database";
import { db } from "./firebase";
import { answerPageAction, answerPageLoader, mapPageLoader } from "./components/LoadersActions";
import ResetPasswordPage from "./pages/ResetPassword";
import MapPage from "./pages/MapPage";

const router = createBrowserRouter([
    {
        Component: App,
		ErrorBoundary: Page404,
        children: [
            {
                index: true,
				loader: mapPageLoader,
				Component: MapPage
            },
			{
				path: "answer/:id",
                loader: answerPageLoader,
                action: answerPageAction,
                Component: AnswerPage
			},
            {
                path: "profile",
                Component: ProfilePage
            },
			{
				path: "login",
				Component: LoginPage
			},
			{
				path: "signup",
				Component: SignupPage
			},
			{
				path: "reset-password",
				Component: ResetPasswordPage
			}
        ],
    },
]);

export default router;
