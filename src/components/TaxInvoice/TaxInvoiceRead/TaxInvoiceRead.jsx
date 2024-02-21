import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setChatDocument } from '../../../Actions/Chat';
import { getTaxInvoiceDetails, markTaxInvoiceVoid, submitTaxInvoiceForApproval, approveTaxInvoice, getExtractedTaxInvoiceDetails } from '../../../Actions/TaxInvoice';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';

import Loader from '../../Loader/Loader';
import { LoadingOutlined } from '@ant-design/icons';

import '../../../Styles/Read.css';
import backButton from "../../../assets/Icons/back.svg";

import DueAmountCard from '../../../Shared/DueAmountCard/DueAmountCard';
import PdfDownload from '../../../Shared/PdfDownload/PdfDownload';

// Read Parts
import ReadHead from '../../../Shared/ReadHead/ReadHead';
import { styles as headStyles } from '../../../Styles/ReadHead';
import ReadFor from '../../../Shared/ReadFor/ReadFor';
import { styles as forStyles } from '../../../Styles/ReadFor';
import ReadMeta from '../../../Shared/ReadMeta/ReadMeta';
import { styles as metaStyles } from '../../../Styles/ReadMeta';
import LineItem from '../../../Shared/LineItem/LineItem';
import { styles as lineItemStyles } from '../../../Styles/LineItem';
import ReadBank from '../../../Shared/ReadBank/ReadBank';
import { styles as bankStyles } from '../../../Styles/ReadBank';
import ReadTax from '../../../Shared/ReadTax/ReadTax';
import { styles as taxStyles } from '../../../Styles/ReadTax';

import calculateTotalAmounts from '../../../utils/calculateTotalAmounts';
import ReadContent from '../../../utils/ReadContent';

import ViewHeader from '../../../Shared/ViewHeader/ViewHeader';
import ViewFooter from '../../../Shared/ViewFooter/ViewFooter';

