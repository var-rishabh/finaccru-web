import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCreditNoteDetails, markCreditNoteVoid, submitCreditNoteForApproval } from '../../../Actions/CreditNote';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

import './CreditNoteRead.css'
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
import PdfDownload from '../../../Shared/PdfDownload/PdfDownload';
import CreditNoteHead from './Parts/CreditNoteHead';

import { pdfStyle as headPdfStyle, styles as headStyles } from '../../../Styles/ReadHead';
import CreditNoteFor from './Parts/CreditNoteFor';
import { styles as forStyles, pdfStyle as forPdfStyles } from '../../../Styles/ReadFor';
import CreditNoteMeta from './Parts/CreditNoteMeta';
import { styles as metaStyles, pdfStyle as metaPdfStyles } from '../../../Styles/ReadMeta';
import LineItem from '../../../Shared/LineItem/LineItem';
import { styles as lineItemStyles, pdfStyle as lineItemPdfStyles } from '../../../Styles/LineItem';
import CreditNoteBank from './Parts/CreditNoteBank';
import { styles as bankStyles, pdfStyle as bankPdfStyles } from '../../../Styles/ReadBank';
import CreditNoteTax from './Parts/CreditNoteTax';
import { styles as taxStyles, pdfStyle as taxPdfStyles } from '../../../Styles/ReadTax';

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
            height: 90,
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
            height: 90,
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
        },
        ...(creditNote?.line_items || []).map((item, index) => {
            const taxItem = taxRates?.find((tax) => tax.tax_rate_id === item.tax_id);
            return {
                component: LineItem,
                height: item.description ? 45 : 30,
                props: {
                    styles: lineItemPdfStyles,
                    index: index,
                    item_name: item.item_name || '',
                    unit: item.unit || '',
                    qty: item.qty || '',
                    rate: item.rate || '',
                    discount: item.discount || '',
                    is_percentage_discount: item.is_percentage_discount || '',
                    tax_id: item.tax_id || '',
                    taxRateName: taxItem ? taxItem.tax_rate_name : '',
                    taxAmount: itemTax && itemTax[index],
                    amount: itemTotal && itemTotal[index],
                    description: item.description || ''
                }
            }
        }),
        {
            component: CreditNoteBank,
            height: ((user?.clientInfo?.other_bank_accounts || []).length) * 55 + 80,
            props: {
                styles: bankPdfStyles,
                primary_bank: user?.clientInfo?.primary_bank,
                other_bank_accounts: user?.clientInfo?.other_bank_accounts,
                currency_abv: currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv,
                subTotal: subTotal,
                discount: discount,
                tax: tax,
                total: total,
            }
        },
        {
            component: CreditNoteTax,
            height: 120,
            props: {
                styles: taxPdfStyles,
                currency_abv: currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv,
                currency_conversion_rate: creditNote?.currency_conversion_rate,
                subTotal: subTotal,
                discount: discount,
                tax: tax,
                total: total,
                groupedItems: groupedItems,
                terms_and_conditions: creditNote?.terms_and_conditions
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
                    {
                        creditNote?.cn_status === "Void" ? "" :
                            creditNote?.cn_status === "Approved" ? "" :
                                <a className='read__creditNote__header--btn1' onClick={() => navigate(`/credit-note/edit/${creditNote?.cn_id}`)}>Edit</a>
                    }
                    <PdfDownload contents={contents} heading={"Credit Note"} />
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
                                <LineItem styles={lineItemStyles} key={index} index={index}
                                    item_name={item?.item_name} unit={item?.unit} qty={item?.qty} rate={item?.rate}
                                    discount={item?.discount} is_percentage_discount={item?.is_percentage_discount}
                                    tax_id={item?.tax_id} taxRateName={taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                    taxAmount={itemTax && itemTax[index]} amount={itemTotal && itemTotal[index]}
                                    description={item?.description}
                                />
                            ))}
                        </div>
                        <CreditNoteBank styles={bankStyles} currency_abv={currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv}
                            primary_bank={user?.clientInfo?.primary_bank}
                            other_bank_accounts={user?.clientInfo?.other_bank_accounts}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                        />
                        <CreditNoteTax styles={taxStyles} currency_abv={currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv}
                            currency_conversion_rate={creditNote?.currency_conversion_rate}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                            groupedItems={groupedItems} terms_and_conditions={creditNote?.terms_and_conditions}
                        />
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
