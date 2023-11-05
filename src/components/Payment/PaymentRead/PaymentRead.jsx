import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentsDetails, submitPaymentsForApproval, markPaymentsVoid } from '../../../Actions/Payment';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

import './PaymentRead.css'
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"

import PdfDownload from '../../../Shared/PdfDownload/PdfDownload';
import { ToWords } from 'to-words';

import PaymentHead from './Parts/PaymentHead';
import { pdfStyle as headPdfStyle, styles as headStyles } from '../../../Styles/ReadHead';
import PaymentFor from './Parts/PaymentFor';
import { pdfStyle as forPdfStyles, styles as forStyles } from '../../../Styles/ReadForPayment';
import PaymentMeta from './Parts/PaymentMeta';
import { pdfStyle as metaPdfStyles, styles as metaStyles } from '../../../Styles/ReadMetaPayment';

const PaymentReadLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.userReducer);
    const payment_id = window.location.pathname.split('/')[3];
    const { loading, payment } = useSelector(state => state.paymentReducer);

    const { currencies } = useSelector(state => state.onboardingReducer);

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getPaymentsDetails(payment_id));
    }, [dispatch, payment_id]);

    const toWords = new ToWords({
        localeCode: 'en-US',
        converterOptions: {
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
        }
    });

    const contents = [
        {
            component: PaymentHead,
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
                payment_number: payment?.receipt_number,
                payment_date: payment?.receipt_date,
            }
        },
        {
            component: PaymentFor,
            height: ((payment?.invoice_mappings || []).length) * 35 + 10,
            props: {
                styles: forPdfStyles,
                customer_name: payment?.customer?.customer_name,
                billing_address_line_1: payment?.customer?.billing_address_line_1,
                billing_address_line_2: payment?.customer?.billing_address_line_2,
                billing_address_line_3: payment?.customer?.billing_address_line_3,
                billing_state: payment?.customer?.billing_state,
                billing_country: payment?.customer?.billing_country,
                trn: payment?.customer?.trn,
                invoice_mappings: payment?.invoice_mappings,
                total_amount: payment?.total_amount,
                amount_in_words: toWords.convert(payment?.total_amount ?? 0),
                currency_abv: currencies?.find((currency) => currency.currency_id === payment?.currency_id)?.currency_abv
            }
        },
        {
            component: PaymentMeta,
            height: 150,
            props: {
                styles: metaPdfStyles,
                currency_abv: currencies?.find((currency) => currency.currency_id === payment?.currency_id)?.currency_abv,
                currency_conversion_rate: payment?.currency_conversion_rate,
                subject: payment?.subject,
                bank_id: payment?.bank_id === 0 ? "Cash" :
                    payment?.bank_id === user?.clientInfo?.primary_bank?.bank_id ? user?.clientInfo?.primary_bank?.bank_name :
                        user?.clientInfo?.other_bank_accounts?.find((bank) => bank.bank_id === payment?.bank_id)?.bank_name,
            }
        }
    ];

    return (
        <>
            <div className='read__payment__header'>
                <div className='read__payment__header--left'>
                    <img src={backButton} alt='back' className='read__payment__header--back-btn' onClick={() => navigate("/payment")} />
                    <h1 className='read__payment__header--title'> Payments List </h1>
                </div>
                <div className='read__payment__header--right'>
                    {
                        payment?.receipt_status === "Draft" ?
                            <>
                                <a className='read__payment__header--btn1'
                                    onClick={() => {
                                        dispatch(submitPaymentsForApproval(window.location.pathname.split('/')[3]))
                                    }}
                                >Submit for Approval</a>
                                <a className='read__payment__header--btn1'
                                    onClick={() => {
                                        dispatch(markPaymentsVoid(window.location.pathname.split('/')[3]))
                                    }}
                                >Mark as Void</a>
                            </>
                            : payment?.receipt_status === "Pending Approval" ? <>
                                <a className='read__payment__header--btn1'
                                    onClick={() => {
                                        dispatch(markPaymentsVoid(window.location.pathname.split('/')[3]))
                                    }}
                                >Mark as Void</a>
                            </> : ""
                    }
                    {
                        payment?.receipt_status === "Void" ? "" :
                            <a className='read__payment__header--btn1' onClick={() => navigate(`/payment/edit/${payment?.ti_id}`)}>Edit</a>
                    }
                    <PdfDownload contents={contents} heading={"Payment"} />
                </div>
            </div>
            <div className="read__payment__container">
                {loading ? <Loader /> :
                    <div className="read__payment--main" id="read__payment--main">
                        <div className="read__payment--top">
                            <img style={{ width: "9rem" }} src={logo} alt="logo" />
                            <h1 className='read__payment--head'>Receipt</h1>
                        </div>
                        <PaymentHead styles={headStyles} address_line_1={user?.clientInfo?.company_data?.address_line_1} address_line_2={user?.clientInfo?.company_data?.address_line_2} address_line_3={user?.clientInfo?.company_data?.address_line_3} company_name={user?.clientInfo?.company_data?.company_name} country={user?.clientInfo?.company_data?.country} state={user?.clientInfo?.company_data?.state} trade_license_number={user?.clientInfo?.company_data?.trade_license_number} payment_number={payment?.receipt_number} payment_date={payment?.receipt_date} />
                        <PaymentFor styles={forStyles} customer_name={payment?.customer?.customer_name} billing_address_line_1={payment?.customer?.billing_address_line_1} billing_address_line_2={payment?.customer?.billing_address_line_2} billing_address_line_3={payment?.customer?.billing_address_line_3} billing_state={payment?.customer?.billing_state} billing_country={payment?.customer?.billing_country} trn={payment?.customer?.trn}
                            invoice_mappings={payment?.invoice_mappings || []} total_amount={payment?.total_amount}
                            amount_in_words={toWords.convert(payment?.total_amount ?? 0)}
                            currency_abv={currencies?.find((currency) => currency.currency_id === payment?.currency_id)?.currency_abv}
                        />
                        <PaymentMeta styles={metaStyles} currency_abv={currencies?.find((currency) => currency.currency_id === payment?.currency_id)?.currency_abv} currency_conversion_rate={payment?.currency_conversion_rate} subject={payment?.subject}
                            bank_id={
                                payment?.bank_id === 0 ?
                                    "Cash" :
                                    payment?.bank_id === user?.clientInfo?.primary_bank?.bank_id ?
                                        user?.clientInfo?.primary_bank?.bank_name :
                                        user?.clientInfo?.other_bank_accounts?.find((bank) => bank.bank_id === payment?.bank_id)?.bank_name
                            }
                        />
                        <div className="read__payment__footer">
                            <img style={{ width: "5rem" }} src={logo} alt="logo" />
                            <div className='read__payment__footer--text'>
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

export default PaymentReadLayout;
