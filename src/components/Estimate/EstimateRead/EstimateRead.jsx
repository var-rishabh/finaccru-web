import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEstimateDetails, markEstimateSent, markEstimateVoid } from '../../../Actions/Estimate';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

import './EstimateRead.css'
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
import PdfDownload from '../../PdfDownload/PdfDownload';
import EstimateHead from './Parts/EstimateHead';

import { pdfStyle as headPdfStyle, styles as headStyles } from '../../../Styles/ReadHead';
import EstimateFor from './Parts/EstimateFor';
import { styles as forStyles, pdfStyle as forPdfStyles } from '../../../Styles/ReadFor';
import EstimateMeta from './Parts/EstimateMeta';
import { styles as metaStyles, pdfStyle as metaPdfStyles } from '../../../Styles/ReadMeta';
import LineItem from '../../LineItem/LineItem';
import { styles as lineItemStyles, pdfStyle as lineItemPdfStyles } from '../../../Styles/LineItem';
import EstimateBank from './Parts/EstimateBank';
import { styles as bankStyles, pdfStyle as bankPdfStyles } from '../../../Styles/ReadBank';
import EstimateTax from './Parts/EstimateTax';
import { styles as taxStyles, pdfStyle as taxPdfStyles } from '../../../Styles/ReadTax';

