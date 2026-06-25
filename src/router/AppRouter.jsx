import { Navigate } from "react-router-dom";
import Login from "../componends/Login.jsx";
import ProtectedRoute from "../services/ProtectedRoute.jsx";
import DashboardLayout from '../componends/common/DashboardLayout.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import AdminDashboard from "../pages/AdminDashboard.jsx";
import Register from "../componends/Register.jsx";


export const AppRouter = [
    {
        path: "/",
        element: <Navigate to="/login" />
    },

    {
        path: "/login",
        element: <Login />
    },

    {
        path: "/admin-dashboard",
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout>
                    <AdminDashboard />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/register",
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout>
                    <Register />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard",
        element: (
            <DashboardLayout>
                <Dashboard />
            </DashboardLayout>
        )
    },

    {
        path: "*",
        element: <Navigate to="/login" />
    }
];