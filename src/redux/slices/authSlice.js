import { createSlice } from "@reduxjs/toolkit";

let storedUser = null
try {
    storedUser = JSON.parse(localStorage.getItem('employee'))
} catch {
    storedUser = null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        employee: storedUser,
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token')
    },
    reducers: {
        setUser: (state, action) => {
            state.employee = action.payload.employee
            state.token = action.payload.token
            state.isAuthenticated = true
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('employee', JSON.stringify(action.payload.employee))
        },
        userLogout: (state) => {
            state.employee = null
            state.token = null
            state.isAuthenticated = false
            localStorage.removeItem('token')
            localStorage.removeItem('employee')
        }
    },
})

export const { setUser, userLogout } = authSlice.actions

export default authSlice.reducer