import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";
import { onAuthStateChanged } from 'firebase/auth';


export const saveCompanyDetails = (data) => async (dispatch) => {
    try {
        dispatch({ type: "CompanyDetailsRequest" });
        await onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                const config = {
                    headers: {
                        token: token,
                    },
                };
                const response = await axios.post(`${url}/private/client/onboarding/save-company-details`, data, config);
                dispatch({ type: "CompanyDetailsSuccess", payload: response.data });
                dispatch({ type: "LoadUserRequest" });
                window.location.href = "/onboard/bank";
                toast.success("Company Details Saved Successfully");
            }
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: "CompanyDetailsFailure", payload: error.response?.data.message || error.message });
        toast.error(error.response?.data.message || error.message);
    }
};

export const saveBankDetails = (data) => async (dispatch) => {
    try {
        dispatch({ type: "BankDetailsRequest" });
        await onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                const config = {
                    headers: {
                        token: token,
                    },
                };
                const response = await axios.post(`${url}/private/client/onboarding/save-primary-bank-details`, data, config);
                dispatch({ type: "BankDetailsSuccess", payload: response.data });
                window.location.href = "/onboard/upload";
                toast.success("Bank Details Saved Successfully");
                dispatch({ type: "LoadUserRequest" });
            }
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: "BankDetailsFailure", payload: error.response?.data.message || error.message });
        toast.error(error.response?.data.message || error.message);
    }
}

export const uploadDocuments = (data) => async (dispatch) => {
    try {
        dispatch({ type: "UploadDocumentsRequest" });
        await onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                const config = {
                    headers: {
                        token: token,
                    },
                };
                const form = new FormData();
                form.append("trade_license_file", data.trade_license_file);
                form.append("moa_file", data.moa_file);
                form.append("emirates_id_file", data.emirates_id_file);
                form.append("passport_file", data.passport_file);
                if (data.vat_file) {
                    form.append("vat_file", data.vat_file);
                }
                const response = await axios.post(`${url}/private/client/onboarding/save-documents`, form , config);
                toast.success("Documents Uploaded Successfully! Redirecting to Home Page");
                window.location.href = "/";
                dispatch({ type: "UploadDocumentsSuccess", payload: response.data });
                dispatch({ type: "LoadUserRequest" });
            }
        });

    } catch (error) {
        console.log(error);
        dispatch({ type: "UploadDocumentsFaliure", payload: error.response?.data.message || error.message });
        toast.error(error.response?.data.message || error.message);
    }
}    

export const getCompanyType = () => async (dispatch) => {
    try {
        dispatch({ type: "GetCompanyTypeRequest" });
        await onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                const config = {
                    headers: {
                        token: token,
                    },
                };
                const response = await axios.get(`${url}/private/read-company-types`, config);
                dispatch({ type: "GetCompanyTypeSuccess", payload: response.data });
            }
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetCompanyTypeFailure", payload: error.response?.data.message || error.message });
    }
}

export const getIndustry = () => async (dispatch) => {
    try {
        dispatch({ type: "GetIndustryRequest" });
        await onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                const config = {
                    headers: {
                        token: token,
                    },
                };
                const response = await axios.get(`${url}/private/read-box/industry`, config);
                dispatch({ type: "GetIndustrySuccess", payload: response.data });
            }
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetIndustryFailure", payload: error.response?.data.message || error.message });
    }
}

export const getCurrency = () => async (dispatch) => {
    try {
        dispatch({ type: "GetCurrencyRequest" });
        await onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                const config = {
                    headers: {
                        token: token,
                    },
                };
                const response = await axios.get(`${url}/private/read-currencies`, config);
                dispatch({ type: "GetCurrencySuccess", payload: response.data });
            }
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetCurrencyFailure", payload: error.response?.data.message || error.message });
    }
}


