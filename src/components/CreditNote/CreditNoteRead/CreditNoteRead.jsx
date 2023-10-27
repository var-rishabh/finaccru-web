import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCreditNoteDetails, markCreditNoteVoid, submitCreditNoteForApproval } from '../../../Actions/CreditNote';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

import './CreditNoteRead.css'
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
import PdfDownload from '../../PdfDownload/PdfDownload';
import CreditNoteHead from './Parts/CreditNoteHead';


import { pdfStyle as headPdfStyle, styles as headStyles } from '../../../Styles/ReadHead';
import CreditNoteFor from './Parts/CreditNoteFor';
import { styles as forStyles, pdfStyle as forPdfStyles } from '../../../Styles/ReadFor';
import CreditNoteMeta from './Parts/CreditNoteMeta';
import { styles as metaStyles, pdfStyle as metaPdfStyles } from '../../../Styles/ReadMeta';

const CreditNoteReadLayout = () => {

    const navigate = useNavigate();
    const { user } = useSelector(state => state.userReducer);
    const cn_id = window.location.pathname.split('/')[3];
    const { loading, creditNote } = useSelector(state => state.creditNoteReducer);
    const { taxRates } = useSelector(state => state.onboardingReducer);
    const dispatch = useDispatch();

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);

    const [groupedItems, setGroupedItems] = useState([]);

    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const { currencies } = useSelector(state => state.onboardingReducer);

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getCreditNoteDetails(cn_id));
    }, [dispatch]);

    useEffect(() => {
        const calculateTotalAmounts = () => {
            let subTotalAmount = 0;
            let discountAmount = 0;
            let taxAmount = 0;
            const calculatedTax = [];

            const calculateFinalAmount = creditNote?.line_items?.map((item) => {
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
    }, [creditNote, taxRates]);

    useEffect(() => {
        const groupedByTaxId = creditNote?.line_items?.reduce((acc, item, index) => {
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
    }, [itemTotal, itemTax, creditNote, taxRates]);

    const contents = [
        {
            component: CreditNoteHead,
            height: 120,
            props: {
                styles: headPdfStyle,
                address_line_1: user?.clientInfo?.company_data?.address_line_1,
                address_line_2: user?.clientInfo?.company_data?.address_line_2,
                address_line_3: user?.clientInfo?.company_data?.address_line_3,
                company_name: user?.clientInfo?.company_data?.company_name,
                country: user?.clientInfo?.company_data?.country,
                state: user?.clientInfo?.company_data?.state,
                trade_license_number: user?.clientInfo?.company_data?.trade_license_number,
                cn_number: creditNote?.cn_number,
                cn_date: creditNote?.cn_date,
                due_date: creditNote?.due_date,
                reference: creditNote?.reference
            }
        },
        {
            component: CreditNoteFor,
            height: 120,
            props: {
                styles: forPdfStyles,
                customer_name: creditNote?.customer?.customer_name,
                billing_address_line_1: creditNote?.customer?.billing_address_line_1,
                billing_address_line_2: creditNote?.customer?.billing_address_line_2,
                billing_address_line_3: creditNote?.customer?.billing_address_line_3,
                billing_state: creditNote?.customer?.billing_state,
                billing_country: creditNote?.customer?.billing_country,
                shipping_address_line_1: creditNote?.customer?.shipping_address_line_1,
                shipping_address_line_2: creditNote?.customer?.shipping_address_line_2,
                shipping_address_line_3: creditNote?.customer?.shipping_address_line_3,
                shipping_state: creditNote?.customer?.shipping_state,
                shipping_country: creditNote?.customer?.shipping_country,
                trn: creditNote?.customer?.trn
            }
        },
        {
            component: CreditNoteMeta,
            height: 70,
            props: {
                styles: metaPdfStyles,
                currency_abv: currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv,
                currency_conversion_rate: creditNote?.currency_conversion_rate,
                subject: creditNote?.subject
            }
        }
    ];

    return (
        <>
            <div className='read__creditNote__header'>
                <div className='read__creditNote__header--left'>
                    <img src={backButton} alt='back' className='read__creditNote__header--back-btn' onClick={() => navigate("/credit-note")} />
                    <h1 className='read__creditNote__header--title'> Credit Notes List </h1>
                </div>
                <div className='read__creditNote__header--right'>
                    {
                        creditNote?.cn_status === "Draft" ?
                            <>
                                <a className='read__creditNote__header--btn1'
                                    onClick={() => {
                                        dispatch(submitCreditNoteForApproval(window.location.pathname.split('/')[3]))
                                    }}
                                >Submit for Approval</a>
                                <a className='read__creditNote__header--btn1'
                                    onClick={() => {
                                        dispatch(markCreditNoteVoid(window.location.pathname.split('/')[3]))
                                    }}
                                >Mark as Void</a>
                            </>
                            : creditNote?.cn_status === "Pending Approval" ? <>
                                <a className='read__creditNote__header--btn1'
                                    onClick={() => {
                                        dispatch(markCreditNoteVoid(window.location.pathname.split('/')[3]))
                                    }}
                                >Mark as Void</a>
                            </> : ""
                    }
                    <a className='read__creditNote__header--btn1' onClick={() => navigate(`/credit-note/edit/${creditNote?.cn_id}`)}>Edit</a>
                    <PdfDownload contents={contents} heading={"Tax Invoice"} />
                </div>
            </div>
            <div className="read__creditNote__container">
                {loading ? <Loader /> :
                    <div className="read__creditNote--main" id="read__creditNote--main">
                        <div className="read__creditNote--top">
                            <img style={{ width: "9rem" }} src={logo} alt="logo" />
                            <h1 className='read__creditNote--head'>Credit Note</h1>
                        </div>
                        <CreditNoteHead styles={headStyles} address_line_1={user?.clientInfo?.company_data?.address_line_1} address_line_2={user?.clientInfo?.company_data?.address_line_2} address_line_3={user?.clientInfo?.company_data?.address_line_3} company_name={user?.clientInfo?.company_data?.company_name} country={user?.clientInfo?.company_data?.country} state={user?.clientInfo?.company_data?.state} trade_license_number={user?.clientInfo?.company_data?.trade_license_number} cn_number={creditNote?.cn_number} cn_date={creditNote?.cn_date} due_date={creditNote?.due_date} reference={creditNote?.reference} />
                        <CreditNoteFor styles={forStyles} customer_name={creditNote?.customer?.customer_name} billing_address_line_1={creditNote?.customer?.billing_address_line_1} billing_address_line_2={creditNote?.customer?.billing_address_line_2} billing_address_line_3={creditNote?.customer?.billing_address_line_3} billing_state={creditNote?.customer?.billing_state} billing_country={creditNote?.customer?.billing_country} shipping_address_line_1={creditNote?.customer?.shipping_address_line_1} shipping_address_line_2={creditNote?.customer?.shipping_address_line_2} shipping_address_line_3={creditNote?.customer?.shipping_address_line_3} shipping_state={creditNote?.customer?.shipping_state} shipping_country={creditNote?.customer?.shipping_country} trn={creditNote?.customer?.trn} />
                        <CreditNoteMeta styles={metaStyles} currency_abv={currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv} currency_conversion_rate={creditNote?.currency_conversion_rate} subject={creditNote?.subject} />
                        <div className='read__creditNote__items'>
                            {creditNote?.line_items?.map((item, index) => (
                                <div className='read__creditNote__items--main' key={index}>
                                    <div className='read__creditNote__items--whole-item'>
                                        <div className='read__creditNote__items--itemName'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Item Name</span> : <></>}
                                            <p>{item?.item_name}</p>
                                        </div>
                                        <div className='read__creditNote__items--unitSelect'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem' }}>Unit</span> : <></>}
                                            <p>{item?.unit}</p>
                                        </div>
                                        <div className='read__creditNote__items--number-item qty'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Qty</span> : <></>}
                                            <p>{new Intl.NumberFormat('en-US', {}).format(item?.qty)}</p>
                                        </div>
                                        <div className='read__creditNote__items--number-item rate'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Rate</span> : <></>}
                                            <p>{new Intl.NumberFormat('en-US', {}).format(item?.rate)}</p>
                                        </div>
                                        <div className='read__creditNote__items--discount'>
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
                                        <div className='read__creditNote__items--tax'>
                                            {index === 0 ? <span style={{ marginBottom: '0.9rem' }}>Tax</span> : <></>}
                                            <p className={item?.tax_id === 1 ? 'standard__tax-style' : 'non-standard__tax-style'}>
                                                <span className='tax__amount'>{new Intl.NumberFormat('en-US', {}).format(itemTax && itemTax[index])}</span>
                                                <span className='tax__rate__names'>
                                                    {taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name == 'Standard Rated (5%)' ?
                                                        '(5%)' : taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                                </span>
                                            </p>
                                        </div>
                                        <div className='read__creditNote__items--amount'>
                                            {index === 0 ? <span style={{ marginBottom: '1rem' }}>Amount</span> : <></>}
                                            <p>{new Intl.NumberFormat('en-US', {}).format(itemTotal && itemTotal[index])}</p>
                                        </div>
                                    </div>
                                    <div className='read__creditNote__items--description'>
                                        {item?.description ? (
                                            <div className='read__creditNote--desc__box'>
                                                <span>Description</span>
                                                <p>{item?.description}</p>
                                            </div>
                                        ) : <></>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='read__creditNote--details'>
                            <div className='read__creditNote--details--bank'>
                                <div className='estimte--details--bank-heading'>Bank Details</div>
                                <div className='read__creditNote--details--split'>
                                    <div className='read__creditNote--details-left'>
                                        <div className='read__creditNote--details-main'>
                                            <div className='read__creditNote--details-left-head'>
                                                <span>Bank Name</span>
                                                <span>Account Number</span>
                                                <span>Account Name</span>
                                                <span>IBAN ({currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv} Acc)</span>
                                            </div>
                                            <div className='read__creditNote--details-left-info'>
                                                <span>{user?.clientInfo?.primary_bank?.bank_name}</span>
                                                <span>{user?.clientInfo?.primary_bank?.account_number}</span>
                                                <span>{user?.clientInfo?.primary_bank?.account_holder_name}</span>
                                                <span>{user?.clientInfo?.primary_bank?.iban_number}</span>
                                            </div>
                                        </div>
                                        {
                                            user?.clientInfo?.other_bank_accounts?.map((bank, index) => (
                                                <div className='read__creditNote--details-main' key={index}>
                                                    <div className='read__creditNote--details-left-head'>
                                                        <span>Bank Name</span>
                                                        <span>Account Number</span>
                                                        <span>Account Name</span>
                                                        <span>IBAN ({bank?.currency_abv} Acc)</span>
                                                    </div>
                                                    <div className='read__creditNote--details-left-info' key={index}>
                                                        <span>{bank?.bank_name}</span>
                                                        <span>{bank?.account_number}</span>
                                                        <span>{bank?.account_holder_name}</span>
                                                        <span>{bank?.iban_number}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className='read__creditNote--details-right'>
                                        <div className='read__creditNote--details-right-head'>
                                            <span>Sub Total</span>
                                            <span>Discount</span>
                                            <span>Tax</span>
                                            <span>Total</span>
                                        </div>
                                        <div className='read__creditNote--details-right-info'>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(subTotal)}
                                            </span>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(discount)}
                                            </span>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(tax)}
                                            </span>
                                            <span>
                                                <p style={{ fontWeight: 500 }}>
                                                    {currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv}
                                                </p>
                                                &nbsp; {new Intl.NumberFormat('en-US', {
                                                }).format(total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='read__creditNote--details-bottom'>
                            <div className='read__creditNote--details--tax-summary'>
                                <div className='estimte--details--tax-summary-heading'>Tax Summary</div>
                                <div className='estimte--details--tax-summary-sub-heading'>
                                    (1 {currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv} = {creditNote?.currency_conversion_rate} AED)
                                </div>
                                <div className='read__creditNote--details--table'>
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
                                                        }).format(parseFloat(((item.taxable_amount) * (creditNote?.currency_conversion_rate || 1)).toFixed(2)))}
                                                    </td>
                                                    <td className='thin__table__font align__text__right'>
                                                        {new Intl.NumberFormat('en-US', {
                                                        }).format(parseFloat(((item.tax_amount) * (creditNote?.currency_conversion_rate || 1)).toFixed(2)))}
                                                    </td>
                                                    <td className='thin__table__font align__text__right'>
                                                        {new Intl.NumberFormat('en-US', {
                                                        }).format(parseFloat(((item.total_amount) * (creditNote?.currency_conversion_rate || 1)).toFixed(2)))}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className='bold__table__font align__text__left'>Total</td>
                                                <td className='bold__table__font align__text__right'>
                                                    {new Intl.NumberFormat('en-US', {
                                                    }).format(parseFloat(((subTotal - discount) * (creditNote?.currency_conversion_rate || 1)).toFixed(2)))
                                                    }
                                                </td>
                                                <td className='bold__table__font align__text__right'>
                                                    {new Intl.NumberFormat('en-US', {
                                                    }).format(parseFloat(((tax) * (creditNote?.currency_conversion_rate || 1)).toFixed(2)))}
                                                </td>
                                                <td className='bold__table__font align__text__right'>
                                                    {new Intl.NumberFormat('en-US', {
                                                    }).format(parseFloat(((total) * (creditNote?.currency_conversion_rate || 1)).toFixed(2)))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='read__creditNote--tnc-data'>
                            {
                                creditNote?.terms_and_conditions ?
                                    <>
                                        <h3>Terms and Conditions</h3>
                                        <p>{creditNote?.terms_and_conditions}</p>
                                    </>
                                    : ""
                            }
                        </div>
                        <div className="read__creditNote__footer">
                            <img style={{ width: "5rem" }} src={logo} alt="logo" />
                            <div className='read__creditNote__footer--text'>
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

export default CreditNoteReadLayout;
