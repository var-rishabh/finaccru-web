import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    check: false,
}

export const userReducer = createReducer(initialState, (builder) => {

    builder
        .addCase("CheckUserRequest", (state) => {
            state.loading = true;
        })
        .addCase("CheckUserFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CheckUserSuccess", (state, action) => {
            state.loading = false;
            state.check = action.payload;
            state.error = null;
        })
        .addCase("LoginRequest", (state) => {
            state.loading = true;
        })
        .addCase("LoginFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("LoginSuccess", (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
            state.isAuthenticated = true;
        })
        .addCase("ForgotPasswordRequest", (state) => {
            state.loading = true;
        })
        .addCase("ForgotPasswordFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ForgotPasswordSuccess", (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase("ResetPasswordRequest", (state) => {
            state.loading = true;
        })
        .addCase("ResetPasswordFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ResetPasswordSuccess", (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase("RegisterRequest", (state) => {
            state.loading = true;
        })
        .addCase("RegisterFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("RegisterSuccess", (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
            state.isAuthenticated = true;
        })
        .addCase("LoadUserRequest", (state) => {
            state.loading = true;
        })
        .addCase("LoadUserFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("LoadUserSuccess", (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
            state.isAuthenticated = true;
        })
        .addCase("LogoutRequest", (state) => {
            state.loading = true;
        })
        .addCase("LogoutFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("LogoutSuccess", (state) => {
            state.loading = false;
            state.user = null;
            state.error = null;
            state.isAuthenticated = false;
        })
        .addCase("ConfirmEmailRequest", (state) => {
            state.check = false;
        })
        .addCase("ConfirmEmailFailure", (state, action) => {
            state.check = false;
            state.error = action.payload;
        })
        .addCase("ConfirmEmailSuccess", (state) => {
            state.check = true;
            state.error = null;
        })
        .addCase("ClearUserError", (state) => {
            state.error = null;
        })
})
