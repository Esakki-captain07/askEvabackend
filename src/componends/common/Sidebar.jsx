import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    LayoutDashboard,
    CalendarDays,
    ClipboardList,
    Users,
} from "lucide-react";

function Sidebar({ isOpen }) {
    const { employee } = useSelector((state) => state.auth);
    const location = useLocation();

    const role = employee?.role;

    const menuItems = {
        admin: [
            {
                name: "Dashboard",
                icon: LayoutDashboard,
                path: "/admin-dashboard",
            },
            {
                name: "Add Employees",
                icon: ClipboardList,
                path: "/register",
            }
        ],
        employee: [
            {
                name: "Dashboard",
                icon: LayoutDashboard,
                path: "dashboard",
            }
        ],
    };

    return (
        <aside
            className={`
                fixed top-0 left-0 h-screen bg-white border-r border-zinc-200
                transition-all duration-300 ease-in-out z-40
                ${isOpen ? "w-64" : "w-20"}
            `}
        >
            <div className="h-16 border-b border-zinc-200 flex items-center px-4 overflow-hidden">
            </div>

            <div className="p-3 space-y-2">
                {menuItems[role]?.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={!isOpen ? item.name : undefined}
                            className={`
                                flex items-center gap-3 px-3 py-3 rounded-xl
                                transition-all overflow-hidden
                                ${isOpen ? "justify-start" : "justify-center"}
                                ${isActive
                                    ? "bg-black text-white"
                                    : "text-zinc-700 hover:bg-black hover:text-white"}
                            `}
                        >
                            <item.icon size={20} className="shrink-0" />
                            <span
                                className={`whitespace-nowrap transition-all duration-200 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                                    }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}

export default Sidebar;