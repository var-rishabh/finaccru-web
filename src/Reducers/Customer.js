import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    customer: null,
    customers: [],
    customersInf: [],
    shippingAddresses: [],
}

export const customerReducer = createReducer(initialState, (builder) => {

    builder
        .addCase("CreateCustomerRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreateCustomerFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreateCustomerSuccess", (state, action) => {
            state.loading = false;
            state.customer = action.payload;
            state.error = null;
        })
        .addCase("CustomerDetailsRequest", (state) => {
            state.loading = true;
        })
        .addCase("CustomerDetailsFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CustomerDetailsSuccess", (state, action) => {
            state.loading = false;
            state.customer = action.payload;
            state.error = null;
        })
        .addCase("CustomerListRequest", (state) => {
            state.loading = true;
        })
        .addCase("CustomerListFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CustomerListSuccess", (state, action) => {
            state.loading = false;
            state.customers = action.payload;
            state.error = null;
        })
        .addCase("CustomerInfiniteScrollRequest", (state) => {
            state.loading = true;
        })
        .addCase("CustomerInfiniteScrollFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CustomerInfiniteScrollSuccess", (state, action) => {
            state.loading = false;
            state.customersInf = action.payload.refresh ? action.payload.data.items : [...state.customersInf, ...action.payload.data.items];
            state.totalCustomers = action.payload.data.total_items;
            state.error = null;
        })
        .addCase("CreateShippingAddressRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreateShippingAddressFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreateShippingAddressSuccess", (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
        })
        .addCase("ShippingAddressListRequest", (state) => {
            state.loading = true;
        })
        .addCase("ShippingAddressListFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ShippingAddressListSuccess", (state, action) => {
            state.loading = false;
            state.shippingAddresses = action.payload;
            state.error = null;
        })
})
