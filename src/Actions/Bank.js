import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";

export const getBankList = (page = 1, keyword = "") => async (dispatch) => {
    try {
        dispatch({ type: "BankListRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/banks/read-list/${page}?keyword=${keyword}`, config);
        dispatch({ type: "BankListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "BankListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const createBank = (data, handleBankSubmit, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateBankRequest" });
        console.log(data);
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/banks/create`, data, config);
        dispatch({ type: "CreateBankSuccess", payload: response.data });
        toast.success("Bank created successfully");
        if (handleBankSubmit) {
            handleBankSubmit(response.data);
        }
        dispatch(getBankList());
        navigate("/bank");
    } catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((error) => {
                toast.error(error.loc[1] + ": " + error.msg);
            });
            dispatch({ type: "CreateBankFailure", payload: error.response?.data || error.message });
        } else {

            dispatch({ type: "CreateBankFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const updateBank = (data, id, handleBankSubmit, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "UpdateBankRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.put(`${url}/private/client/banks/update/${id}`, data, config);
        dispatch({ type: "UpdateBankSuccess", payload: data });
        toast.success("Bank updated successfully");
        if (handleBankSubmit) {
            handleBankSubmit(data);
        } else {
            navigate("/bank/view/" + id);
        }
    }
    catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((error) => {
                toast.error(error.loc[1] + ": " + error.msg);
            });
            dispatch({ type: "UpdateBankFailure", payload: error.response?.data || error.message });
        } else {
            dispatch({ type: "UpdateBankFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const getBankDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "BankDetailsRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/banks/read/${id}`, config);
        dispatch({ type: "BankDetailsSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "BankDetailsFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const deleteBank = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteBankRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.delete(`${url}/private/client/banks/delete/${id}`, config);
        dispatch({ type: "DeleteBankSuccess", payload: id });
        dispatch(getBankList());
        toast.success("Bank deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ type: "DeleteBankFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const downloadBankList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadBankListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: 'blob'
        };
        const response = await axios.get(`${url}/private/client/banks/download`, config);
        const url2 = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url2;
        link.setAttribute('download', 'BankList.xlsx');
        document.body.appendChild(link);
        link.click();
        dispatch({ type: "DownloadBankListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "DownloadBankListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}