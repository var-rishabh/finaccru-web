import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEstimateDetails } from '../../Actions/Estimate';
import { getCurrency, getTaxRate } from '../../Actions/Onboarding';
import Loader from '../Loader/Loader';

import './EstimateRead.css'
import backButton from "../../assets/Icons/back.svg"
import logo from "../../assets/Icons/cropped_logo.svg"

const EstimateReadLayout = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.userReducer);
    const estimate_id = window.location.pathname.split('/')[3];
    const { loading, estimate } = useSelector(state => state.estimateReducer);
    const { taxRates, taxRateLoading } = useSelector(state => state.onboardingReducer);
    const dispatch = useDispatch();

    const [itemTotal, setItemTotal] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getEstimateDetails(estimate_id));
    }, [dispatch]);

    useEffect(() => {
        const calculateTotalAmounts = () => {
            let subTotalAmount = 0;
            let discountAmount = 0;
            let taxAmount = 0;

            const calculateFinalAmount = estimate?.line_items?.map((item) => {
                const { qty, rate, discount, is_percentage_discount, tax_id } = item;
                let finalRate = 0;
                let overAllRate = 0;
                if (is_percentage_discount) {
                    finalRate = rate - (rate * discount / 100);
                    overAllRate = finalRate * qty;
                    discountAmount += (rate - finalRate) * qty;
                } else {
                    discountAmount += +discount;
                    overAllRate = rate * qty - discount;
                }
                subTotalAmount += rate * qty;
                let tax = 0;
                const taxItem = taxRates?.find((tr) => tr.tax_rate_id === tax_id);
                if (taxItem?.tax_percentage !== 0) {
                    tax = overAllRate * (taxItem?.tax_percentage / 100);
                    taxAmount += tax;
                }
                const finalAmount = parseFloat((overAllRate + tax).toFixed(2));
                return finalAmount;
            });

            setSubTotal(parseFloat(subTotalAmount.toFixed(2)));
            setDiscount(parseFloat(discountAmount.toFixed(2)));
            setTax(parseFloat(taxAmount.toFixed(2)));
            setTotal(parseFloat((subTotalAmount - discountAmount + taxAmount).toFixed(2)));

            return calculateFinalAmount;
        };

        const calculateTotalAmount = calculateTotalAmounts();
        setItemTotal(calculateTotalAmount);
    }, [estimate, taxRates]);

    // const handleDownload = () => {
    //     // Take the component with id "estimate__container" and convert to pdf
    //     const estimateContainer = document.getElementById("read__estimate--main");
    // }

    return (
        <>
            <div className='read__estimate__header'>
                <div className='read__estimate__header--left'>
                    <img src={backButton} alt='back' className='read__estimate__header--back-btn' onClick={() => navigate("/estimate")} />
                    <h1 className='read__estimate__header--title'> Estimates List </h1>
                </div>
                <div className='read__estimate__header--right'>
                    <a className='read__estimate__header--btn1' onClick={() => navigate(`/estimate/edit/${estimate?.estimate_id}`)}>Edit</a>
                    {/* <a className='read__estimate__header--btn1' onClick={handleDownload}>Download</a> */}
                    <a className='read__estimate__header--btn1'>Download</a>
                    <a className='read__estimate__header--btn2'>Share</a>
                </div>
            </div>
            <div className="read__estimate__container">
                {loading ? <Loader /> :
                    <div className="read__estimate--main" id="read__estimate--main">
                        <div className="read__estimate--top">
                            <img style={{ width: "9rem" }} src={logo} alt="logo" />
                            <h1 className='read__estimate--head'>Estimates</h1>
                        </div>
                        <div className='read__estimate--part1'>
                            <div className='read__estimate--part1-head'>
                                <div className='read__estimate--head-info1'>
                                    <h3>Estimate From</h3>
                                    <span>{user?.clientInfo?.company_data?.company_name}</span>
                                    <span>{user?.clientInfo?.company_data?.address_line_1}</span>
                                    <span>{user?.clientInfo?.company_data?.address_line_2}</span>
                                    <span>{user?.clientInfo?.company_data?.address_line_3}</span>
                                    <span>{user?.clientInfo?.company_data?.state + ', ' + user?.clientInfo?.company_data?.country}</span>
                                    <span>TRN: {user?.clientInfo?.company_data?.trade_license_number}</span>
                                </div>
                                <div className='read__estimate--head-info2'>
                                    <div className='read__estimate--head-info2-data'>
                                        <span>Estimate Number</span>
                                        <p>
                                            {estimate?.estimate_number}
                                        </p>
                                    </div>
                                    <div className='read__estimate--head-info2-data'>
                                        <span>Estimate Date</span>
                                        <p>{estimate?.estimate_date}</p>
                                    </div>
                                    <div className='read__estimate--head-info2-data'>
                                        <span>Valid Till</span>
                                        <p>{estimate?.valid_till}</p>
                                    </div>
                                    <div className='read__estimate--head-info2-data'>
                                        {
                                            estimate?.reference ?
                                                <>
                                                    <span>Reference</span>
                                                    <p>{estimate?.reference}</p>
                                                </>
                                                : ""
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='read__estimate--part2-head'>
                                <h3>Estimate For</h3>
                                <div className='read__estimate--customer-data'>
                                    <span>{estimate?.customer?.customer_name}</span>
                                    <span>{estimate?.customer?.shipping_address_line_1}</span>
                                    <span>{estimate?.customer?.shipping_address_line_2}</span>
                                    <span>{estimate?.customer?.shipping_address_line_3}</span>
                                    <span>{estimate?.customer?.shipping_state + ', ' + estimate?.customer?.shipping_country}</span>
                                    <span>TRN: {estimate?.customer?.trn}</span>
                                </div>
                            </div>
                            <div className='read__estimate--part2-head'>
                                <h3> Currency</h3>
                                <div className='read__estimate--currency'>
                                    <div className='read__estimate--select-currency'>
                                        <p>{currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv}</p>
                                    </div>
                                    <div className='read__estimate--currency-conversion'>
                                        <span>1</span>
                                        <span>{currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv} =</span>
                                        <p>{estimate?.currency_conversion_rate}</p>
                                        <span>AED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='read__estimate__items'>
                            {estimate?.line_items?.map((item, index) => (
                                <div className='read__estimate__items--main' key={index}>
                                    <div className='read__estimate__items--whole-item'>
                                        <div className='read__estimate__items--itemName'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Item Name</span> : <></>}
                                            <p>{item?.item_name}</p>
                                        </div>
                                        <div className='read__estimate__items--unitSelect'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem' }}>Unit</span> : <></>}
                                            <p>{item?.unit}</p>
                                        </div>
                                        <div className='read__estimate__items--number-item qty'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Qty</span> : <></>}
                                            <p>{item?.qty}</p>
                                        </div>
                                        <div className='read__estimate__items--number-item rate'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Rate</span> : <></>}
                                            <p>{item?.rate}</p>
                                        </div>
                                        <div className='read__estimate__items--discount'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Discount</span> : <></>}
                                            <p>
                                                <span>{item?.discount}</span>
                                                <span className='discount__symbol'>
                                                    {item?.is_percentage_discount ? '%' : '$'}
                                                </span>
                                            </p>
                                        </div>
                                        <div className='read__estimate__items--tax'>
                                            {index === 0 ? <span style={{ marginBottom: '0.9rem' }}>Tax</span> : <></>}
                                            <p>{
                                                taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name
                                            }</p>
                                        </div>
                                        <div className='read__estimate__items--amount'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem' }}>Amount</span> : <></>}
                                            <p>{itemTotal && itemTotal[index]}</p>
                                        </div>
                                    </div>
                                    <div className='read__estimate__items--description'>
                                        {item?.description ? (
                                            <div className='read__estimate--desc__box'>
                                                <span>Description</span>
                                                <p>{item?.description}</p>
                                            </div>
                                        ) : <></>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='read__estimate--details'>
                            <div className='read__estimate--details--bank'>
                                <div className='estimte--details--bank-heading'>Bank Details</div>
                                <div className='read__estimate--details--split'>
                                    <div className='read__estimate--details-left'>
                                        <div className='read__estimate--details-left-head'>
                                            <span>Bank Name</span>
                                            <span>Account Number</span>
                                            <span>Account Name</span>
                                            <span>IBAN (AED Acc)</span>
                                            <span>IBAN (USD Acc)</span>
                                        </div>
                                        <div className='read__estimate--details-left-info'>
                                            <span>{user?.clientInfo?.primary_bank?.bank_name}</span>
                                            <span>{user?.clientInfo?.primary_bank?.account_number}</span>
                                            <span>{user?.clientInfo?.primary_bank?.account_holder_name}</span>
                                            <span>{user?.clientInfo?.primary_bank?.iban_number}</span>
                                            <span>{user?.clientInfo?.primary_bank?.iban_number}</span>
                                        </div>
                                    </div>
                                    <div className='read__estimate--details-right'>
                                        <div className='read__estimate--details-right-head'>
                                            <span>Sub Total</span>
                                            <span>Discount</span>
                                            <span>Tax</span>
                                            <span>Total</span>
                                        </div>
                                        <div className='read__estimate--details-right-info'>
                                            <span>{subTotal}</span>
                                            <span>{discount}</span>
                                            <span>{tax}</span>
                                            <span>{total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="read__estimate__footer">
                            <img style={{ width: "5rem" }} src={logo} alt="logo" />
                            <div className='read__estimate__footer--text'>
                                <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                                <span style={{ marginTop: "0.8rem", fontWeight: "700", fontSize: "0.8rem" }}> powered by Finaccru </span>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default EstimateReadLayout; 