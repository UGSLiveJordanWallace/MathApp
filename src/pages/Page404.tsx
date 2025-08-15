import { NavLink } from "react-router";

export default function Page404() {
    return (
        <div className="flex flex-column items-center justify-center h-dvh bg-slate-950">
            <div className="bg-white rounded-sm w-50% h-50% p-10 text-red-500 text-xl">
                This is a bad page, please go back{" "}
                <NavLink
                    to="/"
                    className={"text-blue-600 text-underline italic underline"}
                >
                    here
                </NavLink>
            </div>
        </div>
    );
}
