import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { getCurrency } from '../../../Actions/Onboarding';
import { createBank, getBankDetails, updateBank } from '../../../Actions/Bank';

import "./BankLayout.css";
import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";

import { Select } from "antd";
import backButton from "../../../assets/Icons/back.svg";
import logo from "../../../assets/Icons/cropped_logo.svg";

const BankLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [bankName, setBankName] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [branchName, setBranchName] = useState("");
    const [iban, steIban] = useState("");

    const [currencyId, setCurrencyId] = useState(1);
    const [currency, setCurrency] = useState('AED');

    const isAdd = window.location.pathname.split('/')[2] === 'create';

    const { loading: bankLoading, bank } = useSelector(state => state.bankReducer);
    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);

    useEffect(() => {
        dispatch(getCurrency());
    }, [dispatch]);

    const onChangeCurrency = (value) => {
        setCurrencyId(value);
        const currency = currencies.find((currency) => currency.currency_id === value);
        setCurrency(currency.currency_abv);
    }

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getBankDetails(window.location.pathname.split('/')[3]));
        }
    }, [dispatch]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            if (bank) {
                setBankName(bank?.bank_name);
                setAccountHolderName(bank?.account_holder_name);
                setAccountNumber(bank?.account_number);
                setBranchName(bank?.branch_name);
                steIban(bank?.iban_number);
                setCurrencyId(bank?.currency_id);
            }
        }
    }, [dispatch, currencies, bank]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (bankLoading) {
            return;
        }
        if (bankName === "" || accountHolderName === "" || accountNumber === "" || branchName === "") {
            toast.error("Please fill all the fields correctly.");
            return;
        }
        if (iban.length !== 23) {
            toast.error("IBAN number should contain 23 characters.");
            return;
        }
        console.log(currencyId);
        const data = {
            bank_name: bankName,
            account_holder_name: accountHolderName,
            account_number: accountNumber,
            iban_number: iban,
            branch_name: branchName,
            currency_id: currencyId
        }
        console.log(data);
        if (isAdd) {
            dispatch(createBank(data, null, navigate));
        } else {
            dispatch(updateBank(data, window.location.pathname.split('/')[3], null, navigate));
        }
    }
    return (
        <>
            <div className='layout__header'>
                <div className='layout__header--left'>
                    <img src={backButton} alt='back' className='layout__header--back-btn' onClick={() => navigate("/bank")} />
                    <h1 className='layout__header--title'> Banks List </h1>
                </div>
            </div>
            <div className="layout__container">
                <div className="create__layout--main">
                    <div className="create__layout--top">
                        <img style={{ width: "9rem" }} src={logo} alt="logo" />
                        <h1 className='create__payment--head'> Bank </h1>
                    </div>
                    <form className='banking__form'>
                        <div className="create__banking--input">
                            <span className='required__field'>Bank Name</span>
                            <input type='text' placeholder='Bank Name'
                                name='bankName' value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                            />
                        </div>
                        <div className="create__banking--input">
                            <span className='required__field'>Account Holder Name</span>
                            <input type='text' placeholder='Account Holder Name'
                                name='accountHolderName' value={accountHolderName}
                                onChange={(e) => setAccountHolderName(e.target.value)}
                            />
                        </div>
                        <div className="create__banking--input">
                            <span className='required__field'>Account Number</span>
                            <input type='text' placeholder='Account Number'
                                name='accountNumber'
                                maxLength={20} value={accountNumber}
                                onChange={(e) => {
                                    const number = e.target.value;
                                    const numericPhoneNumber = number.replace(/\D/g, '');
                                    setAccountNumber(numericPhoneNumber)
                                }}
                            />
                        </div>
                        <div className="create__banking--input">
                            <span className='required__field'>IBAN Number</span>
                            <input type='text' placeholder='IBAN Number'
                                name='iban'
                                maxLength={23} value={iban}
                                onChange={(e) => {
                                    const number = e.target.value;
                                    const numericPhoneNumber = number.replace(/\D/g, '');
                                    steIban(numericPhoneNumber)
                                }}
                            />
                        </div>
                        <div className="create__banking--input">
                            <span className='required__field'>Branch Name</span>
                            <input type='text' placeholder='Branch Name'
                                name='branchName' value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                            />
                        </div>
                        <div className="create__banking--select">
                            <span className='required__field'>Currency</span>
                            <Select
                                loading={currencyLoading}
                                placeholder="Select Currency"
                                value={currencyId}
                                onChange={onChangeCurrency}
                                options={
                                    currencies?.map((currency) => {
                                        return {
                                            label: `${currency.currency_name} (${currency.currency_abv})`,
                                            value: currency.currency_id
                                        }
                                    })
                                }
                            />
                        </div>
                        <div className='banking__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}> Submit </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default BankLayout;