import { readAccountantClient } from '../../../Actions/Accountant';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const TaxInvoiceReadLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const { loading, taxInvoice, extractedTaxInvoice } = useSelector(state => state.taxInvoiceReducer);
    const { taxRates } = useSelector(state => state.onboardingReducer);

    const ti_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;
    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);
    const [groupedItems, setGroupedItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const { currencies } = useSelector(state => state.onboardingReducer);

    const searchParams = new URLSearchParams(window.location.search);
    const extracted = searchParams.get('extracted');

    const finalTaxInvoice = extracted ? extractedTaxInvoice : taxInvoice;

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        if (extracted) {
            dispatch(getExtractedTaxInvoiceDetails(ti_id, user?.localInfo?.role));
        } else {
            dispatch(getTaxInvoiceDetails(ti_id, user?.localInfo?.role));
        }
        if (user?.localInfo?.role) {
            dispatch(readAccountantClient(client_id));
        }
    }, [dispatch, ti_id, client_id, user?.localInfo?.role]);

    useEffect(() => {
        const amount = calculateTotalAmounts(finalTaxInvoice?.line_items, setSubTotal, setDiscount, setTax, setTotal, setItemTax, taxRates);
        setItemTotal(amount);
    }, [finalTaxInvoice, taxRates]);

    useEffect(() => {
        const groupedByTaxId = finalTaxInvoice?.line_items?.reduce((acc, item, index) => {
            const existingGroup = acc.find((group) => group.tax_id === item.tax_id);
            if (existingGroup) {
                existingGroup.taxable_amount += (itemTotal?.at(index) - itemTax?.at(index));
                existingGroup.tax_amount += (itemTax?.at(index));
                existingGroup.total_amount += (itemTotal?.at(index));
            } else {
                const taxItem = taxRates?.find((tr) => tr.tax_rate_id === item.tax_id);
                acc.push({
                    tax_id: item.tax_id,
                    tax_rate_name: taxItem?.tax_rate_name,
                    taxable_amount: (itemTotal?.at(index) - itemTax?.at(index)),
                    tax_amount: (itemTax?.at(index)),
                    total_amount: (itemTotal?.at(index)),
                });
            }
            return acc;
        }, []);

        setGroupedItems(groupedByTaxId);
    }, [itemTotal, itemTax, finalTaxInvoice, taxRates]);

    const [clientData, setClientData] = useState({});
    useEffect(() => {
        if (user?.localInfo?.role) {
            setClientData({ clientInfo: client });
        } else {
            setClientData(user);
        }
    }, [user, client]);
    useEffect(() => {
        dispatch(setChatDocument({ id: finalTaxInvoice?.ti_id, number: finalTaxInvoice?.ti_number }));
        return () => {
            dispatch({ type: "RemoveChatDocument" });
        }
    }, [dispatch, finalTaxInvoice])

    const contents = ReadContent("Tax Invoice", finalTaxInvoice, clientData, currencies, taxRates, itemTax, itemTotal, subTotal, discount, tax, total, groupedItems);
    // PDF Logic
    const [pdfError, setPdfError] = useState(null);
    const [pdfPages, setPdfPages] = useState(null);
    const [pdfPage, setPdfPage] = useState(1);
    const [pdfScale, setPdfScale] = useState(1.5);
    const [pdfRotation, setPdfRotation] = useState(0);
    const onDocumentLoadSuccess = ({ numPages }) => {
        setPdfPages(numPages);
    }

    const onError = (error) => {
        setPdfError(error.message);
    }

    const onPageChange = (page) => {
        if (page < 1 || page > pdfPages) return;
        setPdfPage(page);
    }
    return (
        <>
            <div className='read__header'>
                <div className='read__header--left'>
                    <img src={backButton} alt='back' className='read__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/tax-invoice"}`)} />
                    <h1 className='read__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Tax Invoices List'}
                    </h1>
                </div>
                <div className='read__header--right'>
                    {
                        user?.localInfo?.role ?
                            <>
                                <a className='read__header--btn1'
                                    onClick={() => {
                                        navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : ""}/tax-invoice/edit/${extracted ? ti_id : finalTaxInvoice?.ti_id}${extracted ? "?extracted=true" : ""}`)
                                    }}
                                >Edit</a>
                                {
                                    finalTaxInvoice?.ti_status === "Pending Approval" && !extracted ?
                                        <a className='read__header--btn2'
                                            onClick={() => {
                                                dispatch(approveTaxInvoice(ti_id, user?.localInfo?.role, client_id))
                                            }}
                                        >Approve</a> : ""
                                }
                            </> :
                            finalTaxInvoice?.ti_status === "Approved" || finalTaxInvoice?.ti_status === "Void" ? "" :
                                finalTaxInvoice?.ti_status === "Pending Approval" ?
                                    <>
                                        <a className='read__header--btn1'
                                            onClick={() => {
                                                dispatch(markTaxInvoiceVoid(ti_id))
                                            }}
                                        >Mark as Void</a>
                                        <a className='read__header--btn1'
                                            onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : ""}/tax-invoice/edit/${finalTaxInvoice?.ti_id}`)}
                                        >Edit</a>
                                    </> :
                                    <>
                                        <a className='read__header--btn1'
                                            onClick={() => {
                                                dispatch(submitTaxInvoiceForApproval(ti_id))
                                            }}
                                        >Submit for Approval</a>
                                        <a className='read__header--btn1'
                                            onClick={() => {
                                                dispatch(markTaxInvoiceVoid(ti_id))
                                            }}
                                        >Mark as Void</a>
                                        <a className='read__header--btn1'
                                            onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : ""}/tax-invoice/edit/${finalTaxInvoice?.ti_id}`)}
                                        >Edit</a>
                                    </>
                    }
                    <PdfDownload contents={contents} heading={"Tax Invoice"} name={finalTaxInvoice?.ti_number} />
                </div>
            </div>
            <div className="read__container">
                {loading ? <Loader /> :
                    <div className="read--main" id="read--main">
                        <ViewHeader title={"Tax Invoice"} />
                        <ReadHead
                            title={"Tax Invoice"}
                            styles={headStyles}
                            address_line_1={user?.localInfo?.role ? client?.company_data?.address_line_1 : user?.clientInfo?.company_data?.address_line_1}
                            address_line_2={user?.localInfo?.role ? client?.company_data?.address_line_2 : user?.clientInfo?.company_data?.address_line_2}
                            address_line_3={user?.localInfo?.role ? client?.company_data?.address_line_3 : user?.clientInfo?.company_data?.address_line_3}
                            company_name={user?.localInfo?.role ? client?.company_data?.company_name : user?.clientInfo?.company_data?.company_name}
                            country={user?.localInfo?.role ? client?.company_data?.country : user?.clientInfo?.company_data?.country}
                            state={user?.localInfo?.role ? client?.company_data?.state : user?.clientInfo?.company_data?.state}
                            trade_license_number={user?.localInfo?.role ? client?.company_data?.trade_license_number : user?.clientInfo?.company_data?.trade_license_number}
                            number={finalTaxInvoice?.ti_number}
                            date={finalTaxInvoice?.ti_date}
                            due_date={finalTaxInvoice?.due_date}
                            reference={finalTaxInvoice?.reference}
                        />
                        <ReadFor
                            title={"Tax Invoice"}
                            styles={forStyles}
                            customer_name={finalTaxInvoice?.customer?.customer_name}
                            billing_address_line_1={finalTaxInvoice?.customer?.billing_address_line_1}
                            billing_address_line_2={finalTaxInvoice?.customer?.billing_address_line_2}
                            billing_address_line_3={finalTaxInvoice?.customer?.billing_address_line_3}
                            billing_state={finalTaxInvoice?.customer?.billing_state}
                            billing_country={finalTaxInvoice?.customer?.billing_country}
                            shipping_address_line_1={finalTaxInvoice?.customer?.shipping_address_line_1}
                            shipping_address_line_2={finalTaxInvoice?.customer?.shipping_address_line_2}
                            shipping_address_line_3={finalTaxInvoice?.customer?.shipping_address_line_3}
                            shipping_state={finalTaxInvoice?.customer?.shipping_state}
                            shipping_country={finalTaxInvoice?.customer?.shipping_country}
                            trn={finalTaxInvoice?.customer?.trn}
                        />
                        <ReadMeta
                            styles={metaStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === finalTaxInvoice?.currency_id)?.currency_abv}
                            currency_conversion_rate={finalTaxInvoice?.currency_conversion_rate}
                            subject={finalTaxInvoice?.subject}
                        />
                        <div className='read__items'>
                            {finalTaxInvoice?.line_items?.map((item, index) => (
                                <LineItem styles={lineItemStyles} key={index} index={index}
                                    item_name={item?.item_name} unit={item?.unit} qty={item?.qty} rate={item?.rate}
                                    discount={item?.discount} is_percentage_discount={item?.is_percentage_discount}
                                    tax_id={item?.tax_id} taxRateName={taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                    taxAmount={itemTax && itemTax[index]} amount={itemTotal && itemTotal[index]}
                                    description={item?.description}
                                />
                            ))}
                        </div>
                        <ReadBank
                            styles={bankStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === finalTaxInvoice?.currency_id)?.currency_abv}
                            primary_bank={user?.clientInfo?.primary_bank}
                            other_bank_accounts={user?.clientInfo?.other_bank_accounts}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                        />
                        <ReadTax
                            styles={taxStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === finalTaxInvoice?.currency_id)?.currency_abv}
                            currency_conversion_rate={finalTaxInvoice?.currency_conversion_rate}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                            groupedItems={groupedItems} terms_and_conditions={finalTaxInvoice?.terms_and_conditions}
                        />
                        <ViewFooter />
                    </div>
                }
            </div>
            <DueAmountCard title={"Tax Invoice"} due_amount={finalTaxInvoice?.due_amount}
                currency_abv={currencies?.find((currency) => currency.currency_id === finalTaxInvoice?.currency_id)?.currency_abv}
                linked_item1={finalTaxInvoice?.linked_receipts} linked_item2={finalTaxInvoice?.linked_credit_notes}
            />
            {
                extracted &&
                <div className='pdf__viewer-main'>
                    <div className="pdf__viewer">
                        <Document file={extractedTaxInvoice?.attachment_url.replace(extractedTaxInvoice?.attachment_url.split('/').slice(0, 3).join("/"), '')} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onError} loading={<LoadingOutlined />}>
                            <Page pageNumber={pdfPage} scale={pdfScale} rotate={pdfRotation} renderAnnotationLayer={false} renderTextLayer={false} />
                        </Document>
                        {pdfError && <div className='pdf__viewer--error'>{pdfError}</div>}
                        {pdfError && <a href={extractedTaxInvoice?.attachment_url} target='_blank' rel='noreferrer' className='pdf__viewer--error'>Download</a>}
                    </div>
                    {pdfPages && <div className='pdf__viewer--controls'>
                        <button onClick={() => onPageChange(pdfPage - 1)} disabled={pdfPage === 1}>Previous</button>
                        <span>{pdfPage} of {pdfPages}</span>
                        <button onClick={() => onPageChange(pdfPage + 1)} disabled={pdfPage === pdfPages}>Next</button>
                    </div>}
                </div>
            }
        </>
    )
}

export default TaxInvoiceReadLayout;
