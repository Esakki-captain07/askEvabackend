import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchEmployees,
    updateEmployee,
    deleteEmployee,
    fetchDashboardStats,
} from "../redux/slices/employeeSlice";
import { ChevronLeft, ChevronRight, X, MoreVertical, Eye, Pencil, Trash2, Search } from "lucide-react";

const MENU_WIDTH = 160;
const MENU_HEIGHT = 130;

function EmployeeTable() {
    const dispatch = useDispatch();
    const { list, totalPages, currentPage, loading, error } = useSelector((state) => state.employee);
    const { employee: currentUser } = useSelector((state) => state.auth);

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");

    const [openMenuId, setOpenMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [viewingUser, setViewingUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [form, setForm] = useState({
        employeeName: "",
        email: "",
        department: "",
        designation: "",
        status: "",
        role: "",
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchKeyword(searchInput);
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        setPage(1);
    }, [department, status]);

    useEffect(() => {
        const params = { page, limit: 5 };
        if (searchKeyword) params.searchkeyword = searchKeyword;
        if (department) params.department = department;
        if (status) params.status = status;

        dispatch(fetchEmployees(params));
    }, [dispatch, page, searchKeyword, department, status]);

    const clearFilters = () => {
        setSearchInput("");
        setSearchKeyword("");
        setDepartment("");
        setStatus("");
    };

    const toggleMenu = (e, id) => {
        if (openMenuId === id) {
            setOpenMenuId(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < MENU_HEIGHT;

        setMenuPosition({
            top: openUpward ? rect.top - MENU_HEIGHT - 4 : rect.bottom + 4,
            left: Math.max(8, rect.right - MENU_WIDTH),
        });
        setOpenMenuId(id);
    };

    const menuUser = list.find((u) => u._id === openMenuId);

    const openEdit = (u) => {
        setEditingUser(u);
        setForm({
            employeeName: u.employeeName || "",
            email: u.email || "",
            department: u.department || "",
            designation: u.designation || "",
            status: u.status || "",
            role: u.role || "",
        });
        setOpenMenuId(null);
    };

    const handleSave = async () => {
        const roleChanged = editingUser.role !== form.role;
        const statusChanged = editingUser.status !== form.status;

        const { role, ...rest } = form;
        const payload = currentUser?.role === "admin" ? form : rest;

        const res = await dispatch(updateEmployee({ id: editingUser._id, data: payload }));
        if (res.meta.requestStatus === "fulfilled") {

            if (roleChanged || statusChanged) {
                dispatch(fetchDashboardStats());
            }

            const params = { page, limit: 5 };
            if (searchKeyword) params.searchkeyword = searchKeyword;
            if (department) params.department = department;
            if (status) params.status = status;
            dispatch(fetchEmployees(params));

            setEditingUser(null);
        }
    };

    const handleDelete = async () => {
        const res = await dispatch(deleteEmployee(deletingUser._id));
        if (res.meta.requestStatus === "fulfilled") {
            dispatch(fetchDashboardStats());

            const params = { page, limit: 5 };
            if (searchKeyword) params.searchkeyword = searchKeyword;
            if (department) params.department = department;
            if (status) params.status = status;
            dispatch(fetchEmployees(params));

            setDeletingUser(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const hasActiveFilters = searchInput || department || status;

    return (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-800 mb-4">Employees</h2>

            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by name or email"
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-black"
                    />
                </div>

                <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-black"
                >
                    <option value="">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                </select>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-black"
                >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 transition"
                    >
                        Clear
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <p className="text-zinc-500 text-sm">Loading...</p>
            ) : list.length === 0 ? (
                <p className="text-zinc-500 text-sm">
                    {hasActiveFilters ? "No employees match your search/filters." : "No employees found."}
                </p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-zinc-200 text-zinc-500">
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4">Email</th>
                                    <th className="py-2 pr-4">Department</th>
                                    <th className="py-2 pr-4">Designation</th>
                                    <th className="py-2 pr-4">Status</th>
                                    <th className="py-2 pr-4">Joining Date</th>
                                    <th className="py-2 pr-4">Role</th>
                                    <th className="py-2 pr-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((u) => (
                                    <tr key={u._id} className="border-b border-zinc-100 text-zinc-700">
                                        <td className="py-3 pr-4">{u.employeeName}</td>
                                        <td className="py-3 pr-4">{u.email}</td>
                                        <td className="py-3 pr-4">{u.department}</td>
                                        <td className="py-3 pr-4">{u.designation}</td>
                                        <td className="py-3 pr-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === "Active"
                                                ? "bg-green-50 text-green-600"
                                                : "bg-zinc-100 text-zinc-500"
                                                }`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4">{formatDate(u.joiningDate)}</td>
                                        <td className="py-3 pr-4 capitalize">{u.role}</td>
                                        <td className="py-3 pr-4">
                                            <button
                                                onClick={(e) => toggleMenu(e, u._id)}
                                                className="p-1.5 rounded-lg hover:bg-zinc-100 transition"
                                            >
                                                <MoreVertical size={18} className="text-zinc-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} /> Prev
                            </button>
                            <span className="text-sm text-zinc-500">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}

            {openMenuId && menuUser && createPortal(
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                    <div
                        style={{ position: "fixed", top: menuPosition.top, left: menuPosition.left, width: MENU_WIDTH }}
                        className="z-50 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden"
                    >
                        <button
                            onClick={() => { setViewingUser(menuUser); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition"
                        >
                            <Eye size={15} /> View More
                        </button>
                        <button
                            onClick={() => openEdit(menuUser)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition"
                        >
                            <Pencil size={15} /> Edit
                        </button>
                        <button
                            onClick={() => { setDeletingUser(menuUser); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                            <Trash2 size={15} /> Delete
                        </button>
                    </div>
                </>,
                document.body
            )}

            {viewingUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-zinc-800">Employee Details</h3>
                            <button onClick={() => setViewingUser(null)} className="text-zinc-400 hover:text-zinc-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Name</span>
                                <span className="text-zinc-800 font-medium">{viewingUser.employeeName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Email</span>
                                <span className="text-zinc-800 font-medium">{viewingUser.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Department</span>
                                <span className="text-zinc-800 font-medium">{viewingUser.department || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Designation</span>
                                <span className="text-zinc-800 font-medium">{viewingUser.designation || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Status</span>
                                <span className="text-zinc-800 font-medium">{viewingUser.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Joining Date</span>
                                <span className="text-zinc-800 font-medium">{formatDate(viewingUser.joiningDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Role</span>
                                <span className="text-zinc-800 font-medium capitalize">{viewingUser.role}</span>
                            </div>
                        </div>
                        <div className="flex justify-end mt-5">
                            <button onClick={() => setViewingUser(null)} className="px-4 py-2 rounded-xl text-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-zinc-800">Edit Employee</h3>
                            <button onClick={() => setEditingUser(null)} className="text-zinc-400 hover:text-zinc-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-zinc-500">Name</label>
                                <input
                                    value={form.employeeName}
                                    onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-500">Email</label>
                                <input
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-500">Department</label>
                                <input
                                    value={form.department}
                                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-500">Designation</label>
                                <input
                                    value={form.designation}
                                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-500">Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            {currentUser?.role === "admin" && (
                                <div>
                                    <label className="text-sm text-zinc-500">Role</label>
                                    <select
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="hr">HR</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 mt-5">
                            <button onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl text-sm text-zinc-600 hover:bg-zinc-100 transition">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 rounded-xl text-sm bg-black text-white hover:bg-zinc-800 transition">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deletingUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold text-zinc-800 mb-2">Delete employee?</h3>
                        <p className="text-sm text-zinc-500 mb-5">
                            This will permanently remove <span className="font-medium text-zinc-700">{deletingUser.employeeName}</span>'s account. This can't be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeletingUser(null)} className="px-4 py-2 rounded-xl text-sm text-zinc-600 hover:bg-zinc-100 transition">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded-xl text-sm bg-red-600 text-white hover:bg-red-700 transition">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeTable;