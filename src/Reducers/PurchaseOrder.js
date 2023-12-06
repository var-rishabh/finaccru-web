import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const purchaseOrderReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("CreatePurchaseOrderRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreatePurchaseOrderFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreatePurchaseOrderSuccess", (state, action) => {
        state.loading = false;
        state.purchaseOrder = action.payload;
        state.error = null;
    })
    .addCase("PurchaseOrderDetailsRequest", (state) => {
        state.loading = true;
    })
    .addCase("PurchaseOrderDetailsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PurchaseOrderDetailsSuccess", (state, action) => {
        state.loading = false;
        state.purchaseOrder = action.payload;
        state.error = null;
    })
    .addCase("PurchaseOrderListRequest", (state) => {
        state.loading = true;
    })
    .addCase("PurchaseOrderListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PurchaseOrderListSuccess", (state, action) => {
        state.loading = false;
        state.purchaseOrders = action.payload;
        state.error = null;
    })
    .addCase("PurchaseOrderDeleteRequest", (state) => {
        state.loading = true;
    })
    .addCase("PurchaseOrderDeleteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PurchaseOrderDeleteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("PurchaseOrderUpdateRequest", (state) => {
        state.loading = true;
    })
    .addCase("PurchaseOrderUpdateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PurchaseOrderUpdateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("GetNewPurchaseOrderNumberRequest", (state) => {
        state.loading = true;
    })
    .addCase("GetNewPurchaseOrderNumberFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("GetNewPurchaseOrderNumberSuccess", (state, action) => {
        state.loading = false;
        state.number = action.payload;
        state.error = null;
    })
})