const EstimateReadLayout = () => {

    const navigate = useNavigate();
    const { user } = useSelector(state => state.userReducer);
    const estimate_id = window.location.pathname.split('/')[3];
    const { loading, estimate } = useSelector(state => state.estimateReducer);
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
    }, [estimate, taxRates]);

    useEffect(() => {
        const groupedByTaxId = estimate?.line_items?.reduce((acc, item, index) => {
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
    }, [itemTotal, itemTax, estimate, taxRates]);
    const contents = [
        {
            component: EstimateHead,
            height: 100,
            props: {
                styles: headPdfStyle,
                address_line_1: user?.clientInfo?.company_data?.address_line_1,
                address_line_2: user?.clientInfo?.company_data?.address_line_2,
                address_line_3: user?.clientInfo?.company_data?.address_line_3,
                company_name: user?.clientInfo?.company_data?.company_name,
                country: user?.clientInfo?.company_data?.country,
                state: user?.clientInfo?.company_data?.state,
                trade_license_number: user?.clientInfo?.company_data?.trade_license_number,
                estimate_number: estimate?.estimate_number,
                estimate_date: estimate?.estimate_date,
                valid_till: estimate?.valid_till,
                reference: estimate?.reference
            }
        },
        {
            component: EstimateFor,
            height: 100,
            props: {
                styles: forPdfStyles,
                customer_name: estimate?.customer?.customer_name,
                billing_address_line_1: estimate?.customer?.billing_address_line_1,
                billing_address_line_2: estimate?.customer?.billing_address_line_2,
                billing_address_line_3: estimate?.customer?.billing_address_line_3,
                billing_state: estimate?.customer?.billing_state,
                billing_country: estimate?.customer?.billing_country,
                shipping_address_line_1: estimate?.customer?.shipping_address_line_1,
                shipping_address_line_2: estimate?.customer?.shipping_address_line_2,
                shipping_address_line_3: estimate?.customer?.shipping_address_line_3,
                shipping_state: estimate?.customer?.shipping_state,
                shipping_country: estimate?.customer?.shipping_country,
                trn: estimate?.customer?.trn
            }
        },
        {
            component: EstimateMeta,
            height: 70,
            props: {
                styles: metaPdfStyles,
                currency_abv: currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv,
                currency_conversion_rate: estimate?.currency_conversion_rate,
                subject: estimate?.subject
            }
        },
        ...(estimate?.line_items || []).map((item, index) => {
            const taxItem = taxRates?.find((tax) => tax.tax_rate_id === item.tax_id);
            return {
                component: LineItem,
                height: item.description ? 60 : 40,
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
            component: EstimateBank,
            height: ((user?.clientInfo?.other_bank_accounts || []).length + 1) * 75,
            props: {
                styles: bankPdfStyles,
                primary_bank: user?.clientInfo?.primary_bank,
                other_bank_accounts: user?.clientInfo?.other_bank_accounts,
                currency_abv: currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv,
                subTotal: subTotal,
                discount: discount,
                tax: tax,
                total: total,
            }
        },
        {
            component: EstimateTax,
            height: 150,
            props: {
                styles: taxPdfStyles,
                currency_abv: currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv,
                currency_conversion_rate: estimate?.currency_conversion_rate,
                subTotal: subTotal,
                discount: discount,
                tax: tax,
                total: total,
                groupedItems: groupedItems,
                terms_and_conditions: estimate?.terms_and_conditions
            }
        }
    ];

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
                    <PdfDownload contents={contents} heading={"Estimate"} />
                </div>
            </div>
            <div className="read__estimate__container">
                {loading ? <Loader /> :
                    <div className="read__estimate--main" id="read__estimate--main">
                        <div className="read__estimate--top">
                            <img style={{ width: "9rem" }} src={logo} alt="logo" />
                            <h1 className='read__estimate--head'>Estimate</h1>
                        </div>
                        <EstimateHead styles={headStyles} address_line_1={user?.clientInfo?.company_data?.address_line_1} address_line_2={user?.clientInfo?.company_data?.address_line_2} address_line_3={user?.clientInfo?.company_data?.address_line_3} company_name={user?.clientInfo?.company_data?.company_name} country={user?.clientInfo?.company_data?.country} state={user?.clientInfo?.company_data?.state} trade_license_number={user?.clientInfo?.company_data?.trade_license_number} estimate_number={estimate?.estimate_number} estimate_date={estimate?.estimate_date} valid_till={estimate?.valid_till} reference={estimate?.reference} />
                        <EstimateFor styles={forStyles} customer_name={estimate?.customer?.customer_name} billing_address_line_1={estimate?.customer?.billing_address_line_1} billing_address_line_2={estimate?.customer?.billing_address_line_2} billing_address_line_3={estimate?.customer?.billing_address_line_3} billing_state={estimate?.customer?.billing_state} billing_country={estimate?.customer?.billing_country} shipping_address_line_1={estimate?.customer?.shipping_address_line_1} shipping_address_line_2={estimate?.customer?.shipping_address_line_2} shipping_address_line_3={estimate?.customer?.shipping_address_line_3} shipping_state={estimate?.customer?.shipping_state} shipping_country={estimate?.customer?.shipping_country} trn={estimate?.customer?.trn} />
                        <EstimateMeta styles={metaStyles} currency_abv={currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv} currency_conversion_rate={estimate?.currency_conversion_rate} subject={estimate?.subject} />
                        <div className='read__estimate__items'>
                            {estimate?.line_items?.map((item, index) => (
                                <LineItem styles={lineItemStyles} key={index} index={index}
                                    item_name={item?.item_name} unit={item?.unit} qty={item?.qty} rate={item?.rate}
                                    discount={item?.discount} is_percentage_discount={item?.is_percentage_discount}
                                    tax_id={item?.tax_id} taxRateName={taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                    taxAmount={itemTax && itemTax[index]} amount={itemTotal && itemTotal[index]}
                                    description={item?.description}
                                />
                            ))}
                        </div>
                        <EstimateBank styles={bankStyles} currency_abv={currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv}
                            primary_bank={user?.clientInfo?.primary_bank}
                            other_bank_accounts={user?.clientInfo?.other_bank_accounts}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                        />
                        <EstimateTax styles={taxStyles} currency_abv={currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv}
                            currency_conversion_rate={estimate?.currency_conversion_rate}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                            groupedItems={groupedItems} terms_and_conditions={estimate?.terms_and_conditions}
                        />
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
