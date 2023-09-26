import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    check: false,
}

export const onboardingReducer = createReducer(initialState, (builder) => {

    builder
        .addCase("CompanyDetailsRequest", (state) => {
            state.loading = true;
        })
        .addCase("CompanyDetailsFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CompanyDetailsSuccess", (state, action) => {
            state.loading = false;
            state.check = action.payload;
            state.error = null;
        })
        .addCase("BankDetailsRequest", (state) => {
            state.loading = true;
        })
        .addCase("BankDetailsFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("BankDetailsSuccess", (state, action) => {
            state.loading = false;
            state.check = action.payload;
            state.error = null;
        })
        .addCase("UploadDocumentsRequest", (state) => {
            state.loading = true;
        })
        .addCase("UploadDocumentsFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("UploadDocumentsSuccess", (state, action) => {
            state.loading = false;
            state.check = action.payload;
            state.error = null;
        })
        .addCase("GetCompanyTypeRequest", (state) => {
            state.loading = true;
        })
        .addCase("GetCompanyTypeFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("GetCompanyTypeSuccess", (state, action) => {
            state.loading = false;
            state.companyTypes = action.payload;
            state.error = null;
        })
        .addCase("GetCurrencyRequest", (state) => {
            state.loading = true;
        })
        .addCase("GetCurrencyFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("GetCurrencySuccess", (state, action) => {
            state.loading = false;
            state.currencies = action.payload;
            state.error = null;
        })
        .addCase("GetIndustryRequest", (state) => {
            state.loading = true;
        })
        .addCase("GetIndustryFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("GetIndustrySuccess", (state, action) => {
            state.loading = false;
            state.industries = action.payload;
            state.error = null;
        })
});
