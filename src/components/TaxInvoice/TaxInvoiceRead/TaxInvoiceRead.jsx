import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTaxInvoiceDetails, markTaxInvoiceVoid, submitTaxInvoiceForApproval } from '../../../Actions/TaxInvoice';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

import './TaxInvoiceRead.css'
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
import DueAmountCard from '../../../Shared/DueAmountCard/DueAmountCard';

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

const TaxInvoiceReadLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.userReducer);
    const ti_id = window.location.pathname.split('/')[3];
    const { loading, taxInvoice } = useSelector(state => state.taxInvoiceReducer);
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
        dispatch(getTaxInvoiceDetails(ti_id));
    }, [dispatch, ti_id]);

    useEffect(() => {
        const amount = calculateTotalAmounts(taxInvoice?.line_items, setSubTotal, setDiscount, setTax, setTotal, setItemTax, taxRates);
        setItemTotal(amount);
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

    const contents = ReadContent("Tax Invoice", taxInvoice, user, currencies, taxRates, itemTax, itemTotal, subTotal, discount, tax, total, groupedItems);

    return (
        <>
            <div className='read__taxInvoice__header'>
                <div className='read__taxInvoice__header--left'>
                    <img src={backButton} alt='back' className='read__taxInvoice__header--back-btn' onClick={() => navigate("/tax-invoice")} />
                    <h1 className='read__taxInvoice__header--title'> Tax Invoices List </h1>
                </div>
                <div className='read__taxInvoice__header--right'>
                    {
                        taxInvoice?.ti_status === "Approved" || taxInvoice?.ti_status === "Void" ? "" :
                            taxInvoice?.ti_status === "Pending Approval" ?
                                <>
                                    <a className='read__taxInvoice__header--btn1'
                                        onClick={() => {
                                            dispatch(markTaxInvoiceVoid(window.location.pathname.split('/')[3]))
                                        }}
                                    >Mark as Void</a>
                                    <a className='read__taxInvoice__header--btn1'
                                        onClick={() => navigate(`/tax-invoice/edit/${taxInvoice?.ti_id}`)}
                                    >Edit</a>
                                </> :
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
                                    <a className='read__taxInvoice__header--btn1'
                                        onClick={() => navigate(`/tax-invoice/edit/${taxInvoice?.ti_id}`)}
                                    >Edit</a>
                                </>
                    }
                    <PdfDownload contents={contents} heading={"Tax Invoice"} />
                </div>
            </div>
            <div className="read__taxInvoice__container">
                {loading ? <Loader /> :
                    <div className="read__taxInvoice--main" id="read__taxInvoice--main">
                        <div className="read__taxInvoice--top">
                            <img style={{ width: "9rem" }} src={logo} alt="logo" />
                            <h1 className='read__taxInvoice--head'>Tax Invoice</h1>
                        </div>
                        <ReadHead
                            title={"Tax Invoice"}
                            styles={headStyles}
                            address_line_1={user?.clientInfo?.company_data?.address_line_1}
                            address_line_2={user?.clientInfo?.company_data?.address_line_2}
                            address_line_3={user?.clientInfo?.company_data?.address_line_3}
                            company_name={user?.clientInfo?.company_data?.company_name}
                            country={user?.clientInfo?.company_data?.country}
                            state={user?.clientInfo?.company_data?.state}
                            trade_license_number={user?.clientInfo?.company_data?.trade_license_number}
                            number={taxInvoice?.ti_number}
                            date={taxInvoice?.ti_date}
                            due_date={taxInvoice?.due_date}
                            reference={taxInvoice?.reference}
                        />
                        <ReadFor
                            title={"Tax Invoice"}
                            styles={forStyles}
                            customer_name={taxInvoice?.customer?.customer_name}
                            billing_address_line_1={taxInvoice?.customer?.billing_address_line_1}
                            billing_address_line_2={taxInvoice?.customer?.billing_address_line_2}
                            billing_address_line_3={taxInvoice?.customer?.billing_address_line_3}
                            billing_state={taxInvoice?.customer?.billing_state}
                            billing_country={taxInvoice?.customer?.billing_country}
                            shipping_address_line_1={taxInvoice?.customer?.shipping_address_line_1}
                            shipping_address_line_2={taxInvoice?.customer?.shipping_address_line_2}
                            shipping_address_line_3={taxInvoice?.customer?.shipping_address_line_3}
                            shipping_state={taxInvoice?.customer?.shipping_state}
                            shipping_country={taxInvoice?.customer?.shipping_country}
                            trn={taxInvoice?.customer?.trn}
                        />
                        <ReadMeta
                            styles={metaStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv}
                            currency_conversion_rate={taxInvoice?.currency_conversion_rate}
                            subject={taxInvoice?.subject}
                        />
                        <div className='read__taxInvoice__items'>
                            {taxInvoice?.line_items?.map((item, index) => (
                                <LineItem styles={lineItemStyles} key={index} index={index}
                                    item_name={item?.item_name} unit={item?.unit} qty={item?.qty} rate={item?.rate}
                                    discount={item?.discount} is_percentage_discount={item?.is_percentage_discount}
                                    tax_id={item?.tax_id} taxRateName={taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                    taxAmount={itemTax && itemTax[index]} amount={itemTotal && itemTotal[index]}
                                    description={item?.description}
                                />
                            ))}
                        </div>
                        <ReadBank styles={bankStyles} currency_abv={currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv}
                            primary_bank={user?.clientInfo?.primary_bank}
                            other_bank_accounts={user?.clientInfo?.other_bank_accounts}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                        />
                        <ReadTax styles={taxStyles} currency_abv={currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv}
                            currency_conversion_rate={taxInvoice?.currency_conversion_rate}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                            groupedItems={groupedItems} terms_and_conditions={taxInvoice?.terms_and_conditions}
                        />
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
            <DueAmountCard title={"Tax Invoice"} due_amount={taxInvoice?.due_amount}
                currency_abv={currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv}
                linked_item1={taxInvoice?.linked_receipts} linked_item2={taxInvoice?.linked_credit_notes}
            />
        </>
    )
}

export default TaxInvoiceReadLayout;
