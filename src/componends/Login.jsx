import { useState } from "react";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import api from "../services/api";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";


function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [showPassword, setShowPassword] = useState(false);
    const [email, setUserEmail] = useState("");
    const [password, setUserPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const { data } = await api.post("/employee/login", {
                email,
                password,
            });

            console.log("Login Response:", data);

            dispatch(
                setUser({
                    employee: data.employee,
                    token: data.token,
                })
            );



            console.log("Login Success");

            const role = data.employee.role;

            if (role === "admin") {
                navigate("/admin-dashboard")
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            console.log("CATCH ERROR:", err);
            console.log("RESPONSE:", err.response);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }


    };

    return <>
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4"> <div className="w-full max-w-md">


            <div className="bg-white border border-zinc-200 rounded-3xl shadow-xl p-8">

                <h2 className="text-xl font-semibold text-zinc-900 mb-6">
                    Welcome Back
                </h2>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="
                w-full
                h-12
                pl-10
                pr-4
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                focus:outline-none
                focus:border-black
                focus:bg-white
                transition-all
              "
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setUserPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="
                w-full
                h-12
                pl-10
                pr-10
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                focus:outline-none
                focus:border-black
                focus:bg-white
                transition-all
              "
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-sm text-zinc-500 hover:text-black transition"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
            w-full
            h-12
            rounded-xl
            bg-black
            text-white
            font-medium
            hover:bg-zinc-800
            transition-all
            disabled:opacity-60
          "
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-zinc-500 mt-6">
                    Don't have an account?
                    <button
                        type="button"
                        className="ml-1 font-medium text-black hover:underline"
                    >
                        Register
                    </button>
                </p>

            </div>
        </div>
        </div>

    </>
}

export default Login
