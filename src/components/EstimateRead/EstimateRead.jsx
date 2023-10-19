import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEstimateDetails, markEstimateSent, markEstimateVoid } from '../../Actions/Estimate';
import { getCurrency, getTaxRate } from '../../Actions/Onboarding';
import Loader from '../Loader/Loader';

import './EstimateRead.css'
import backButton from "../../assets/Icons/back.svg"
import logo from "../../assets/Icons/cropped_logo.svg"
// import PdfDownload from '../PdfDownload/PdfDownload';

const EstimateReadLayout = () => {
    const handleDownload = () => {
    }

    const navigate = useNavigate();
    const { user } = useSelector(state => state.userReducer);
    const estimate_id = window.location.pathname.split('/')[3];
    const { loading, estimate } = useSelector(state => state.estimateReducer);
    const { taxRates, taxRateLoading } = useSelector(state => state.onboardingReducer);
    const dispatch = useDispatch();

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);

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
            const calculatedTax = [];

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
                calculatedTax.push(parseFloat(tax.toFixed(2)));

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

    // const groupedByTaxId = taxRates.map((taxRate) => ({
    //     tax_id: taxRate.tax_rate_id,
    //     tax_rate_name: taxRate.tax_rate_name,
    //     totalTaxAmount: itemTotal && itemTotal?.reduce((acc, curr, idx) => estimate?.line_items[idx].tax_id === taxRate.tax_rate_id ? acc + curr : acc, 0),
    // }));

    return (
        <>
            <div className='read__estimate__header'>
                <div className='read__estimate__header--left'>
                    <img src={backButton} alt='back' className='read__estimate__header--back-btn' onClick={() => navigate("/estimate")} />
                    <h1 className='read__estimate__header--title'> Estimates List </h1>
                </div>
                <div className='read__estimate__header--right'>
                    {
                        estimate?.estimate_status === "Draft" ? <>
                            <a className='create__estimate__header--btn1'
                                onClick={() => {
                                    dispatch(markEstimateSent(window.location.pathname.split('/')[3]))
                                }}
                            >Mark as Sent</a>
                        </> : estimate?.estimate_status === "Sent" ? <>
                            <a className='create__estimate__header--btn1'
                                onClick={() => {
                                    dispatch(markEstimateVoid(window.location.pathname.split('/')[3]))
                                }}
                            >Mark as Void</a>
                        </> : ""
                    }
                    <a className='read__estimate__header--btn1' onClick={() => navigate(`/estimate/edit/${estimate?.estimate_id}`)}>Edit</a>
                    <a className='read__estimate__header--btn2' onClick={handleDownload}>Download</a>
                </div>
            </div>
            <div className="read__estimate__container">
                {loading ? <Loader /> :
                    <div className="read__estimate--main" id="read__estimate--main">
                        <div className="read__estimate--top">
                            <img style={{ width: "9rem" }} src={logo} alt="logo" />
                            <h1 className='read__estimate--head'>Estimate</h1>
                        </div>
                        <div className='read__estimate--part1'>
                            <div className='read__estimate--part1-head'>
                                <div className='read__estimate--head-info1'>
                                    <h3>Estimate From</h3>
                                    <span style={{ fontWeight: 500 }}>{user?.clientInfo?.company_data?.company_name}</span>
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
                                <div className='read__estimate--part2-left'>
                                    <h3>Estimate For</h3>
                                    <div className='read__estimate--customer-data'>
                                        <span style={{ fontWeight: 500 }}>{estimate?.customer?.customer_name}</span>
                                        <span>{estimate?.customer?.billing_address_line_1}</span>
                                        {estimate?.customer?.billing_address_line_2 && <span>{estimate?.customer?.billing_address_line_2}</span>}
                                        {estimate?.customer?.billing_address_line_3 && <span>{estimate?.customer?.billing_address_line_3}</span>}
                                        <span>{estimate?.customer?.billing_state + ', ' + estimate?.customer?.billing_country}</span>
                                        {estimate?.customer?.trn && <span>TRN: {estimate?.customer?.trn}</span>}
                                    </div>
                                </div>
                                <div className='read__estimate--part2-right'>
                                    <h3>Shipping Address</h3>
                                    <div className='read__estimate--customer-data'>
                                        {estimate?.customer?.shipping_address_lable && <span>{estimate?.customer?.shipping_address_label}</span>}
                                        <span>{estimate?.customer?.shipping_address_line_1}</span>
                                        {estimate?.customer?.shipping_address_line_2 && <span>{estimate?.customer?.shipping_address_line_2}</span>}
                                        {estimate?.customer?.shipping_address_line_3 && <span>{estimate?.customer?.shipping_address_line_3}</span>}
                                        <span>{estimate?.customer?.shipping_state + ', ' + estimate?.customer?.shipping_country}</span>
                                        {estimate?.customer?.trn && <span>TRN: {estimate?.customer?.trn}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className='read__estimate--part3-head'>
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
                            <div className='read__estimate--part4-head'>
                                {
                                    estimate?.subject ?
                                        <>
                                            <h3>Subject</h3>
                                            <p>{estimate?.subject}</p>
                                        </>
                                        : ""
                                }
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
                                            {/* {index === 0 ? <span style={{ marginBottom: '0.9rem' }}>Tax</span> : <></>}
                                            <p>
                                                <span>{itemTax && itemTax[index]}</span>
                                                <span className='tax__rate__names'>
                                                    {taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                                </span>
                                            </p> */}
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
                                        <div className='read__estimate--details-main'>
                                            <div className='read__estimate--details-left-head'>
                                                <span>Bank Name</span>
                                                <span>Account Number</span>
                                                <span>Account Name</span>
                                                <span>IBAN ({currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv} Acc)</span>
                                            </div>
                                            <div className='read__estimate--details-left-info'>
                                                <span>{user?.clientInfo?.primary_bank?.bank_name}</span>
                                                <span>{user?.clientInfo?.primary_bank?.account_number}</span>
                                                <span>{user?.clientInfo?.primary_bank?.account_holder_name}</span>
                                                <span>{user?.clientInfo?.primary_bank?.iban_number}</span>
                                            </div>
                                        </div>
                                        {
                                            user?.clientInfo?.bank_accounts.map((bank, index) => (
                                                <div className='read__estimate--details-main' key={index}>
                                                    <div className='read__estimate--details-left-head'>
                                                        <span>Bank Name</span>
                                                        <span>Account Number</span>
                                                        <span>Account Name</span>
                                                        <span>IBAN ({bank?.currency_abv} Acc)</span>
                                                    </div>
                                                    <div className='read__estimate--details-left-info' key={index}>
                                                        <span>{bank?.bank_name}</span>
                                                        <span>{bank?.account_number}</span>
                                                        <span>{bank?.account_holder_name}</span>
                                                        <span>{bank?.iban_number}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className='read__estimate--details-right'>
                                        <div className='read__estimate--details-right-head'>
                                            <span>Sub Total</span>
                                            <span>Discount</span>
                                            <span>Tax</span>
                                            <span>Total</span>
                                        </div>
                                        <div className='read__estimate--details-right-info'>
                                            <span><p style={{ fontWeight: 500 }}>{currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv}</p> &nbsp; {subTotal}</span>
                                            <span><p style={{ fontWeight: 500 }}>{currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv}</p> &nbsp; {discount}</span>
                                            <span><p style={{ fontWeight: 500 }}>{currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv}</p> &nbsp; {tax}</span>
                                            <span><p style={{ fontWeight: 500 }}>{currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv}</p> &nbsp; {total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='read__estimate--details-bottom'>
                            <div className='read__estimate--details--tax-summary'>
                                <div className='estimte--details--tax-summary-heading'>Tax Summary</div>
                                <div className='estimte--details--tax-summary-sub-heading'>
                                    (1 {currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv} = {estimate?.currency_conversion_rate} AED)
                                </div>
                                <div className='read__estimate--details--table'>
                                    <table className="tax-table">
                                        <thead>
                                            <tr>
                                                <th className='thin__table__font align__text__left'>Tax Details</th>
                                                <th className='thin__table__font align__text__right'>Taxable Amount (AED)</th>
                                                <th className='thin__table__font align__text__right'>Tax Amount (AED)</th>
                                                <th className='thin__table__font align__text__right'>Total Amount (AED)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {groupedByTaxId.map((item, idx) => item.totalTaxAmount !== 0 && (
                                                <tr key={idx}>
                                                    <td className='thin__table__font align__text__left'>{item.tax_rate_name}</td>
                                                    <td className='thin__table__font align__text__right'>{subTotal}</td>
                                                    <td className='thin__table__font align__text__right'>{itemTotal[idx]}</td>
                                                    <td className='thin__table__font align__text__right'>{total}</td>
                                                </tr>
                                            ))} */}
                                            <tr>
                                                <td className='bold__table__font align__text__left'>Total</td>
                                                <td className='bold__table__font align__text__right'>{subTotal}</td>
                                                <td className='bold__table__font align__text__right'>{tax}</td>
                                                <td className='bold__table__font align__text__right'>{total}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='read__estimate--tnc-data'>
                            {
                                estimate?.terms_and_conditions ?
                                    <>
                                        <h3>Terms and Conditions</h3>
                                        <p>{estimate?.terms_and_conditions}</p>
                                    </>
                                    : ""
                            }
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