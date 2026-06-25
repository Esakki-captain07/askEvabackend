import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const loginEmployee = createAsyncThunk(
    "employee/loginEmployee",
    async (data, { rejectWithValue }) => {
        try {

            const res = await api.post(
                "/employee/login",
                data
            );

            return res.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message
            );

        }
    }
);

export const fetchEmployees = createAsyncThunk(
    "employee/fetchEmployees",
    async (params, { rejectWithValue }) => {
        try {

            const query = new URLSearchParams(params).toString();

            const res = await api.get(
                `/employee/all_employees?${query}`
            );

            return res.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message
            );

        }
    }
);

export const createEmployee = createAsyncThunk(
    "employee/createEmployee",
    async (data, { rejectWithValue }) => {
        try {

            const res = await api.post(
                "/employee/create",
                data
            );

            return res.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message
            );

        }
    }
);


export const fetchDashboardStats = createAsyncThunk(
    "employee/fetchDashboardStats",
    async (_, { rejectWithValue }) => {
        try {

            const res = await api.get(
                "/employee/dashboard"
            );

            return res.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message
            );

        }
    }
);


export const updateEmployee = createAsyncThunk(
    "employee/updateEmployee",
    async ({ id, data }, { rejectWithValue }) => {
        try {

            const res = await api.put(
                `/employee/update_employee/${id}`,
                data
            );

            return res.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message
            );

        }
    }
);

export const deleteEmployee = createAsyncThunk(
    "employee/deleteEmployee",
    async (id, { rejectWithValue }) => {
        try {

            const res = await api.get(
                `/employee/delete_employee/${id}`
            );

            return {
                id,
                ...res.data
            };

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message
            );

        }
    }
);

const employeeSlice = createSlice({
    name: "employee",

    initialState: {
        list: [],
        counts: null,
        totalPages: 1,
        currentPage: 1,
        loading: false,
        error: null,
        employee: null,
        token: null
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(loginEmployee.pending, (state) => {
                state.loading = true;
            })

            .addCase(loginEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employee = action.payload.employee;
                state.token = action.payload.token;
            })

            .addCase(loginEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.employee;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createEmployee.fulfilled, (state, action) => {
                state.list.unshift(action.payload.employee);
            })

            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.list = state.list.map((emp) =>
                    emp._id === action.payload.employee._id
                        ? action.payload.employee
                        : emp
                );
            })

            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.list = state.list.filter(
                    (emp) => emp._id !== action.payload.id
                );
            })


            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.counts = action.payload;
            })

            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});

export default employeeSlice.reducer;