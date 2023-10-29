import axios from 'axios';
import { auth } from "../firebase";
import { toast } from 'react-toastify';
import url from '../data/url';

export const createCreditNote = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateCreditNoteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/credit-notes/create`, data, config);
        dispatch({ type: "CreateCreditNoteSuccess", payload: response.data });
        toast.success("Credit Note created successfully");
        navigate("/credit-note");
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
            dispatch({ type: "CreateCreditNoteFailure", payload: err.response?.data || err.message });
        } else {
            dispatch({ type: "CreateCreditNoteFailure", payload: err.response?.data || err.message });
            toast.error(err.response?.data || err.message);
        }
    }
}

export const getCreditNoteDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "CreditNoteDetailsRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/credit-notes/read/${id}`, config);
        dispatch({ type: "CreditNoteDetailsSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "CreditNoteDetailsFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const getCreditNoteList = (page = 1, keyword = "") => async (dispatch) => {
    try {
        dispatch({ type: "CreditNoteListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/credit-notes/read-list/${page}?keyword=${keyword}`, config);
        dispatch({ type: "CreditNoteListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "CreditNoteListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const deleteCreditNote = (id) => async (dispatch) => {
    try {
        dispatch({ type: "CreditNoteDeleteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.delete(`${url}/private/client/credit-notes/delete/${id}`, config);
        dispatch({ type: "CreditNoteDeleteSuccess", payload: response.data });
        toast.success("CreditNote deleted successfully");
        dispatch(getCreditNoteList());
    } catch (error) {
        console.log(error);
        dispatch({ type: "CreditNoteDeleteFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const updateCreditNote = (id, data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreditNoteUpdateRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/credit-notes/update/${id}`, data, config);
        dispatch({ type: "CreditNoteUpdateSuccess", payload: response.data });
        navigate("/credit-note/view/" + id);
        toast.success("CreditNote updated successfully");
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
            dispatch({ type: "CreditNoteUpdateFailure", payload: err.response?.data || err.message });
        } else {
            dispatch({ type: "CreditNoteUpdateFailure", payload: err.response?.data || err.message });
            toast.error(err.response?.data || err.message);
        }
    }
}


export const markCreditNoteVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "CreditNoteMarkVoidRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/credit-notes/mark-void/${id}`, {}, config);
        dispatch({ type: "CreditNoteMarkVoidSuccess", payload: response.data });
        toast.success("Credit Note marked as void successfully");
        dispatch(getCreditNoteDetails(id));
    }
    catch (err) {
        console.log(err);
        dispatch({ type: "CreditNoteMarkVoidFailure", payload: err.response?.data || err.message });
        toast.error(err.response?.data || err.message);
    }
}

export const getNewCreditNoteNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewCreditNoteNumberRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/credit-notes/read-new-cn-number`, config);
        dispatch({ type: "GetNewCreditNoteNumberSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetNewCreditNoteNumberFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const downloadCreditNoteList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadCreditNoteListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: 'blob'
        };
        const response = await axios.get(`${url}/private/client/credit-notes/download`, config);
        const url2 = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url2;
        link.setAttribute('download', 'CreditNoteList.xlsx');
        document.body.appendChild(link);
        link.click();
        dispatch({ type: "DownloadCreditNoteListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "DownloadCreditNoteListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}



export const submitCreditNoteForApproval = (id) => async (dispatch) => {
    try {
        dispatch({ type: "SubmitCreditNoteForApprovalRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.put(`${url}/private/client/credit-notes/submit-for-approval/${id}`, {}, config);
        dispatch({ type: "SubmitCreditNoteForApprovalSuccess", payload: response.data });
        toast.success("Credit Note submitted for approval successfully");
        dispatch(getCreditNoteDetails(id));
    } catch (error) {
        console.log(error);
        dispatch({ type: "SubmitCreditNoteForApprovalFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}
