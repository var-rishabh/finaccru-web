import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Actions
import { getEstimateDetails, markEstimateSent, markEstimateVoid } from '../../../Actions/Estimate';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

// Styles
import './EstimateRead.css'
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"

// Pdf Download Button
import PdfDownload from '../../../Shared/PdfDownload/PdfDownload';

// Read Parts
import ReadHead from '../../../Shared/ReadHead/ReadHead';
import { pdfStyle as headPdfStyle, styles as headStyles } from '../../../Styles/ReadHead';
import ReadFor from '../../../Shared/ReadFor/ReadFor';
import { styles as forStyles, pdfStyle as forPdfStyles } from '../../../Styles/ReadFor';
import ReadMeta from '../../../Shared/ReadMeta/ReadMeta';
import { styles as metaStyles, pdfStyle as metaPdfStyles } from '../../../Styles/ReadMeta';
import LineItem from '../../../Shared/LineItem/LineItem';
import { styles as lineItemStyles, pdfStyle as lineItemPdfStyles } from '../../../Styles/LineItem';
import ReadBank from '../../../Shared/ReadBank/ReadBank';
import { styles as bankStyles, pdfStyle as bankPdfStyles } from '../../../Styles/ReadBank';
import ReadTax from '../../../Shared/ReadTax/ReadTax';
import { styles as taxStyles, pdfStyle as taxPdfStyles } from '../../../Styles/ReadTax';
import calculateTotalAmounts from '../../../utils/calculateTotalAmounts';

const EstimateReadLayout = () => {

    const estimate_id = window.location.pathname.split('/')[3];
    
    const navigate = useNavigate();
    const { user } = useSelector(state => state.userReducer);
    const { loading, estimate } = useSelector(state => state.estimateReducer);
    const { taxRates } = useSelector(state => state.onboardingReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);
    const dispatch = useDispatch();

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);
    const [groupedItems, setGroupedItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getEstimateDetails(estimate_id));
    }, [dispatch]);


    useEffect(() => {
        const amount = calculateTotalAmounts(estimate?.line_items, setSubTotal, setDiscount, setTax, setTotal, setItemTax, taxRates);
        setItemTotal(amount);
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
            component: ReadHead,
            height: 90,
            props: {
                title: "Estimate",
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
            component: ReadFor,
            height: 90,
            props: {
                title: "Estimate",
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
            component: ReadMeta,
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
            component: ReadBank,
            height: ((user?.clientInfo?.other_bank_accounts || []).length) * 55 + 80,
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
            component: ReadTax,
            height: 120,
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
                    {
                        estimate?.estimate_status === "Converted to PI/TI" ? "" :
                            estimate?.estimate_status === "Void" ? "" :
                                <a className='read__estimate__header--btn1' onClick={() => navigate(`/estimate/edit/${estimate?.estimate_id}`)}>Edit</a>
                    }
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
                        <ReadHead  title={"Estimate"}  styles={headStyles} address_line_1={user?.clientInfo?.company_data?.address_line_1} address_line_2={user?.clientInfo?.company_data?.address_line_2} address_line_3={user?.clientInfo?.company_data?.address_line_3} company_name={user?.clientInfo?.company_data?.company_name} country={user?.clientInfo?.company_data?.country} state={user?.clientInfo?.company_data?.state} trade_license_number={user?.clientInfo?.company_data?.trade_license_number} estimate_number={estimate?.estimate_number} estimate_date={estimate?.estimate_date} valid_till={estimate?.valid_till} reference={estimate?.reference} />
                        <ReadFor title={"Estimate"} styles={forStyles} customer_name={estimate?.customer?.customer_name} billing_address_line_1={estimate?.customer?.billing_address_line_1} billing_address_line_2={estimate?.customer?.billing_address_line_2} billing_address_line_3={estimate?.customer?.billing_address_line_3} billing_state={estimate?.customer?.billing_state} billing_country={estimate?.customer?.billing_country} shipping_address_line_1={estimate?.customer?.shipping_address_line_1} shipping_address_line_2={estimate?.customer?.shipping_address_line_2} shipping_address_line_3={estimate?.customer?.shipping_address_line_3} shipping_state={estimate?.customer?.shipping_state} shipping_country={estimate?.customer?.shipping_country} trn={estimate?.customer?.trn} />
                        <ReadMeta styles={metaStyles} currency_abv={currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv} currency_conversion_rate={estimate?.currency_conversion_rate} subject={estimate?.subject} />
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
                        <ReadBank styles={bankStyles} currency_abv={currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv}
                            primary_bank={user?.clientInfo?.primary_bank}
                            other_bank_accounts={user?.clientInfo?.other_bank_accounts}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                        />
                        <ReadTax styles={taxStyles} currency_abv={currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv}
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
