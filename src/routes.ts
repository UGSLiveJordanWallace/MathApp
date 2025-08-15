import { createBrowserRouter } from "react-router";

// Pages
import App from "./App";
import AnswerPage from "./pages/AnswerPage";
import ProfilePage from "./pages/ProfilePage";
import Page404 from "./pages/Page404";

// Profile Avatars
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import {
    answerPageAction,
    answerPageLoader,
} from "./components/services";
import ResetPasswordPage from "./pages/ResetPassword";
import MapPage from "./pages/MapPage";
import StatsPage from "./pages/StatsPage";
import AdminPanelPage from "./pages/AdminPanelPage";

const router = createBrowserRouter([
    {
        Component: App,
        ErrorBoundary: Page404,
        children: [
            {
                index: true,
                Component: MapPage,
            },
            {
                path: "answer/:id",
                loader: answerPageLoader,
                action: answerPageAction,
                Component: AnswerPage,
            },
            {
                path: "profile",
                Component: ProfilePage,
            },
            {
                path: "login",
                Component: LoginPage,
            },
            {
                path: "signup",
                Component: SignupPage,
            },
            {
                path: "reset-password",
                Component: ResetPasswordPage,
            },
			{
				path: "stats",
				Component: StatsPage,
			},
			{
				path: "admin",
				Component: AdminPanelPage,
			}
        ],
    },
]);

export default router;
