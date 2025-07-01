import { Outlet } from "react-router";

// Reusable Components
import { Navbar } from "./components/Navbar";

function App() {
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center gap-2 h-dvh bg-slate-950">
                <Outlet />
            </div>
        </>
    );
}

export default App;
