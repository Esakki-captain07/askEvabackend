import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { userLogout } from "../../redux/slices/authSlice";

function Navbar({ onToggleSidebar }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(userLogout());
        navigate("/login");
    };

    return (
        <nav className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between shadow-sm">

            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="
                        p-2 rounded-lg text-zinc-700
                        hover:bg-zinc-100 transition
                    "
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>

                <div>
                    <h1 className="text-xl font-bold text-black">
                        Ask Eva
                    </h1>
                    <p className="text-xs text-zinc-500">
                        Employee Management System
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">

                <div className="text-right">
                    <p className="text-sm font-medium text-zinc-800">
                        {user?.userName}
                    </p>
                    <p className="text-xs text-zinc-500">
                        {user?.role}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="
                        flex items-center
                        gap-2
                        px-4
                        py-2
                        rounded-xl
                        bg-black
                        text-white
                        hover:bg-zinc-800
                        transition
                    "
                >
                    <LogOut size={16} />
                    Logout
                </button>

            </div>
        </nav>
    );
}

export default Navbar;