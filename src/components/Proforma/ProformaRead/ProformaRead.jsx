import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProformaDetails, markProformaSent, markProformaVoid } from '../../../Actions/Proforma';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

import './ProformaRead.css'
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
// import PdfDownload from '../PdfDownload/PdfDownload';

const ProformaReadLayout = () => {
    const handleDownload = () => {
    }

    const navigate = useNavigate();
    const { user } = useSelector(state => state.userReducer);
    const pi_id = window.location.pathname.split('/')[3];
    const { loading, proforma } = useSelector(state => state.proformaReducer);
    const { taxRates, taxRateLoading } = useSelector(state => state.onboardingReducer);
    const dispatch = useDispatch();

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);

    const [groupedItems, setGroupedItems] = useState([]);

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
        dispatch(getProformaDetails(pi_id));
    }, [dispatch]);

    useEffect(() => {
        const calculateTotalAmounts = () => {
            let subTotalAmount = 0;
            let discountAmount = 0;
            let taxAmount = 0;
            const calculatedTax = [];

            const calculateFinalAmount = proforma?.line_items?.map((item) => {
                const { qty, rate, discount, is_percentage_discount, tax_id } = item;
                let finalRate = 0;
                let overAllRate = 0;
                if (is_percentage_discount) {
                    finalRate = rate - (rate * discount / 100);
                    overAllRate = finalRate * qty;
                    discountAmount += (rate - finalRate) * qty;
                } else {
                    discountAmount += ((+discount) * qty);
                    overAllRate = (rate - discount) * qty;
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
            setItemTax(calculatedTax);

            return calculateFinalAmount;
        };

        const calculateTotalAmount = calculateTotalAmounts();
        setItemTotal(calculateTotalAmount);
    }, [proforma, taxRates]);

    useEffect(() => {
        const groupedByTaxId = proforma?.line_items?.reduce((acc, item, index) => {
            const existingGroup = acc.find((group) => group.tax_id === item.tax_id);
            if (existingGroup) {
                existingGroup.taxable_amount += (itemTotal?.at(index) - itemTax?.at(index));
                existingGroup.tax_amount += (itemTax?.at(index));
                existingGroup.total_amount += (itemTotal?.at(index));
            } else {
                const taxItem = taxRates?.find((tr) => tr.tax_rate_id === item.tax_id);
                acc.push({
                    tax_id: item.tax_id,
                    tax_rate_name: taxItem.tax_rate_name,
                    taxable_amount: (itemTotal?.at(index) - itemTax?.at(index)),
                    tax_amount: (itemTax?.at(index)),
                    total_amount: (itemTotal?.at(index)),
                });
            }
            return acc;
        }, []);

        setGroupedItems(groupedByTaxId);
    }, [itemTotal, itemTax, proforma, taxRates]);


    return (
        <>
            <div className='read__proforma__header'>
                <div className='read__proforma__header--left'>
                    <img src={backButton} alt='back' className='read__proforma__header--back-btn' onClick={() => navigate("/proforma")} />
                    <h1 className='read__proforma__header--title'> Proformas List </h1>
                </div>
                <div className='read__proforma__header--right'>
                    {
                        proforma?.pi_status === "Draft" ? <>
                            <a className='create__proforma__header--btn1'
                                onClick={() => {
                                    dispatch(markProformaSent(window.location.pathname.split('/')[3]))
                                }}
                            >Mark as Sent</a>
                        </> : proforma?.pi_status === "Sent" ? <>
                            <a className='create__proforma__header--btn1'
                                onClick={() => {
                                    dispatch(markProformaVoid(window.location.pathname.split('/')[3]))
                                }}
                            >Mark as Void</a>
                        </> : ""
                    }
                    <a className='read__proforma__header--btn1' onClick={() => navigate(`/proforma/edit/${proforma?.pi_id}`)}>Edit</a>
                    <a className='read__proforma__header--btn2' onClick={handleDownload}>Download</a>
                </div>
            </div>
            <div className="read__proforma__container">
                {loading ? <Loader /> :
                    <div className="read__proforma--main" id="read__proforma--main">
                        <div className="read__proforma--top">
                            <img style={{ width: "9rem" }} src={logo} alt="logo" />
                            <h1 className='read__proforma--head'>Proforma</h1>
                        </div>
                        <div className='read__proforma--part1'>
                            <div className='read__proforma--part1-head'>
                                <div className='read__proforma--head-info1'>
                                    <h3>Proforma From</h3>
                                    <span style={{ fontWeight: 500 }}>{user?.clientInfo?.company_data?.company_name}</span>
                                    <span>{user?.clientInfo?.company_data?.address_line_1}</span>
                                    <span>{user?.clientInfo?.company_data?.address_line_2}</span>
                                    <span>{user?.clientInfo?.company_data?.address_line_3}</span>
                                    <span>{user?.clientInfo?.company_data?.state + ', ' + user?.clientInfo?.company_data?.country}</span>
                                    <span>TRN: {user?.clientInfo?.company_data?.trade_license_number}</span>
                                </div>
                                <div className='read__proforma--head-info2'>
                                    <div className='read__proforma--head-info2-data'>
                                        <span>Proforma Number</span>
                                        <p>
                                            {proforma?.pi_number}
                                        </p>
                                    </div>
                                    <div className='read__proforma--head-info2-data'>
                                        <span>Proforma Date</span>
                                        <p>{proforma?.pi_date}</p>
                                    </div>
                                    <div className='read__proforma--head-info2-data'>
                                        <span>Due Date</span>
                                        <p>{proforma?.due_date}</p>
                                    </div>
                                    <div className='read__proforma--head-info2-data'>
                                        {
                                            proforma?.reference ?
                                                <>
                                                    <span>Reference</span>
                                                    <p>{proforma?.reference}</p>
                                                </>
                                                : ""
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='read__proforma--part2-head'>
                                <div className='read__proforma--part2-left'>
                                    <h3>Proforma For</h3>
                                    <div className='read__proforma--customer-data'>
                                        <span style={{ fontWeight: 500 }}>{proforma?.customer?.customer_name}</span>
                                        <span>{proforma?.customer?.billing_address_line_1}</span>
                                        {proforma?.customer?.billing_address_line_2 && <span>{proforma?.customer?.billing_address_line_2}</span>}
                                        {proforma?.customer?.billing_address_line_3 && <span>{proforma?.customer?.billing_address_line_3}</span>}
                                        <span>{proforma?.customer?.billing_state + ', ' + proforma?.customer?.billing_country}</span>
                                        {proforma?.customer?.trn && <span>TRN: {proforma?.customer?.trn}</span>}
                                    </div>
                                </div>
                                <div className='read__proforma--part2-right'>
                                    <h3>Shipping Address</h3>
                                    <div className='read__proforma--customer-data'>
                                        <span>{proforma?.customer?.shipping_address_line_1}</span>
                                        {proforma?.customer?.shipping_address_line_2 && <span>{proforma?.customer?.shipping_address_line_2}</span>}
                                        {proforma?.customer?.shipping_address_line_3 && <span>{proforma?.customer?.shipping_address_line_3}</span>}
                                        <span>{proforma?.customer?.shipping_state + ', ' + proforma?.customer?.shipping_country}</span>
                                        {proforma?.customer?.trn && <span>TRN: {proforma?.customer?.trn}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className='read__proforma--part3-head'>
                                <h3> Currency</h3>
                                <div className='read__proforma--currency'>
                                    <div className='read__proforma--currency-conversion'>
                                        <span>1</span>
                                        <span>{currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv} =</span>
                                        <p>{proforma?.currency_conversion_rate}</p>
                                        <span>AED</span>
                                    </div>
                                </div>
                            </div>
                            <div className='read__proforma--part4-head'>
                                {
                                    proforma?.subject ?
                                        <>
                                            <h3>Subject</h3>
                                            <p>{proforma?.subject}</p>
                                        </>
                                        : ""
                                }
                            </div>
                        </div>
                        <div className='read__proforma__items'>
                            {proforma?.line_items?.map((item, index) => (
                                <div className='read__proforma__items--main' key={index}>
                                    <div className='read__proforma__items--whole-item'>
                                        <div className='read__proforma__items--itemName'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Item Name</span> : <></>}
                                            <p>{item?.item_name}</p>
                                        </div>
                                        <div className='read__proforma__items--unitSelect'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem' }}>Unit</span> : <></>}
                                            <p>{item?.unit}</p>
                                        </div>
                                        <div className='read__proforma__items--number-item qty'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Qty</span> : <></>}
                                            <p>{new Intl.NumberFormat('en-US', {}).format(item?.qty)}</p>
                                        </div>
                                        <div className='read__proforma__items--number-item rate'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Rate</span> : <></>}
                                            <p>{new Intl.NumberFormat('en-US', {}).format(item?.rate)}</p>
                                        </div>
                                        <div className='read__proforma__items--discount'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Discount</span> : <></>}
                                            <p>
                                                <span style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingRight: "0.5rem" }}>
                                                    {new Intl.NumberFormat('en-US', {}).format(item?.discount)}
                                                </span>
                                                <span className='discount__symbol'>
                                                    {item?.is_percentage_discount ? '%' : '$'}
                                                </span>
                                            </p>
                                        </div>
                                        <div className='read__proforma__items--tax'>
                                            {index === 0 ? <span style={{ marginBottom: '0.9rem' }}>Tax</span> : <></>}
                                            <p className={item?.tax_id === 1 ? 'standard__tax-style' : 'non-standard__tax-style'}>
                                                <span className='tax__amount'>{new Intl.NumberFormat('en-US', {}).format(itemTax && itemTax[index])}</span>
                                                <span className='tax__rate__names'>
                                                    {taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name == 'Standard Rated (5%)' ?
                                                        '(5%)' : taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                                </span>
                                            </p>
                                        </div>
                                        <div className='read__proforma__items--amount'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem' }}>Amount</span> : <></>}
                                            <p>{new Intl.NumberFormat('en-US', {}).format(itemTotal && itemTotal[index])}</p>
                                        </div>
                                    </div>
                                    <div className='read__proforma__items--description'>
                                        {item?.description ? (
                                            <div className='read__proforma--desc__box'>
                                                <span>Description</span>
                                                <p>{item?.description}</p>
                                            </div>
                                        ) : <></>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='read__proforma--details'>
                            <div className='read__proforma--details--bank'>
                                <div className='estimte--details--bank-heading'>Bank Details</div>
                                <div className='read__proforma--details--split'>
                                    <div className='read__proforma--details-left'>
                                        <div className='read__proforma--details-main'>
                                            <div className='read__proforma--details-left-head'>
                                                <span>Bank Name</span>
                                                <span>Account Number</span>
                                                <span>Account Name</span>
                                                <span>IBAN ({currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv} Acc)</span>
                                            </div>
                                            <div className='read__proforma--details-left-info'>
                                                <span>{user?.clientInfo?.primary_bank?.bank_name}</span>
                                                <span>{user?.clientInfo?.primary_bank?.account_number}</span>
                                                <span>{user?.clientInfo?.primary_bank?.account_holder_name}</span>
                                                <span>{user?.clientInfo?.primary_bank?.iban_number}</span>
                                            </div>
                                        </div>
                                        {
                                            user?.clientInfo?.other_bank_accounts?.map((bank, index) => (
                                                <div className='read__proforma--details-main' key={index}>
                                                    <div className='read__proforma--details-left-head'>
                                                        <span>Bank Name</span>
                                                        <span>Account Number</span>
                                                        <span>Account Name</span>
                                                        <span>IBAN ({bank?.currency_abv} Acc)</span>
                                                    </div>
                                                    <div className='read__proforma--details-left-info' key={index}>
                                                        <span>{bank?.bank_name}</span>
                                                        <span>{bank?.account_number}</span>
                                                        <span>{bank?.account_holder_name}</span>
                                                        <span>{bank?.iban_number}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className='read__proforma--details-right'>
                                        <div className='read__proforma--details-right-head'>
                                            <span>Sub Total</span>
                                            <span>Discount</span>
                                            <span>Tax</span>
                                            <span>Total</span>
                                        </div>
                                        <div className='read__proforma--details-right-info'>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(subTotal)}
                                            </span>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(discount)}
                                            </span>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(tax)}
                                            </span>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='read__proforma--details-bottom'>
                            <div className='read__proforma--details--tax-summary'>
                                <div className='estimte--details--tax-summary-heading'>Tax Summary</div>
                                <div className='estimte--details--tax-summary-sub-heading'>
                                    (1 {currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv} = {proforma?.currency_conversion_rate} AED)
                                </div>
                                <div className='read__proforma--details--table'>
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
                                            {groupedItems?.map((item, idx) => item.totalTaxAmount !== 0 && (
                                                <tr key={idx}>
                                                    <td className='thin__table__font align__text__left'>{item.tax_rate_name}</td>
                                                    <td className='thin__table__font align__text__right'>
                                                        {new Intl.NumberFormat('en-US', {
                                                        }).format(parseFloat(((item.taxable_amount) * (proforma?.currency_conversion_rate || 1)).toFixed(2)))}
                                                    </td>
                                                    <td className='thin__table__font align__text__right'>
                                                        {new Intl.NumberFormat('en-US', {
                                                        }).format(parseFloat(((item.tax_amount) * (proforma?.currency_conversion_rate || 1)).toFixed(2)))}
                                                    </td>
                                                    <td className='thin__table__font align__text__right'>
                                                        {new Intl.NumberFormat('en-US', {
                                                        }).format(parseFloat(((item.total_amount) * (proforma?.currency_conversion_rate || 1)).toFixed(2)))}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className='bold__table__font align__text__left'>Total</td>
                                                <td className='bold__table__font align__text__right'>
                                                    {new Intl.NumberFormat('en-US', {
                                                    }).format(parseFloat(((subTotal - discount) * (proforma?.currency_conversion_rate || 1)).toFixed(2)))
                                                    }
                                                </td>
                                                <td className='bold__table__font align__text__right'>
                                                    {new Intl.NumberFormat('en-US', {
                                                    }).format(parseFloat(((tax) * (proforma?.currency_conversion_rate || 1)).toFixed(2)))}
                                                </td>
                                                <td className='bold__table__font align__text__right'>
                                                    {new Intl.NumberFormat('en-US', {
                                                    }).format(parseFloat(((total) * (proforma?.currency_conversion_rate || 1)).toFixed(2)))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='read__proforma--tnc-data'>
                            {
                                proforma?.terms_and_conditions ?
                                    <>
                                        <h3>Terms and Conditions</h3>
                                        <p>{proforma?.terms_and_conditions}</p>
                                    </>
                                    : ""
                            }
                        </div>
                        <div className="read__proforma__footer">
                            <img style={{ width: "5rem" }} src={logo} alt="logo" />
                            <div className='read__proforma__footer--text'>
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

export default ProformaReadLayout;
