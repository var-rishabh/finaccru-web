import EstimateFormP1 from './EstimateFormP1';
import EstimateFormP2 from './EstimateFormP2';
import { useNavigate } from 'react-router-dom';
import { createEstimate, getEstimateDetails, getNewEstimateNumber, updateEstimate } from '../../Actions/Estimate';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCurrency } from '../../Actions/Onboarding';
import { getDate } from '../../utils/date';
import { toast } from 'react-toastify';

import "./EstimateLayout.css"
import { LoadingOutlined } from '@ant-design/icons';
import backButton from "../../assets/Icons/back.svg"
import logo from "../../assets/Icons/cropped_logo.svg"
import { getCustomerDetails } from '../../Actions/Customer';

const EstimateLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [estimateNumber, setEstimateNumber] = useState('');
    const [estimateDate, setEstimateDate] = useState(getDate());
    const [validTill, setValidTill] = useState(getDate());
    const [reference, setReference] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyConversionRate, setCurrencyConversionRate] = useState(1);
    const [items, setItems] = useState([{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
    const [currency, setCurrency] = useState('AED');
    const isAdd = window.location.pathname.split('/')[2] === 'create';
    const { loading: estimateLoading, estimate, number } = useSelector(state => state.estimateReducer);
    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getCurrency());
            dispatch(getEstimateDetails(window.location.pathname.split('/')[3]));
            // estimate?.customer?.customer_id
        }
        if (window.location.pathname.split('/')[2] === 'create') {
            dispatch(getCurrency());
            dispatch(getNewEstimateNumber());

        }
    }, [dispatch]);
    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getCustomerDetails(estimate?.customer?.customer_id));
        }
    }, [dispatch, estimate?.customer?.customer_id]);
    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            setEstimateNumber(estimate?.estimate_number);
            setEstimateDate(estimate?.estimate_date);
            setValidTill(estimate?.valid_till);
            setReference(estimate?.reference);
            setCustomerName(estimate?.customer?.customer_name);
            setCustomerId(estimate?.customer?.customer_id);
            setCurrencyId(estimate?.currency_id);
            setCurrencyConversionRate(estimate?.currency_conversion_rate);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv : 'AED');
            setItems(estimate?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
        }
        if (window.location.pathname.split('/')[2] === 'create') {
            setEstimateNumber(number);
        }
    }, [currencies, estimate, number]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (estimateLoading) {
            return;
        }
        if (estimateNumber == "" || customerId == null || currencyConversionRate <= 0) {
            toast.error("Please fill and check all fields.");
            return;
        }
        if (items.some((item) => item.item_name === '')) {
            toast.error("Item name cannot be empty.");
            return;
        }
        if (items.some((item) => item.unit === '')) {
            toast.error("Unit cannot be empty.");
            return;
        }
        if (items.some((item) => item.qty <= 0)) {
            toast.error("Quantity should be greater than 0.");
            return;
        }
        if (items.some((item) => item.rate <= 0)) {
            toast.error("Rate should be greater than 0.");
            return;
        }
        if (items.some((item) => item.discount < 0)) {
            toast.error("Discount should be greater than or equal to 0.");
            return;
        }
        const data = {
            customer_id: customerId,
            estimate_number: estimateNumber,
            estimate_date: estimateDate,
            valid_till: validTill,
            reference: reference,
            currency_id: currencyId,
            currency_conversion_rate: currencyConversionRate,
            line_items: items,
        }
        if (isAdd) {
            dispatch(createEstimate(data, navigate));
        }
        else {
            dispatch(updateEstimate(window.location.pathname.split('/')[3], data, navigate));
        }
    }
    return (
        <>
            <div className='create__estimate__header'>
                <div className='create__estimate__header--left'>
                    <img src={backButton} alt='back' className='create__estimate__header--back-btn' onClick={() => navigate("/estimate")} />
                    <h1 className='create__estimate__header--title'> Estimates List </h1>
                </div>
                <div className='create__estimate__header--right'>
                    <a className='create__estimate__header--btn1'>Download</a>
                    <a className='create__estimate__header--btn2'>Share</a>
                </div>
            </div>
            <div className="estimate__container">
                <div className="create__estimate--main">
                    <div className="create__estimate--top">
                        <img style={{ width: "9rem" }} src={logo} alt="logo" />
                        <h1 className='create__estimate--head'>Estimate</h1>
                    </div>
                    <form>
                        <EstimateFormP1 estimateNumber={estimateNumber} setEstimateNumber={setEstimateNumber}
                            estimateDate={estimateDate} setEstimateDate={setEstimateDate} validTill={validTill} setValidTill={setValidTill}
                            reference={reference} setReference={setReference}
                            customerName={customerName} setCustomerName={setCustomerName}
                            customerId={customerId} setCustomerId={setCustomerId}
                            currency={currency} setCurrency={setCurrency} currencyId={currencyId} setCurrencyId={setCurrencyId}
                            currencyConversionRate={currencyConversionRate} setCurrencyConversionRate={setCurrencyConversionRate}
                        />
                        <EstimateFormP2 items={items} setItems={setItems} currency={currency} />
                        <div className='estimate__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {
                                    estimateLoading ? <LoadingOutlined /> : "Submit"
                                }
                            </button>
                        </div>
                    </form>
                    <div className="estimate__footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='estimate__footer--text'>
                            <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                            <span style={{ marginTop: "0.8rem", fontWeight: "700", fontSize: "0.8rem" }}> powered by Finaccru </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EstimateLayout; 