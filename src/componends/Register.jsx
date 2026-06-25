import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Building2, Briefcase, Calendar } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        employeeName: "",
        email: "",
        password: "",
        department: "",
        designation: "",
        joiningDate: "",
    });
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setForm({
            employeeName: "",
            email: "",
            password: "",
            department: "",
            designation: "",
            joiningDate: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { employeeName, email, password, department, designation, joiningDate } = form;

        if (!employeeName || !email || !password || !department || !designation || !joiningDate) {
            setError("Please fill all the fields");
            setSuccess("");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setSuccess("");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const { data } = await api.post("/employee/create", {
                ...form,
                role: "employee",
                status: "Active",
            });

            console.log("Add Employee Response:", data);

            setSuccess("Employee added successfully");
            resetForm();
            navigate('/admin-dashboard')


        } catch (err) {
            console.log("CATCH ERROR:", err);
            console.log("RESPONSE:", err.response);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to add employee"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold text-zinc-800 mb-5">
                Add Employee
            </h2>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

                <div>
                    <label className="block text-sm text-zinc-500 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="employeeName"
                        value={form.employeeName}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-black"
                    />
                </div>

                <div>
                    <label className="block text-sm text-zinc-500 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-black"
                    />
                </div>

                <div>
                    <label className="block text-sm text-zinc-500 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="w-full px-3 py-2 pr-9 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-black"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-zinc-500 mb-1">
                        Department
                    </label>
                    <input
                        type="text"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        placeholder="e.g. IT, HR, Sales"
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-black"
                    />
                </div>

                <div>
                    <label className="block text-sm text-zinc-500 mb-1">
                        Designation
                    </label>
                    <input
                        type="text"
                        name="designation"
                        value={form.designation}
                        onChange={handleChange}
                        placeholder="e.g. Team Lead, Developer"
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-black"
                    />
                </div>

                <div>
                    <label className="block text-sm text-zinc-500 mb-1">
                        Joining Date
                    </label>
                    <input
                        type="date"
                        name="joiningDate"
                        value={form.joiningDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-black"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-xl text-sm bg-black text-white hover:bg-zinc-800 transition disabled:opacity-60"
                >
                    {loading ? "Adding Employee..." : "Add Employee"}
                </button>
            </form>
        </div>
    );
}

export default Register;