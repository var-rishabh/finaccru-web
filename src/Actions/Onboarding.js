import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";


export const saveCompanyDetails = (data) => async (dispatch) => {
    try {
        dispatch({ type: "CompanyDetailsRequest" });
        const token = await auth.currentUser.getIdToken();
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
    } catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({ type: "CompanyDetailsFailure", payload: error.response?.data || error.message });
        } else {

            dispatch({ type: "CompanyDetailsFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
};

export const saveBankDetails = (data) => async (dispatch) => {
    try {
        dispatch({ type: "BankDetailsRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/onboarding/save-primary-bank-details`, data, config);
        dispatch({ type: "BankDetailsSuccess", payload: response.data });
        dispatch({ type: "LoadUserRequest" });
        window.location.href = "/onboard/upload";
        toast.success("Bank Details Saved Successfully");
    } catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({ type: "BankDetailsFailure", payload: error.response?.data || error.message });
        } else {

            dispatch({ type: "BankDetailsFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const uploadDocuments = (data) => async (dispatch) => {
    try {
        dispatch({ type: "UploadDocumentsRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
                type: "multipart/form-data",
            },
        };
        const form = new FormData();
        form.append("logo_file", data.logo_file);
        form.append("trade_license_file", data.trade_license_file);
        form.append("moa_file", data.moa_file);
        form.append("emirates_id_file", data.emirates_id_file);
        form.append("passport_file", data.passport_file);
        if (data.corporate_tax_certificate_file) {
            form.append("corporate_tax_certificate_file", data.corporate_tax_certificate_file);
        }
        if (data.vat_file) {
            form.append("vat_file", data.vat_file);
        }
        const response = await axios.post(`${url}/private/client/onboarding/save-documents`, form, config);
        toast.success("Documents Uploaded Successfully! Redirecting to Home Page");
        dispatch({ type: "LoadUserRequest" })
        window.location.href = "/";
        dispatch({ type: "UploadDocumentsSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({ type: "UploadDocumentsFaliure", payload: error.response?.data || error.message });
        } else {
            dispatch({ type: "UploadDocumentsFaliure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const getCompanyType = () => async (dispatch) => {
    try {
        dispatch({ type: "GetCompanyTypeRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/read-company-types`, config);
        dispatch({ type: "GetCompanyTypeSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetCompanyTypeFailure", payload: error.response?.data || error.message });
    }
}

export const getIndustry = () => async (dispatch) => {
    try {
        dispatch({ type: "GetIndustryRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/read-box/industry`, config);
        dispatch({ type: "GetIndustrySuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetIndustryFailure", payload: error.response?.data || error.message });
    }
}

export const getCurrency = () => async (dispatch) => {
    try {
        dispatch({ type: "GetCurrencyRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/read-currencies`, config);
        dispatch({ type: "GetCurrencySuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetCurrencyFailure", payload: error.response?.data || error.message });
    }
}

export const getTaxRate = () => async (dispatch) => {
    try {
        dispatch({ type: "GetTaxRateRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/read-tax-rates`, config);
        dispatch({ type: "GetTaxRateSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetTaxRateFailure", payload: error.response?.data || error.message });
    }
}
