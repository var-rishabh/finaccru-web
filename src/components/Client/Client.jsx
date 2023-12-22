import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { readAccountantClient } from '../../Actions/Accountant';

import "./Client.css"
import { Modal, Switch, Tabs } from 'antd';

import Header from '../Accountant/Header/Header';
import TableCard from "../../Shared/TableCard/TableCard";

import { approveTaxInvoice, getTaxInvoiceList } from '../../Actions/TaxInvoice';
import { approvePayments, getPaymentsList } from '../../Actions/Payment';
import { approveCreditNote, getCreditNoteList } from '../../Actions/CreditNote';
import { approveBill, getBillList } from '../../Actions/Bill';
import { approveBillPayment, getBillPaymentList } from '../../Actions/BillPayment';
import { approveDebitNote, getDebitNoteList } from '../../Actions/DebitNote';

import taxInvoiceColumns from '../../Columns/TaxInvoice';
import paymentColumns from '../../Columns/Payment';
import creditNoteColumns from '../../Columns/CreditNote';
import billColumns from '../../Columns/Bill';
import billPaymentColumns from '../../Columns/BillPayment';
import debitNoteColumns from '../../Columns/DebitNote';

const Client = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, jr_id } = useParams();
    const { user } = useSelector(state => state.userReducer);

    const [showTaxInvoiceModal, setShowTaxInvoiceModal] = useState(false);
    const [showCreditNoteModal, setShowCreditNoteModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showBillModal, setShowBillModal] = useState(false);
    const [showBillPaymentModal, setShowBillPaymentModal] = useState(false);
    const [showDebitNoteModal, setShowDebitNoteModal] = useState(false);

    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [activeTab, setActiveTab] = useState("1"); // 1: payments, 2: tax invoices, 3: credit notes
    const [record, setRecord] = useState({});
    const [showAll, setShowAll] = useState(false); // false: pending, true: all

    const { client, loading } = useSelector(state => state.accountantReducer);
    const { taxInvoices, loading: taxInvoiceLoading } = useSelector(state => state.taxInvoiceReducer);
    const { payments, loading: paymentsLoading } = useSelector(state => state.paymentReducer);
    const { creditNotes, loading: creditNotesLoading } = useSelector(state => state.creditNoteReducer, id);
    const { bills, loading: billsLoading } = useSelector(state => state.billReducer);
    const { billPayments, loading: billPaymentsLoading } = useSelector(state => state.billPaymentReducer);
    const { debitNotes, loading: debitNotesLoading } = useSelector(state => state.debitNoteReducer);

    useEffect(() => {
        dispatch(readAccountantClient(id));
    }, [dispatch, id])

    useEffect(() => {
        if (activeTab === "1") {
            dispatch(getPaymentsList(1, "", 0, user?.localInfo?.role, id, showAll));
        } else if (activeTab === "2") {
            dispatch(getTaxInvoiceList(1, "", 0, user?.localInfo?.role, id, showAll));
        } else if (activeTab === "3") {
            dispatch(getCreditNoteList(1, "", 0, user?.localInfo?.role, id, showAll));
        } else if (activeTab === "4") {
            dispatch(getBillList(1, "", 0, user?.localInfo?.role, id, showAll));
        } else if (activeTab === "5") {
            dispatch(getBillPaymentList(1, "", 0, user?.localInfo?.role, id, showAll));
        } else if (activeTab === "6") {
            dispatch(getDebitNoteList(1, "", 0, user?.localInfo?.role, id, showAll));
        }
    }, [activeTab, dispatch, id, user?.localInfo?.role, showAll])

    const handleModalCancel = () => {
        if (activeTab === "1") {
            setShowPaymentModal(false);
        } else if (activeTab === "2") {
            setShowTaxInvoiceModal(false);
        } else if (activeTab === "3") {
            setShowCreditNoteModal(false);
        } else if (activeTab === "4") {
            setShowBillModal(false);
        } else if (activeTab === "5") {
            setShowBillPaymentModal(false);
        } else if (activeTab === "6") {
            setShowDebitNoteModal(false);
        }
    }

    const handleShowModal = (record) => {
        setRecord(record);
        if (activeTab === "1") {
            setShowPaymentModal(true);
        } else if (activeTab === "2") {
            setShowTaxInvoiceModal(true);
        } else if (activeTab === "3") {
            setShowCreditNoteModal(true);
        } else if (activeTab === "4") {
            setShowBillModal(true);
        } else if (activeTab === "5") {
            setShowBillPaymentModal(true);
        } else if (activeTab === "6") {
            setShowDebitNoteModal(true);
        }
    }

    const handleApprove = (record) => {
        if (activeTab === "1") {
            dispatch(approvePayments(record.receipt_id, user?.localInfo?.role, id));
            setShowPaymentModal(false);
        } else if (activeTab === "2") {
            dispatch(approveTaxInvoice(record.ti_id, user?.localInfo?.role, id));
            setShowTaxInvoiceModal(false);
        } else if (activeTab === "3") {
            dispatch(approveCreditNote(record.cn_id, user?.localInfo?.role, id,));
            setShowCreditNoteModal(false);
        } else if (activeTab === "4") {
            dispatch(approveBill(record.bill_id, user?.localInfo?.role, id));
            setShowBillModal(false);
        } else if (activeTab === "5") {
            dispatch(approveBillPayment(record.payment_id, user?.localInfo?.role, id));
            setShowBillPaymentModal(false);
        } else if (activeTab === "6") {
            dispatch(approveDebitNote(record.dn_id, user?.localInfo?.role, id));
            setShowDebitNoteModal(false);
        }
    }

    const taxInvoiceColumns2 = taxInvoiceColumns(handleShowModal, navigate, user?.localInfo?.role, id, jr_id);
    const creditNoteColumns2 = creditNoteColumns(handleShowModal, navigate, showAdjustModal, user?.localInfo?.role, id, jr_id);
    const paymentColumns2 = paymentColumns(handleShowModal, navigate, user?.localInfo?.role, id, jr_id);
    const billColumns2 = billColumns(handleShowModal, navigate, user?.localInfo?.role, id, jr_id);
    const billPaymentColumns2 = billPaymentColumns(handleShowModal, navigate, user?.localInfo?.role, id, jr_id);
    const debitNoteColumns2 = debitNoteColumns(handleShowModal, navigate, showAdjustModal, user?.localInfo?.role, id, jr_id);

    const items = [
        {
            key: '1',
            label: 'Payments',
            children: <TableCard columns={paymentColumns2} dispatch={dispatch} loading={paymentsLoading} items={payments} getList={getPaymentsList} showAll={showAll} />,
        },
        {
            key: '2',
            label: 'Tax Invoices',
            children: <TableCard columns={taxInvoiceColumns2} dispatch={dispatch} loading={taxInvoiceLoading} items={taxInvoices} getList={getTaxInvoiceList} showAll={showAll} />,
        },
        {
            key: '3',
            label: 'Credit Notes',
            children: <TableCard columns={creditNoteColumns2} dispatch={dispatch} loading={creditNotesLoading} items={creditNotes} getList={getCreditNoteList} showAll={showAll} />,
        },
        {
            key: '4',
            label: 'Bills',
            children: <TableCard columns={billColumns2} dispatch={dispatch} loading={billsLoading} items={bills} getList={getBillList} showAll={showAll} />,
        },
        {
            key: '5',
            label: 'Bill Payments',
            children: <TableCard columns={billPaymentColumns2} dispatch={dispatch} loading={billPaymentsLoading} items={billPayments} getList={getBillPaymentList} showAll={showAll} />,
        },
        {
            key: '6',
            label: 'Debit Notes',
            children: <TableCard columns={debitNoteColumns2} dispatch={dispatch} loading={debitNotesLoading} items={debitNotes} getList={getDebitNoteList} showAll={showAll} />,
        },
    ];

    return (
        <div className='client__body'>
            <Modal
                open={activeTab === "1"
                    ? showPaymentModal : activeTab === "2"
                        ? showTaxInvoiceModal : activeTab === "3"
                            ? showCreditNoteModal : activeTab === "4"
                                ? showBillModal : activeTab === "5"
                                    ? showBillPaymentModal : showDebitNoteModal
                }
                onCancel={handleModalCancel}
                footer={null}
                width={450}
                className='payment__list--delete--modal'
            >
                <div className='payment__delete--modal'>
                    <h1>Approve {
                        activeTab === "1" ? "Payment"
                            : activeTab === "2" ? "Tax Invoice"
                                : activeTab === "3" ? "Credit Note"
                                    : activeTab === "4" ? "Bill"
                                        : activeTab === "5" ? "Bill Payment"
                                            : "Debit Note"
                    } ?</h1>
                    <p>This action cannot be undone.</p>
                    <div className="delete__modal__buttons">
                        <button id='cancel' onClick={handleModalCancel}>Reject</button>
                        <button id='confirm' onClick={() => handleApprove(record)}>Approve</button>
                    </div>
                </div>
            </Modal>
            <Header headerFor={client} backNeeded={true} backFor={user?.localInfo?.role} backId={id} backJrId={jr_id} />
            <div className='clients__tabs'>
                <div className='client__switch'>
                    <Switch checkedChildren="All" unCheckedChildren="Pending" onChange={(e) => setShowAll(e)} />
                </div>
                <Tabs defaultActiveKey="1" items={items} activeKey={activeTab} onChange={(key) => setActiveTab(key)} />
            </div>
        </div>
    )
}

export default Client;
