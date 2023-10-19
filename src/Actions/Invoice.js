import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";
export const createInvoice = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateInvoiceRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/proforma-invoices/create`, data, config);
        dispatch({ type: "CreateInvoiceSuccess", payload: response.data });
        toast.success("Invoice created successfully");
        navigate("/invoice/view/" + response.data.id);
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
            dispatch({ type: "CreateInvoiceFailure", payload: err.response?.data || err.message });
        } else {
            dispatch({ type: "CreateInvoiceFailure", payload: err.response?.data || err.message });
            toast.error(err.response?.data || err.message);
        }
    }
}

export const getInvoiceDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "InvoiceDetailsRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/proforma-invoices/read/${id}`, config);
        dispatch({ type: "InvoiceDetailsSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "InvoiceDetailsFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const getInvoiceList = (page = 1, keyword = "") => async (dispatch) => {
    try {
        dispatch({ type: "InvoiceListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/proforma-invoices/read-list/${page}?keyword=${keyword}`, config);
        dispatch({ type: "InvoiceListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "InvoiceListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const deleteInvoice = (id) => async (dispatch) => {
    try {
        dispatch({ type: "InvoiceDeleteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.delete(`${url}/private/client/proforma-invoices/delete/${id}`, config);
        dispatch({ type: "InvoiceDeleteSuccess", payload: response.data });
        toast.success("Invoice deleted successfully");
        dispatch(getInvoiceList());
    } catch (error) {
        console.log(error);
        dispatch({ type: "InvoiceDeleteFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const updateInvoice = (id, data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "InvoiceUpdateRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/proforma-invoices/update/${id}`, data, config);
        dispatch({ type: "InvoiceUpdateSuccess", payload: response.data });
        navigate("/invoice/view/" + id);
        toast.success("Invoice updated successfully");
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
            dispatch({ type: "InvoiceUpdateFailure", payload: err.response?.data || err.message });
        } else {
            dispatch({ type: "InvoiceUpdateFailure", payload: err.response?.data || err.message });
            toast.error(err.response?.data || err.message);
        }
    }
}

export const markInvoiceSent = (id) => async (dispatch) => {
    try {
        dispatch({ type: "InvoiceMarkSentRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/proforma-invoices/mark-sent/${id}`, {}, config);
        dispatch({ type: "InvoiceMarkSentSuccess", payload: response.data });
        toast.success("Invoice marked as sent successfully");
    }
    catch (err) {
        console.log(err);
        dispatch({ type: "InvoiceMarkSentFailure", payload: err.response?.data || err.message });
        toast.error(err.response?.data || err.message);
    }
}

export const markInvoiceVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "InvoiceMarkVoidRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/proforma-invoices/mark-void/${id}`, {}, config);
        dispatch({ type: "InvoiceMarkVoidSuccess", payload: response.data });
        toast.success("Invoice marked as void successfully");
    }
    catch (err) {
        console.log(err);
        dispatch({ type: "InvoiceMarkVoidFailure", payload: err.response?.data || err.message });
        toast.error(err.response?.data || err.message);
    }
}

export const getNewInvoiceNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewInvoiceNumberRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/proforma-invoices/read-new-Invoice-number`, config);
        dispatch({ type: "GetNewInvoiceNumberSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetNewInvoiceNumberFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const downloadInvoiceList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadInvoiceListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: 'blob'
        };
        const response = await axios.get(`${url}/private/client/proforma-invoices/download`, config);
        const url2 = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url2;
        link.setAttribute('download', 'InvoiceList.xlsx');
        document.body.appendChild(link);
        link.click();
        dispatch({ type: "DownloadInvoiceListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "DownloadInvoiceListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}
