import { NavLink } from "react-router";
import { useAuth } from "./AuthContext";

export function Navbar() {
	const { currentUser, logout } = useAuth();

	async function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		try {
			await logout();
		} catch(error) {
		}
	}

    return (
        <nav className="sticky top-0 z-2 w-full flex flex-row justify-between bg-slate-950 text-white border-b-1 border-white">
            <Navblock className="hidden sm:flex">
                <h1 className="text-lg hidden p-3 sm:text-3xl sm:inline">Math App</h1>
            </Navblock>
            <Navblock className="w-full sm:w-auto">
                <Navlink to="/">Map</Navlink>
                <Navlink to="/profile">Profile</Navlink>
				{currentUser && <button onClick={handleLogout} className="w-full h-full p-3 bg-red-500 hover:bg-red-600">Logout</button>}
            </Navblock>
        </nav>
    );
}

type NavBlockProps = {
    className?: string;
    children: React.ReactNode;
};

export function Navblock({ className, children }: NavBlockProps) {
    return (
        <span className={"flex flex-row items-center " + className}>
            {children}
        </span>
    );
}

type NavLinkProps = {
    to: string;
    children: React.ReactNode;
};

export function Navlink({ to, children }: NavLinkProps) {
    return (
        <NavLink
            to={to}
            className="relative block flex-1 text-center p-2 sm:p-4 z-0 h-full transition-all duration-250 hover:text-black after:content-[''] after:absolute after:-z-1 after:-top-full after:inset-0 after:bg-indigo-50 after:w-full after:h-full after:transition-all after:duration-250 hover:after:top-0"
        >
            {children}
        </NavLink>
    );
}
