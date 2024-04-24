import {Outlet} from "react-router-dom";

export function Layout() {
    return (
        <div
            className="flex flex-col items-center justify-between max-w-screen h-screen gap-2 bg-[url('/hero.webp')] bg-center bg-cover text-white selection:bg-teal-700"
            style={{boxShadow: "inset 0 100vh 0 rgba(0, 0, 0, .3)"}}
        >
            <span />
            <Outlet />
            <footer className="p-2 text-sm font-light text-purple-400">Developed by Santiago Combina</footer>
        </div>
    );
}
