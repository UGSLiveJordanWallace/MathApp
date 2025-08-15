import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

// CSS
import "./styles/index.css";

// router
import router from "./routes";

// AuthContext
import AuthProvider from "./components/AuthContext";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
			<RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
