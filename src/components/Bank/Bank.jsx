import { useEffect, useState } from 'react';
import "./Bank.css";

import bankMainImage from "../../assets/bank_main.png"
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrency, saveBankDetails } from '../../Actions/Onboarding';

const Bank = () => {
    const [bankName, setBankName] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [iban, steIban] = useState("");
    const [branchName, setBranchName] = useState("");
    const [currency, setCurrency] = useState("");
    const dispatch = useDispatch();
    const { currencies } = useSelector((state) => state.onboardingReducer);
    useEffect(() => {
        dispatch(getCurrency());
    }, [dispatch]);

    const handleBank = (e) => {
        e.preventDefault();
        if (bankName == "" || accountHolderName == "" || accountNumber == "" || iban == "" || branchName == "" || currency == "") {
            toast.error("Please fill all the fields");
            return;
        }
        const data = {
            bank_name: bankName,
            account_holder_name: accountHolderName,
            account_number: accountNumber,
            iban_number: iban,
            branch_name: branchName,
            currency_id: 1
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
                            <span>Bank Name</span>
                            <input type='text' placeholder='Bank Name' name='bankName' value={bankName} onChange={(e) => setBankName(e.target.value)} />
                        </div>
                        <div className='bank__form--input'>
                            <span>Account Holder Name</span>
                            <input type='text' placeholder='Account Holder Name' name='accountHolderName' value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
                        </div>
                        <div className='bank__form--input'>
                            <span>Account Name</span>
                            <input type='text' placeholder='Account Name' name='accountNumber' value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                        </div>
                        <div className='bank__form--input'>
                            <span>IBAN</span>
                            <input type='email' placeholder='IBAN' name='iban' value={iban} onChange={(e) => steIban(e.target.value)} />
                        </div>
                        <div className='bank__form--input'>
                            <span>Branch Name</span>
                            <input type='text' placeholder='Branch Name' name='branchName' value={branchName} onChange={(e) => setBranchName(e.target.value)} />
                        </div>
                        <div className='bank__form--input'>
                            <span>Currency</span>
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
                            <button type='submit'>Next</button>
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
