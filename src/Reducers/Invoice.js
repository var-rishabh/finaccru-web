import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const invoiceReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("CreateInvoiceRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreateInvoiceFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreateInvoiceSuccess", (state, action) => {
        state.loading = false;
        state.invoice = action.payload;
        state.error = null;
    })
    .addCase("InvoiceDetailsRequest", (state) => {
        state.loading = true;
    })
    .addCase("InvoiceDetailsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("InvoiceDetailsSuccess", (state, action) => {
        state.loading = false;
        state.invoice = action.payload;
        state.error = null;
    })
    .addCase("InvoiceListRequest", (state) => {
        state.loading = true;
    })
    .addCase("InvoiceListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("InvoiceListSuccess", (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
        state.error = null;
    })
    .addCase("InvoiceDeleteRequest", (state) => {
        state.loading = true;
    })
    .addCase("InvoiceDeleteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("InvoiceDeleteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("InvoiceUpdateRequest", (state) => {
        state.loading = true;
    })
    .addCase("InvoiceUpdateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("InvoiceUpdateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("InvoiceMarkSentRequest", (state) => {
        state.loading = true;
    })
    .addCase("InvoiceMarkSentFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("InvoiceMarkSentSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("InvoiceMarkVoidRequest", (state) => {
        state.loading = true;
    })
    .addCase("InvoiceMarkVoidFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("InvoiceMarkVoidSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("GetNewInvoiceNumberRequest", (state) => {
        state.loading = true;
    })
    .addCase("GetNewInvoiceNumberFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("GetNewInvoiceNumberSuccess", (state, action) => {
        state.loading = false;
        state.number = action.payload;
        state.error = null;
    })
    .addCase("DownloadInvoiceRequest", (state) => {
        state.loading = true;
    })
    .addCase("DownloadInvoiceFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DownloadInvoiceSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
})

