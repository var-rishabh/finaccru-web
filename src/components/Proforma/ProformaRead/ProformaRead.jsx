import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProformaDetails, markProformaSent, markProformaVoid } from '../../../Actions/Proforma';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

import './ProformaRead.css'
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
import PdfDownload from '../../PdfDownload/PdfDownload';
import ProformaHead from './Parts/ProformaHead';

import { pdfStyle as headPdfStyle, styles as headStyles } from '../../../Styles/ReadHead';
import ProformaFor from './Parts/ProformaFor';
import { styles as forStyles, pdfStyle as forPdfStyles } from '../../../Styles/ReadFor';
import ProformaMeta from './Parts/ProformaMeta';
import { styles as metaStyles, pdfStyle as metaPdfStyles } from '../../../Styles/ReadMeta';
import ProformaBank from './Parts/ProformaBank';
import { styles as bankStyles, pdfStyle as bankPdfStyles } from '../../../Styles/ReadBank';
import ProformaTax from './Parts/ProformaTax';
import { styles as taxStyles, pdfStyle as taxPdfStyles } from '../../../Styles/ReadTax';

const ProformaReadLayout = () => {

    const navigate = useNavigate();
    const { user } = useSelector(state => state.userReducer);
    const pi_id = window.location.pathname.split('/')[3];
    const { loading, proforma } = useSelector(state => state.proformaReducer);
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

    const contents = [
        {
            component: ProformaHead,
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
                pi_number: proforma?.pi_number,
                pi_date: proforma?.pi_date,
                due_date: proforma?.due_date,
                reference: proforma?.reference
            }
        },
        {
            component: ProformaFor,
            height: 120,
            props: {
                styles: forPdfStyles,
                customer_name: proforma?.customer?.customer_name,
                billing_address_line_1: proforma?.customer?.billing_address_line_1,
                billing_address_line_2: proforma?.customer?.billing_address_line_2,
                billing_address_line_3: proforma?.customer?.billing_address_line_3,
                billing_state: proforma?.customer?.billing_state,
                billing_country: proforma?.customer?.billing_country,
                shipping_address_line_1: proforma?.customer?.shipping_address_line_1,
                shipping_address_line_2: proforma?.customer?.shipping_address_line_2,
                shipping_address_line_3: proforma?.customer?.shipping_address_line_3,
                shipping_state: proforma?.customer?.shipping_state,
                shipping_country: proforma?.customer?.shipping_country,
                trn: proforma?.customer?.trn
            }
        },
        {
            component: ProformaMeta,
            height: 70,
            props: {
                styles: metaPdfStyles,
                currency_abv: currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv,
                currency_conversion_rate: proforma?.currency_conversion_rate,
                subject: proforma?.subject
            }
        },
        {
            component: ProformaBank,
            height: ((user?.clientInfo?.other_bank_accounts || []).length + 1) * 75,
            props: {
                styles: bankPdfStyles,
                primary_bank: user?.clientInfo?.primary_bank,
                other_bank_accounts: user?.clientInfo?.other_bank_accounts,
                currency_abv: currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv,
                subTotal: subTotal,
                discount: discount,
                tax: tax,
                total: total,
            }
        },
        {
            component: ProformaTax,
            height: 120,
            props: {
                styles: taxPdfStyles,
                currency_abv: currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv,
                currency_conversion_rate: proforma?.currency_conversion_rate,
                subTotal: subTotal,
                discount: discount,
                tax: tax,
                total: total,
                groupedItems: groupedItems,
                terms_and_conditions: proforma?.terms_and_conditions
            }
        }
    ];

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
                    <PdfDownload contents={contents} heading={"Proforma"} />
                </div>
            </div>
            <div className="read__proforma__container">
                {loading ? <Loader /> :
                    <div className="read__proforma--main" id="read__proforma--main">
                        <div className="read__proforma--top">
                            <img style={{ width: "9rem" }} src={logo} alt="logo" />
                            <h1 className='read__proforma--head'>Proforma</h1>
                        </div>
                        <ProformaHead styles={headStyles} address_line_1={user?.clientInfo?.company_data?.address_line_1} address_line_2={user?.clientInfo?.company_data?.address_line_2} address_line_3={user?.clientInfo?.company_data?.address_line_3} company_name={user?.clientInfo?.company_data?.company_name} country={user?.clientInfo?.company_data?.country} state={user?.clientInfo?.company_data?.state} trade_license_number={user?.clientInfo?.company_data?.trade_license_number} pi_number={proforma?.pi_number} pi_date={proforma?.pi_date} due_date={proforma?.due_date} reference={proforma?.reference} />
                        <ProformaFor styles={forStyles} customer_name={proforma?.customer?.customer_name} billing_address_line_1={proforma?.customer?.billing_address_line_1} billing_address_line_2={proforma?.customer?.billing_address_line_2} billing_address_line_3={proforma?.customer?.billing_address_line_3} billing_state={proforma?.customer?.billing_state} billing_country={proforma?.customer?.billing_country} shipping_address_line_1={proforma?.customer?.shipping_address_line_1} shipping_address_line_2={proforma?.customer?.shipping_address_line_2} shipping_address_line_3={proforma?.customer?.shipping_address_line_3} shipping_state={proforma?.customer?.shipping_state} shipping_country={proforma?.customer?.shipping_country} trn={proforma?.customer?.trn} />
                        <ProformaMeta styles={metaStyles} currency_abv={currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv} currency_conversion_rate={proforma?.currency_conversion_rate} subject={proforma?.subject} />
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
                        <ProformaBank styles={bankStyles} currency_abv={currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                            primary_bank={user?.clientInfo?.primary_bank}
                            other_bank_accounts={user?.clientInfo?.other_bank_accounts}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                        />
                        <ProformaTax styles={taxStyles} currency_abv={currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                            currency_conversion_rate={proforma?.currency_conversion_rate}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                            groupedItems={groupedItems} terms_and_conditions={proforma?.terms_and_conditions}
                        />
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
