import axios from 'axios';
import { auth } from "../firebase";
import { toast } from 'react-toastify';
import url from '../data/url';

export const createTaxInvoice = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateTaxInvoiceRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/tax-invoices/create`, data, config);
        dispatch({ type: "CreateTaxInvoiceSuccess", payload: response.data });
        toast.success("Tax Invoice created successfully");
        navigate("/tax-invoice");
    }
    catch (err) {
        console.log(err);
        if (err.response?.status === 422) {
            // I will get an array of errs from the backend in details
            const errs = err.response.data.detail;
            // I will loop through the array and display the errs
            errs?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({ type: "CreateTaxInvoiceFailure", payload: err.response?.data || err.message });
        } else {
            dispatch({ type: "CreateTaxInvoiceFailure", payload: err.response?.data || err.message });
            toast.error(err.response?.data || err.message);
        }
    }
}

export const getTaxInvoiceDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "TaxInvoiceDetailsRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/tax-invoices/read/${id}`, config);
        dispatch({ type: "TaxInvoiceDetailsSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "TaxInvoiceDetailsFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const getTaxInvoiceList = (page = 1, keyword = "", customer_id = 0) => async (dispatch) => {
    try {
        dispatch({ type: "TaxInvoiceListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/tax-invoices/read-list/${page}?keyword=${keyword}${customer_id !== 0 ? `&customer_id=${customer_id}` : ""}`, config);
        dispatch({ type: "TaxInvoiceListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "TaxInvoiceListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const deleteTaxInvoice = (id) => async (dispatch) => {
    try {
        dispatch({ type: "TaxInvoiceDeleteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.delete(`${url}/private/client/tax-invoices/delete/${id}`, config);
        dispatch({ type: "TaxInvoiceDeleteSuccess", payload: response.data });
        toast.success("TaxInvoice deleted successfully");
        dispatch(getTaxInvoiceList());
    } catch (error) {
        console.log(error);
        dispatch({ type: "TaxInvoiceDeleteFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const updateTaxInvoice = (id, data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "TaxInvoiceUpdateRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/tax-invoices/update/${id}`, data, config);
        dispatch({ type: "TaxInvoiceUpdateSuccess", payload: response.data });
        navigate("/tax-invoice/view/" + id);
        toast.success("TaxInvoice updated successfully");
    }
    catch (err) {
        console.log(err);
        if (err.response?.status === 422) {
            // I will get an array of errs from the backend in details
            const errs = err.response.data.detail;
            // I will loop through the array and display the errs
            errs?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({ type: "TaxInvoiceUpdateFailure", payload: err.response?.data || err.message });
        } else {
            dispatch({ type: "TaxInvoiceUpdateFailure", payload: err.response?.data || err.message });
            toast.error(err.response?.data || err.message);
        }
    }
}

export const markTaxInvoiceVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "TaxInvoiceMarkVoidRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/tax-invoices/mark-void/${id}`, {}, config);
        dispatch({ type: "TaxInvoiceMarkVoidSuccess", payload: response.data });
        toast.success("Tax Invoice marked as void successfully");
        dispatch(getTaxInvoiceDetails(id));
    }
    catch (err) {
        console.log(err);
        dispatch({ type: "TaxInvoiceMarkVoidFailure", payload: err.response?.data || err.message });
        toast.error(err.response?.data || err.message);
    }
}

export const getNewTaxInvoiceNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewTaxInvoiceNumberRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/tax-invoices/read-new-ti-number`, config);
        dispatch({ type: "GetNewTaxInvoiceNumberSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetNewTaxInvoiceNumberFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const downloadTaxInvoiceList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadTaxInvoiceListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: 'blob'
        };
        const response = await axios.get(`${url}/private/client/tax-invoices/download`, config);
        const url2 = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url2;
        link.setAttribute('download', 'TaxInvoiceList.xlsx');
        document.body.appendChild(link);
        link.click();
        dispatch({ type: "DownloadTaxInvoiceListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "DownloadTaxInvoiceListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const submitTaxInvoiceForApproval = (id) => async (dispatch) => {
    try {
        dispatch({ type: "SubmitTaxInvoiceForApprovalRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.put(`${url}/private/client/tax-invoices/submit-for-approval/${id}`, {}, config);
        dispatch({ type: "SubmitTaxInvoiceForApprovalSuccess", payload: response.data });
        toast.success("Tax Invoice submitted for approval successfully");
        dispatch(getTaxInvoiceDetails(id));
    } catch (error) {
        console.log(error);
        dispatch({ type: "SubmitTaxInvoiceForApprovalFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const extractDataFromTaxInvoice = (file, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "ExtractDataFromTaxInvoiceRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const form = new FormData();
        form.append("invoice_file", file);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/tax-invoices/extract-data-from-invoice`, form, config);
        navigate("/tax-invoice/create?file=true", { state: response.data });
        dispatch({ type: "ExtractDataFromTaxInvoiceSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "ExtractDataFromTaxInvoiceFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const readOpenTaxInvoicesForCustomer = (id, currency_id = 1) => async (dispatch) => {
    try {
        dispatch({ type: "ReadOpenTaxInvoicesForCustomerRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.get(`${url}/private/client/tax-invoices/read-open-invoices-for-customer/${id}?currency_id=${currency_id}`, config);
        dispatch({ type: "ReadOpenTaxInvoicesForCustomerSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "ReadOpenTaxInvoicesForCustomerFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}