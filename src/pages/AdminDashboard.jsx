import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, UserCheck, UserX } from "lucide-react";

import { fetchDashboardStats } from "../redux/slices/employeeSlice.js";
import EmployeeTable from "../pages/EmployeeTable";

function AdminDashboard() {

    const dispatch = useDispatch();

    const { employee } = useSelector((state) => state.auth);
    const { counts } = useSelector((state) => state.employee);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    const cards = [
        {
            label: "Total Employees",
            value: counts?.totalEmployees || 0,
            icon: Users,
            color: "bg-zinc-100 text-zinc-700"
        },
        {
            label: "Active Employees",
            value: counts?.activeEmployees || 0,
            icon: UserCheck,
            color: "bg-green-50 text-green-600"
        },
        {
            label: "Inactive Employees",
            value: counts?.inactiveEmployees || 0,
            icon: UserX,
            color: "bg-red-50 text-red-600"
        }
    ];

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-zinc-800">
                    Welcome back, {employee?.employeeName}
                </h1>

                <p className="text-sm text-zinc-500">
                    Employee Management Dashboard
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white border border-zinc-200 rounded-xl shadow-sm p-5 flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-xl ${card.color}`}>
                            <card.icon size={22} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold">
                                {card.value}
                            </h2>

                            <p className="text-zinc-500 text-sm">
                                {card.label}
                            </p>
                        </div>
                    </div>
                ))}

            </div>

            <EmployeeTable />

        </div>
    );
}

export default AdminDashboard;