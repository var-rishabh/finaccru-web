import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProformaDetails, markProformaSent, markProformaVoid } from '../../../Actions/Proforma';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

import './ProformaRead.css'
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"

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
import ReadContent from '../../../utils/ReadContent';

const ProformaReadLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.userReducer);
    const pi_id = window.location.pathname.split('/')[3];
    const { loading, proforma } = useSelector(state => state.proformaReducer);
    const { taxRates } = useSelector(state => state.onboardingReducer);

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
    }, [dispatch, pi_id]);

    useEffect(() => {
        const amount = calculateTotalAmounts(proforma?.line_items, setSubTotal, setDiscount, setTax, setTotal, setItemTax, taxRates);
        setItemTotal(amount);
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

    const contents = ReadContent("Proforma", proforma, user, currencies, taxRates, itemTax, itemTotal, subTotal, discount, tax, total, groupedItems);

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
                    {
                        proforma?.pi_status === "Converted to TI" ? "" :
                            proforma?.pi_status === "Void" ? "" :
                                <a className='read__proforma__header--btn1' onClick={() => navigate(`/proforma/edit/${proforma?.pi_id}`)}>Edit</a>
                    }
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
                        <ReadHead
                            title={"Proforma"}
                            styles={headStyles}
                            address_line_1={user?.clientInfo?.company_data?.address_line_1}
                            address_line_2={user?.clientInfo?.company_data?.address_line_2}
                            address_line_3={user?.clientInfo?.company_data?.address_line_3}
                            company_name={user?.clientInfo?.company_data?.company_name}
                            country={user?.clientInfo?.company_data?.country}
                            state={user?.clientInfo?.company_data?.state}
                            trade_license_number={user?.clientInfo?.company_data?.trade_license_number}
                            number={proforma?.pi_number}
                            date={proforma?.pi_date}
                            due_date={proforma?.due_date}
                            reference={proforma?.reference}
                        />
                        <ReadFor
                            title={"Proforma"}
                            styles={forStyles}
                            customer_name={proforma?.customer?.customer_name}
                            billing_address_line_1={proforma?.customer?.billing_address_line_1}
                            billing_address_line_2={proforma?.customer?.billing_address_line_2}
                            billing_address_line_3={proforma?.customer?.billing_address_line_3}
                            billing_state={proforma?.customer?.billing_state}
                            billing_country={proforma?.customer?.billing_country}
                            shipping_address_line_1={proforma?.customer?.shipping_address_line_1}
                            shipping_address_line_2={proforma?.customer?.shipping_address_line_2}
                            shipping_address_line_3={proforma?.customer?.shipping_address_line_3}
                            shipping_state={proforma?.customer?.shipping_state}
                            shipping_country={proforma?.customer?.shipping_country}
                            trn={proforma?.customer?.trn}
                        />
                        <ReadMeta
                            styles={metaStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                            currency_conversion_rate={proforma?.currency_conversion_rate}
                            subject={proforma?.subject}
                        />
                        <div className='read__proforma__items'>
                            {proforma?.line_items?.map((item, index) => (
                                <LineItem styles={lineItemStyles} key={index} index={index}
                                    item_name={item?.item_name} unit={item?.unit} qty={item?.qty} rate={item?.rate}
                                    discount={item?.discount} is_percentage_discount={item?.is_percentage_discount}
                                    tax_id={item?.tax_id} taxRateName={taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                    taxAmount={itemTax && itemTax[index]} amount={itemTotal && itemTotal[index]}
                                    description={item?.description}
                                />
                            ))}
                        </div>
                        <ReadBank styles={bankStyles} currency_abv={currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                            primary_bank={user?.clientInfo?.primary_bank}
                            other_bank_accounts={user?.clientInfo?.other_bank_accounts}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                        />
                        <ReadTax styles={taxStyles} currency_abv={currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
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
