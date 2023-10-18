import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";
export const createEstimate = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateEstimateRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/estimates/create`, data, config);
        dispatch({ type: "CreateEstimateSuccess", payload: response.data });
        toast.success("Estimate created successfully");
        navigate("/estimate");
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
            dispatch({ type: "CreateEstimateFailure", payload: err.response?.data || err.message });
        } else {
            dispatch({ type: "CreateEstimateFailure", payload: err.response?.data || err.message });
            toast.error(err.response?.data || err.message);
        }
    }
}

export const getEstimateDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "EstimateDetailsRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/estimates/read/${id}`, config);
        dispatch({ type: "EstimateDetailsSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "EstimateDetailsFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const getEstimateList = (page = 1, keyword = "") => async (dispatch) => {
    try {
        dispatch({ type: "EstimateListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/estimates/read-list/${page}?keyword=${keyword}`, config);
        dispatch({ type: "EstimateListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "EstimateListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const deleteEstimate = (id) => async (dispatch) => {
    try {
        dispatch({ type: "EstimateDeleteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.delete(`${url}/private/client/estimates/delete/${id}`, config);
        dispatch({ type: "EstimateDeleteSuccess", payload: response.data });
        toast.success("Estimate deleted successfully");
        dispatch(getEstimateList());
    } catch (error) {
        console.log(error);
        dispatch({ type: "EstimateDeleteFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const updateEstimate = (id, data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "EstimateUpdateRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/estimates/update/${id}`, data, config);
        dispatch({ type: "EstimateUpdateSuccess", payload: response.data });
        navigate("/estimate/view/" + id);
        toast.success("Estimate updated successfully");
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
            dispatch({ type: "EstimateUpdateFailure", payload: err.response?.data || err.message });
        } else {
            dispatch({ type: "EstimateUpdateFailure", payload: err.response?.data || err.message });
            toast.error(err.response?.data || err.message);
        }
    }
}

export const markEstimateSent = (id) => async (dispatch) => {
    try {
        dispatch({ type: "EstimateMarkSentRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/estimates/mark-sent/${id}`, {}, config);
        dispatch({ type: "EstimateMarkSentSuccess", payload: response.data });
        toast.success("Estimate marked as sent successfully");
    }
    catch (err) {
        console.log(err);
        dispatch({ type: "EstimateMarkSentFailure", payload: err.response?.data || err.message });
        toast.error(err.response?.data || err.message);
    }
}

export const markEstimateVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "EstimateMarkVoidRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(`${url}/private/client/estimates/mark-void/${id}`, {}, config);
        dispatch({ type: "EstimateMarkVoidSuccess", payload: response.data });
        toast.success("Estimate marked as void successfully");
    }
    catch (err) {
        console.log(err);
        dispatch({ type: "EstimateMarkVoidFailure", payload: err.response?.data || err.message });
        toast.error(err.response?.data || err.message);
    }
}

export const getNewEstimateNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewEstimateNumberRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/estimates/read-new-estimate-number`, config);
        dispatch({ type: "GetNewEstimateNumberSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetNewEstimateNumberFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const downloadEstimateList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadEstimateListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: 'blob'
        };
        const response = await axios.get(`${url}/private/client/estimates/download`, config);
        const url2 = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url2;
        link.setAttribute('download', 'EstimateList.xlsx');
        document.body.appendChild(link);
        link.click();
        dispatch({ type: "DownloadEstimateListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "DownloadEstimateListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}
