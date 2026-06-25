import { useState } from "react";
import Sidebar from "../common/Sidebar.jsx";
import Navbar from "../common/Navbar.jsx";

function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="min-h-screen bg-zinc-50">
            <Sidebar isOpen={isSidebarOpen} />

            <div
                className={`
                    transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? "ml-64" : "ml-20"}
                `}
            >
                <Navbar onToggleSidebar={toggleSidebar} />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;