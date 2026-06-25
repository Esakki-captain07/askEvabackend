import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.js";
import employeeSlice from "./slices/employeeSlice.js";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        employee: employeeSlice
    }
});