import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTaxInvoiceDetails, markTaxInvoiceVoid, submitTaxInvoiceForApproval } from '../../../Actions/TaxInvoice';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

import './TaxInvoiceRead.css'
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
// import PdfDownload from '../PdfDownload/PdfDownload';

const TaxInvoiceReadLayout = () => {
    const handleDownload = () => {
    }

    const navigate = useNavigate();
    const { user } = useSelector(state => state.userReducer);
    const ti_id = window.location.pathname.split('/')[3];
    const { loading, taxInvoice } = useSelector(state => state.taxInvoiceReducer);
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
        dispatch(getTaxInvoiceDetails(ti_id));
    }, [dispatch]);

    useEffect(() => {
        const calculateTotalAmounts = () => {
            let subTotalAmount = 0;
            let discountAmount = 0;
            let taxAmount = 0;
            const calculatedTax = [];

            const calculateFinalAmount = taxInvoice?.line_items?.map((item) => {
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
    }, [taxInvoice, taxRates]);

    useEffect(() => {
        const groupedByTaxId = taxInvoice?.line_items?.reduce((acc, item, index) => {
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
    }, [itemTotal, itemTax, taxInvoice, taxRates]);


    return (
        <>
            <div className='read__taxInvoice__header'>
                <div className='read__taxInvoice__header--left'>
                    <img src={backButton} alt='back' className='read__taxInvoice__header--back-btn' onClick={() => navigate("/tax-invoice")} />
                    <h1 className='read__taxInvoice__header--title'> Tax Invoices List </h1>
                </div>
                <div className='read__taxInvoice__header--right'>
                    {
                        taxInvoice?.ti_status === "Draft" ?
                            <>
                                <a className='read__taxInvoice__header--btn1'
                                    onClick={() => {
                                        dispatch(submitTaxInvoiceForApproval(window.location.pathname.split('/')[3]))
                                    }}
                                >Submit for Approval</a>
                                <a className='read__taxInvoice__header--btn1'
                                    onClick={() => {
                                        dispatch(markTaxInvoiceVoid(window.location.pathname.split('/')[3]))
                                    }}
                                >Mark as Void</a>
                            </>
                            : taxInvoice?.ti_status === "Pending Approval" ? <>
                                <a className='read__taxInvoice__header--btn1'
                                    onClick={() => {
                                        dispatch(markTaxInvoiceVoid(window.location.pathname.split('/')[3]))
                                    }}
                                >Mark as Void</a>
                            </> : ""
                    }
                    <a className='read__taxInvoice__header--btn1' onClick={() => navigate(`/tax-invoice/edit/${taxInvoice?.ti_id}`)}>Edit</a>
                    <a className='read__taxInvoice__header--btn2' onClick={handleDownload}>Download</a>
                </div>
            </div>
            <div className="read__taxInvoice__container">
                {loading ? <Loader /> :
                    <div className="read__taxInvoice--main" id="read__taxInvoice--main">
                        <div className="read__taxInvoice--top">
                            <img style={{ width: "9rem" }} src={logo} alt="logo" />
                            <h1 className='read__taxInvoice--head'>Tax Invoice</h1>
                        </div>
                        <div className='read__taxInvoice--part1'>
                            <div className='read__taxInvoice--part1-head'>
                                <div className='read__taxInvoice--head-info1'>
                                    <h3>Tax Invoice From</h3>
                                    <span style={{ fontWeight: 500 }}>{user?.clientInfo?.company_data?.company_name}</span>
                                    <span>{user?.clientInfo?.company_data?.address_line_1}</span>
                                    <span>{user?.clientInfo?.company_data?.address_line_2}</span>
                                    <span>{user?.clientInfo?.company_data?.address_line_3}</span>
                                    <span>{user?.clientInfo?.company_data?.state + ', ' + user?.clientInfo?.company_data?.country}</span>
                                    <span>TRN: {user?.clientInfo?.company_data?.trade_license_number}</span>
                                </div>
                                <div className='read__taxInvoice--head-info2'>
                                    <div className='read__taxInvoice--head-info2-data'>
                                        <span>Tax Invoice Number</span>
                                        <p>
                                            {taxInvoice?.ti_number}
                                        </p>
                                    </div>
                                    <div className='read__taxInvoice--head-info2-data'>
                                        <span>Tax Invoice Date</span>
                                        <p>{taxInvoice?.ti_date}</p>
                                    </div>
                                    <div className='read__taxInvoice--head-info2-data'>
                                        <span>Due Date</span>
                                        <p>{taxInvoice?.due_date}</p>
                                    </div>
                                    <div className='read__taxInvoice--head-info2-data'>
                                        {
                                            taxInvoice?.reference ?
                                                <>
                                                    <span>Reference</span>
                                                    <p>{taxInvoice?.reference}</p>
                                                </>
                                                : ""
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='read__taxInvoice--part2-head'>
                                <div className='read__taxInvoice--part2-left'>
                                    <h3>Tax Invoice For</h3>
                                    <div className='read__taxInvoice--customer-data'>
                                        <span style={{ fontWeight: 500 }}>{taxInvoice?.customer?.customer_name}</span>
                                        <span>{taxInvoice?.customer?.billing_address_line_1}</span>
                                        {taxInvoice?.customer?.billing_address_line_2 && <span>{taxInvoice?.customer?.billing_address_line_2}</span>}
                                        {taxInvoice?.customer?.billing_address_line_3 && <span>{taxInvoice?.customer?.billing_address_line_3}</span>}
                                        <span>{taxInvoice?.customer?.billing_state + ', ' + taxInvoice?.customer?.billing_country}</span>
                                        {taxInvoice?.customer?.trn && <span>TRN: {taxInvoice?.customer?.trn}</span>}
                                    </div>
                                </div>
                                <div className='read__taxInvoice--part2-right'>
                                    <h3>Shipping Address</h3>
                                    <div className='read__taxInvoice--customer-data'>
                                        <span>{taxInvoice?.customer?.shipping_address_line_1}</span>
                                        {taxInvoice?.customer?.shipping_address_line_2 && <span>{taxInvoice?.customer?.shipping_address_line_2}</span>}
                                        {taxInvoice?.customer?.shipping_address_line_3 && <span>{taxInvoice?.customer?.shipping_address_line_3}</span>}
                                        <span>{taxInvoice?.customer?.shipping_state + ', ' + taxInvoice?.customer?.shipping_country}</span>
                                        {taxInvoice?.customer?.trn && <span>TRN: {taxInvoice?.customer?.trn}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className='read__taxInvoice--part3-head'>
                                <h3> Currency</h3>
                                <div className='read__taxInvoice--currency'>
                                    <div className='read__taxInvoice--currency-conversion'>
                                        <span>1</span>
                                        <span>{currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv} =</span>
                                        <p>{taxInvoice?.currency_conversion_rate}</p>
                                        <span>AED</span>
                                    </div>
                                </div>
                            </div>
                            <div className='read__taxInvoice--part4-head'>
                                {
                                    taxInvoice?.subject ?
                                        <>
                                            <h3>Subject</h3>
                                            <p>{taxInvoice?.subject}</p>
                                        </>
                                        : ""
                                }
                            </div>
                        </div>
                        <div className='read__taxInvoice__items'>
                            {taxInvoice?.line_items?.map((item, index) => (
                                <div className='read__taxInvoice__items--main' key={index}>
                                    <div className='read__taxInvoice__items--whole-item'>
                                        <div className='read__taxInvoice__items--itemName'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Item Name</span> : <></>}
                                            <p>{item?.item_name}</p>
                                        </div>
                                        <div className='read__taxInvoice__items--unitSelect'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem' }}>Unit</span> : <></>}
                                            <p>{item?.unit}</p>
                                        </div>
                                        <div className='read__taxInvoice__items--number-item qty'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Qty</span> : <></>}
                                            <p>{new Intl.NumberFormat('en-US', {}).format(item?.qty)}</p>
                                        </div>
                                        <div className='read__taxInvoice__items--number-item rate'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Rate</span> : <></>}
                                            <p>{new Intl.NumberFormat('en-US', {}).format(item?.rate)}</p>
                                        </div>
                                        <div className='read__taxInvoice__items--discount'>
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
                                        <div className='read__taxInvoice__items--tax'>
                                            {index === 0 ? <span style={{ marginBottom: '0.9rem' }}>Tax</span> : <></>}
                                            <p className={item?.tax_id === 1 ? 'standard__tax-style' : 'non-standard__tax-style'}>
                                                <span className='tax__amount'>{new Intl.NumberFormat('en-US', {}).format(itemTax && itemTax[index])}</span>
                                                <span className='tax__rate__names'>
                                                    {taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name == 'Standard Rated (5%)' ?
                                                        '(5%)' : taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                                </span>
                                            </p>
                                        </div>
                                        <div className='read__taxInvoice__items--amount'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem' }}>Amount</span> : <></>}
                                            <p>{new Intl.NumberFormat('en-US', {}).format(itemTotal && itemTotal[index])}</p>
                                        </div>
                                    </div>
                                    <div className='read__taxInvoice__items--description'>
                                        {item?.description ? (
                                            <div className='read__taxInvoice--desc__box'>
                                                <span>Description</span>
                                                <p>{item?.description}</p>
                                            </div>
                                        ) : <></>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='read__taxInvoice--details'>
                            <div className='read__taxInvoice--details--bank'>
                                <div className='estimte--details--bank-heading'>Bank Details</div>
                                <div className='read__taxInvoice--details--split'>
                                    <div className='read__taxInvoice--details-left'>
                                        <div className='read__taxInvoice--details-main'>
                                            <div className='read__taxInvoice--details-left-head'>
                                                <span>Bank Name</span>
                                                <span>Account Number</span>
                                                <span>Account Name</span>
                                                <span>IBAN ({currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv} Acc)</span>
                                            </div>
                                            <div className='read__taxInvoice--details-left-info'>
                                                <span>{user?.clientInfo?.primary_bank?.bank_name}</span>
                                                <span>{user?.clientInfo?.primary_bank?.account_number}</span>
                                                <span>{user?.clientInfo?.primary_bank?.account_holder_name}</span>
                                                <span>{user?.clientInfo?.primary_bank?.iban_number}</span>
                                            </div>
                                        </div>
                                        {
                                            user?.clientInfo?.other_bank_accounts?.map((bank, index) => (
                                                <div className='read__taxInvoice--details-main' key={index}>
                                                    <div className='read__taxInvoice--details-left-head'>
                                                        <span>Bank Name</span>
                                                        <span>Account Number</span>
                                                        <span>Account Name</span>
                                                        <span>IBAN ({bank?.currency_abv} Acc)</span>
                                                    </div>
                                                    <div className='read__taxInvoice--details-left-info' key={index}>
                                                        <span>{bank?.bank_name}</span>
                                                        <span>{bank?.account_number}</span>
                                                        <span>{bank?.account_holder_name}</span>
                                                        <span>{bank?.iban_number}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className='read__taxInvoice--details-right'>
                                        <div className='read__taxInvoice--details-right-head'>
                                            <span>Sub Total</span>
                                            <span>Discount</span>
                                            <span>Tax</span>
                                            <span>Total</span>
                                        </div>
                                        <div className='read__taxInvoice--details-right-info'>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(subTotal)}
                                            </span>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(discount)}
                                            </span>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(tax)}
                                            </span>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='read__taxInvoice--details-bottom'>
                            <div className='read__taxInvoice--details--tax-summary'>
                                <div className='estimte--details--tax-summary-heading'>Tax Summary</div>
                                <div className='estimte--details--tax-summary-sub-heading'>
                                    (1 {currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv} = {taxInvoice?.currency_conversion_rate} AED)
                                </div>
                                <div className='read__taxInvoice--details--table'>
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
                                                        }).format(parseFloat(((item.taxable_amount) * (taxInvoice?.currency_conversion_rate || 1)).toFixed(2)))}
                                                    </td>
                                                    <td className='thin__table__font align__text__right'>
                                                        {new Intl.NumberFormat('en-US', {
                                                        }).format(parseFloat(((item.tax_amount) * (taxInvoice?.currency_conversion_rate || 1)).toFixed(2)))}
                                                    </td>
                                                    <td className='thin__table__font align__text__right'>
                                                        {new Intl.NumberFormat('en-US', {
                                                        }).format(parseFloat(((item.total_amount) * (taxInvoice?.currency_conversion_rate || 1)).toFixed(2)))}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className='bold__table__font align__text__left'>Total</td>
                                                <td className='bold__table__font align__text__right'>
                                                    {new Intl.NumberFormat('en-US', {
                                                    }).format(parseFloat(((subTotal - discount) * (taxInvoice?.currency_conversion_rate || 1)).toFixed(2)))
                                                    }
                                                </td>
                                                <td className='bold__table__font align__text__right'>
                                                    {new Intl.NumberFormat('en-US', {
                                                    }).format(parseFloat(((tax) * (taxInvoice?.currency_conversion_rate || 1)).toFixed(2)))}
                                                </td>
                                                <td className='bold__table__font align__text__right'>
                                                    {new Intl.NumberFormat('en-US', {
                                                    }).format(parseFloat(((total) * (taxInvoice?.currency_conversion_rate || 1)).toFixed(2)))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='read__taxInvoice--tnc-data'>
                            {
                                taxInvoice?.terms_and_conditions ?
                                    <>
                                        <h3>Terms and Conditions</h3>
                                        <p>{taxInvoice?.terms_and_conditions}</p>
                                    </>
                                    : ""
                            }
                        </div>
                        <div className="read__taxInvoice__footer">
                            <img style={{ width: "5rem" }} src={logo} alt="logo" />
                            <div className='read__taxInvoice__footer--text'>
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

export default TaxInvoiceReadLayout;
