import axios from 'axios';
import { auth } from "../firebase";
import { toast } from 'react-toastify';
import url from '../data/url';

export const createPayments = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreatePaymentsRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/payments/create`, data, config);
        dispatch({ type: "CreatePaymentsSuccess", payload: response.data });
        toast.success("Payment created successfully");
        navigate("/payment");
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
            dispatch({ type: "CreatePaymentsFailure", payload: err.response?.data || err.message });
        } else {
            dispatch({ type: "CreatePaymentsFailure", payload: err.response?.data || err.message });
            toast.error(err.response?.data || err.message);
        }
    }
}

export const getPaymentsDetails = (id, role = 0) => async (dispatch) => {
    try {
        dispatch({ type: "PaymentsDetailsRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        if (role === 0) {
            const response = await axios.get(`${url}/private/client/payments/read/${id}`, config);
            dispatch({ type: "PaymentsDetailsSuccess", payload: response.data });
        } else {
            const response = await axios.get(`${url}/private/accountant/read-payment-receipt/${id}`, config);
            dispatch({ type: "PaymentsDetailsSuccess", payload: response.data });
        }
    } catch (error) {
        console.log(error);
        dispatch({ type: "PaymentsDetailsFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const getPaymentsList = (page = 1, keyword = "", customer_id = 0, role = 0, client_id = 0, showAll = false) => async (dispatch) => {
    try {
        dispatch({ type: "PaymentsListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        if (role === 0) {
            const response = await axios.get(`${url}/private/client/payments/read-list/${page}?keyword=${keyword}${customer_id !== 0 ? `&customer_id=${customer_id}` : ""}`, config);
            dispatch({ type: "PaymentsListSuccess", payload: response.data });
        } else {
            const response = await axios.get(`${url}/private/accountant/${role === 1 ? 'jr' : 'sr'}/read-receipts/${client_id}/${page}?show_all=${showAll}`, config);
            dispatch({ type: "PaymentsListSuccess", payload: response.data });
        }
    } catch (error) {
        console.log(error);
        dispatch({ type: "PaymentsListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const deletePayments = (id) => async (dispatch) => {
    try {
        dispatch({ type: "PaymentsDeleteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.delete(`${url}/private/client/payments/delete/${id}`, config);
        dispatch({ type: "PaymentsDeleteSuccess", payload: response.data });
        toast.success("Payment deleted successfully");
        dispatch(getPaymentsList());
    } catch (error) {
        console.log(error);
        dispatch({ type: "PaymentsDeleteFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const updatePayments = (id, data, navigate, role = 0) => async (dispatch) => {
    try {
        dispatch({ type: "PaymentsUpdateRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        if (role === 0) {
            const response = await axios.put(`${url}/private/client/payments/update/${id}`, data, config);
            dispatch({ type: "PaymentsUpdateSuccess", payload: response.data });
        } else {
            const response = await axios.put(`${url}/private/accountant/update-payment-receipt/${id}`, data, config);
            dispatch({ type: "PaymentsUpdateSuccess", payload: response.data });
        }
        toast.success("Payment updated successfully");
        if (role === 0) navigate("/payment/view/" + id);
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
            dispatch({ type: "PaymentsUpdateFailure", payload: err.response?.data || err.message });
        } else {
            dispatch({ type: "PaymentsUpdateFailure", payload: err.response?.data || err.message });
            toast.error(err.response?.data || err.message);
        }
    }
}

export const markPaymentsVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "PaymentsMarkVoidRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/payments/mark-void/${id}`, {}, config);
        dispatch({ type: "PaymentsMarkVoidSuccess", payload: response.data });
        toast.success("Payment marked as void successfully");
        dispatch(getPaymentsDetails(id));
    }
    catch (err) {
        console.log(err);
        dispatch({ type: "PaymentsMarkVoidFailure", payload: err.response?.data || err.message });
        toast.error(err.response?.data || err.message);
    }
}

export const getNewPaymentsNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewPaymentsNumberRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/payments/read-new-receipt-number`, config);
        dispatch({ type: "GetNewPaymentsNumberSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetNewPaymentsNumberFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const downloadPaymentsList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadPaymentsListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: 'blob'
        };
        const response = await axios.get(`${url}/private/client/payments/download`, config);
        const url2 = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url2;
        link.setAttribute('download', 'PaymentsList.xlsx');
        document.body.appendChild(link);
        link.click();
        dispatch({ type: "DownloadPaymentsListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "DownloadPaymentsListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const submitPaymentsForApproval = (id) => async (dispatch) => {
    try {
        dispatch({ type: "SubmitPaymentsForApprovalRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.put(`${url}/private/client/payments/submit-for-approval/${id}`, {}, config);
        dispatch({ type: "SubmitPaymentsForApprovalSuccess", payload: response.data });
        toast.success("Payment submitted for approval successfully");
        dispatch(getPaymentsDetails(id));
    } catch (error) {
        console.log(error);
        dispatch({ type: "SubmitPaymentsForApprovalFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const readOpenPaymentsForCustomer = (id, currency_id) => async (dispatch) => {
    try {
        dispatch({ type: "ReadOpenPaymentsForCustomerRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.get(`${url}/private/client/payments/read-open-payments-for-customer/${id}?currency_id=${currency_id}`, config);
        dispatch({ type: "ReadOpenPaymentsForCustomerSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "ReadOpenPaymentsForCustomerFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const approvePayments = (id, role = 1, client_id) => async (dispatch) => {
    try {
        dispatch({ type: "ApprovePaymentsRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.put(`${url}/private/accountant/${role === 1 ? 'jr' : 'sr'}/approve-payment-receipt/${id}`, {}, config);
        dispatch({ type: "ApprovePaymentsSuccess", payload: response.data });
        toast.success("Payment approved successfully");
        dispatch(getPaymentsList(1, "", 0, role, client_id));
    } catch (error) {
        console.log(error);
        dispatch({ type: "ApprovePaymentsFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}