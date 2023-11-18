import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './CreditNote.css'
import { Modal, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import errorIcon from '../../assets/Icons/error.svg';

import { deleteCreditNote, downloadCreditNoteList, getCreditNoteList, adjustCreditNoteAgainstInvoice } from '../../Actions/CreditNote';
import { readOpenTaxInvoicesForCustomer } from '../../Actions/TaxInvoice';
import { getCurrency } from '../../Actions/Onboarding';

import creditNoteColumns from '../../Columns/CreditNote';
import TableCard from '../../Shared/TableCard/TableCard';

const CreditNote = () => {
    const dispatch = useDispatch();
    const { error, loading, creditNotes } = useSelector(state => state.creditNoteReducer);
    const { loading: taxLoading, openTaxInvoices } = useSelector(state => state.taxInvoiceReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);

    const [invoiceList, setInvoiceList] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getCreditNoteList());
    }, [dispatch]);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAsjustModalOpen, setIsAsjustModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setRecord({});
    };

    const showAdjustModal = (record) => {
        setRecord(record);
        setIsAsjustModalOpen(true);
        dispatch(readOpenTaxInvoicesForCustomer(record.customer_id, record.currency_id));
    }

    const handleAdjustCancel = () => {
        setIsAsjustModalOpen(false);
        setRecord({});
        setInvoiceList([]);
    }

    const handleAdjust = (id) => {
        dispatch(adjustCreditNoteAgainstInvoice(id, { invoice_list: invoiceList }));
        setIsAsjustModalOpen(false);
        setInvoiceList([]);
    }

    const handleDelete = (id) => {
        dispatch(deleteCreditNote(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getCreditNoteList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getCreditNoteList());
        }
    }, [searchText]);

    const columns = creditNoteColumns(showModal, navigate, showAdjustModal, 0);
    return (
        <>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={400}
                className='creditNote__list--delete--modal'
            >
                <div className='creditNote__delete--modal'>
                    <img src={errorIcon} alt="error" />
                    <h1>Are you sure you?</h1>
                    <p>This action cannot be undone.</p>
                    <div className="delete__modal__buttons">
                        <button id='cancel' onClick={handleCancel}>Cancel</button>
                        <button id='confirm' onClick={() => handleDelete(record.cn_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={isAsjustModalOpen}
                onCancel={handleAdjustCancel}
                footer={null}
                width={400}
                className='creditNote__list--delete--modal'
            >
                <div className='creditNote__adjustModal'>
                    <h1>Open Tax Invoices</h1>
                    {
                        openTaxInvoices?.length > 0 ?
                            taxLoading ? <LoadingOutlined /> :
                                openTaxInvoices?.map((invoice) => (
                                    <div className='creditNote__adjustModal-data' key={invoice?.invoice_id}>
                                        <div>
                                            <input
                                                className='margin-right-07'
                                                type="checkbox"
                                                checked={invoiceList?.find((invoiceId) => invoiceId === invoice?.invoice_id) ? true : false}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setInvoiceList((prev) => prev?.concat(invoice?.invoice_id));
                                                    }
                                                    else {
                                                        setInvoiceList((prev) => prev.filter((invoiceId) => invoiceId !== invoice?.invoice_id));
                                                    }
                                                }}
                                            />
                                            <span>{invoice?.invoice_number}</span>
                                        </div>
                                        <span>
                                            {currencies?.find((currency) => currency.currency_id === invoice?.currency_id)?.currency_abv} &nbsp;
                                            {invoice?.balance_due}
                                        </span>
                                    </div>
                                )) :
                            <span className='no_data_present'>No open invoices</span>
                    }
                    <div className="delete__modal__buttons">
                        <button id='cancel' onClick={handleAdjustCancel}>Cancel</button>
                        <button id='confirm' onClick={() => handleAdjust(record.cn_id)}>Adjust</button>
                    </div>
                </div>
            </Modal>
            <div className='creditNote__header'>
                <div className='creditNote__header--left'>
                    <h1 className='creditNote__header--title'> Credit Notes </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='creditNote__header--right'>
                    <a className='creditNote__header--btn1' onClick={() => dispatch(downloadCreditNoteList())}>Download</a>
                    <a onClick={() => navigate("/credit-note/create")} className='creditNote__header--btn2'>Create Credit Note</a>
                </div>
            </div>
            <div className="table">
                <TableCard columns={columns} dispatch={dispatch} loading={loading} items={creditNotes} getList={getCreditNoteList} searchText={searchText} />
            </div>
        </>
    )
}

export default CreditNote;
