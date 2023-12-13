import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getBankDetails } from '../../../Actions/Bank';
import { getCurrency } from '../../../Actions/Onboarding';

import '../../../Styles/Read.css';
import backButton from "../../../assets/Icons/back.svg"

import Loader from '../../Loader/Loader';
import ViewHeader from '../../../Shared/ViewHeader/ViewHeader';
import ViewFooter from '../../../Shared/ViewFooter/ViewFooter';

const BankRead = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.userReducer);
    const { loading, bank } = useSelector(state => state.bankReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);

    const bank_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;

    const currency = {
        abv: currencies?.find(currency => currency.currency_id === bank?.currency_id)?.currency_abv,
        full: currencies?.find(currency => currency.currency_id === bank?.currency_id)?.currency_name,
        id: currencies?.find(currency => currency.currency_id === bank?.currency_id)?.currency_id,
    }

    useEffect(() => {
        dispatch(getCurrency());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getBankDetails(bank_id, user?.localInfo?.role));
    }, [dispatch, bank_id, user?.localInfo?.role, client_id]);

    return (
        <>
            <div className='read__header'>
                <div className='read__header--left'>
                    <img src={backButton} alt='back' className='read__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/bank"}`)} />
                    <h1 className='read__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Banks List'}
                    </h1>
                </div>
                <div className='read__header--right'>
                    <a className='read__header--btn1'
                        onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : ""}/bank/edit/${bank?.bank_id}`)}
                    >Edit
                    </a>
                </div>
            </div>
            <div className="read__container">
                {loading ? <Loader /> :
                    <div className="read--main" id="read--main">
                        <ViewHeader title={"Bank"} />
                        <form className='banking__form'>
                            <div className="create__banking--input">
                                <span>Bank Name</span>
                                <input value={bank?.bank_name} disabled />
                            </div>
                            <div className="create__banking--input">
                                <span>Account Holder Name</span>
                                <input value={bank?.account_holder_name} disabled />
                            </div>
                            <div className="create__banking--input">
                                <span>Account Number</span>
                                <input value={bank?.account_number} disabled />
                            </div>
                            <div className="create__banking--input">
                                <span>IBAN Number</span>
                                <input value={bank?.iban_number} disabled />
                            </div>
                            <div className="create__banking--input">
                                <span>Branch Name</span>
                                <input value={bank?.branch_name} disabled />
                            </div>
                            <div className="create__banking--input">
                                <span>Currency</span>
                                <input value={`${currency?.full} (${currency?.abv})`} disabled />
                            </div>
                        </form>
                        <ViewFooter />
                    </div>
                }
            </div>
        </>
    )
}

export default BankRead;
