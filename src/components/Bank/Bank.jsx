import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import "./Bank.css";

import bankMainImage from "../../assets/bank_main.png"
import { getCurrency, saveBankDetails } from '../../Actions/Onboarding';
import { LoadingOutlined } from '@ant-design/icons';

const Bank = () => {
    const [bankName, setBankName] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [iban, steIban] = useState("");
    const [branchName, setBranchName] = useState("");
    const [currency, setCurrency] = useState(0);
    const [isACNError, setIsACNError] = useState(false);
    const [isIbanError, setIsIbanError] = useState(false);

    const dispatch = useDispatch();
    const { currencies, loading } = useSelector((state) => state.onboardingReducer);
    useEffect(() => {
        dispatch(getCurrency());
    }, [dispatch]);

    const handleBank = (e) => {
        e.preventDefault();
        if (bankName == "" || accountHolderName == "" || accountNumber == "" || iban == "" || branchName == "" || currency == 0) {
            toast.error("Please fill all the fields correctly.");
            return;
        }
        if (isACNError) {
            toast.error("Account number should be a number and less than 20 characters.");
            return;
        }
        if (isIbanError) {
            toast.error("IBAN number should contain 23 characters.");
            return;
        }
        const data = {
            bank_name: bankName,
            account_holder_name: accountHolderName,
            account_number: accountNumber,
            iban_number: iban,
            branch_name: branchName,
            currency_id: currency
        }
        dispatch(saveBankDetails(data));
    }
    return (
        <div className="bank__main">
            <div className='bank__form--left'>
                <div className="bank__heading">
                    <p>
                        Fill details for your primary bank account
                    </p>
                </div>
                <div className="bank__form__data">
                    <form className='bank__form' onSubmit={handleBank}>
                        <div className='bank__form--input'>
                            <span className='required__field'>Bank Name</span>
                            <input type='text' placeholder='Bank Name' name='bankName' value={bankName} onChange={(e) => setBankName(e.target.value)} />
                        </div>
                        <div className='bank__form--input'>
                            <span className='required__field'>Account Holder Name</span>
                            <input type='text' placeholder='Account Holder Name' name='accountHolderName' value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
                        </div>
                        <div className='bank__form--input'>
                            <span className='required__field'>Account Number</span>
                            <input type='text' placeholder='Account Number' name='accountNumber' value={accountNumber}
                                onChange={(e) => {
                                    const valid = e.target.value.match(/^\d{1,20}$/);
                                    setAccountNumber(e.target.value)
                                    if (valid) {
                                        setIsACNError(false);
                                    } else {
                                        setIsACNError(true);
                                    }
                                }}
                            />
                            <p style={{ fontSize: "0.8rem", margin: "0.2rem 0 0 0.1rem" }} className="phone__error--span">
                                {isACNError ? "It should be less than 20 characters." : ""}
                            </p>
                        </div>
                        <div className='bank__form--input'>
                            <span className='required__field'>IBAN</span>
                            <input type='text' maxLength={23} placeholder='IBAN' name='iban' value={iban}
                                onChange={(e) => {
                                    const valid = e.target.value.match(/^.{23}$/);
                                    steIban(e.target.value)
                                    if (valid) {
                                        setIsIbanError(false);
                                    } else {
                                        setIsIbanError(true);
                                    }
                                }}
                            />
                            {/* <p style={{ fontSize: "0.8rem", margin: "0.2rem 0 0 0.1rem" }} className="phone__error--span">
                                {isIbanError ? "It should be of exact 23 characters." : ""}
                            </p> */}
                        </div>
                        <div className='bank__form--input'>
                            <span className='required__field'>Branch Name</span>
                            <input type='text' placeholder='Branch Name' name='branchName' value={branchName} onChange={(e) => setBranchName(e.target.value)} />
                        </div>
                        <div className='bank__form--input'>
                            <span className='required__field'>Currency</span>
                            <select className="company__select" id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                <option value="">Select currency</option>
                                {currencies ? currencies.map((currency) => (
                                    <option key={currency.currency_id} value={currency.currency_id}>
                                        {currency.currency_name} ({currency.currency_abv})
                                    </option>))
                                    :
                                    <option key="" value="">
                                        Not Available
                                    </option>
                                }
                            </select>
                        </div>
                        <div className='bank__form--button'>
                            <button type='submit'>
                                {
                                    loading ? <LoadingOutlined /> : "Next"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='bank__form--right'>
                <img src={bankMainImage} alt='bank' />
            </div>
        </div>
    )
}

export default Bank;
