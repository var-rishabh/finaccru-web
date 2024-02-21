import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "./TaxInvoice.css";
import "../../Styles/MainPage.css";
import { Modal, Input, Divider } from 'antd';
import { ArrowRightOutlined, InboxOutlined, EyeOutlined } from '@ant-design/icons';
import errorIcon from '../../assets/Icons/error.svg';

import { deleteTaxInvoice, downloadTaxInvoiceList, extractDataFromTaxInvoice, getExtractedTaxInvoiceList, getTaxInvoiceList } from '../../Actions/TaxInvoice';
import taxInvoiceColumns from '../../Columns/TaxInvoice';
import TableCard from '../../Shared/TableCard/TableCard';

const TaxInvoice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, taxInvoices, extractedTaxInvoices } = useSelector(state => state.taxInvoiceReducer);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    useEffect(() => {
        dispatch(getTaxInvoiceList());
        dispatch(getExtractedTaxInvoiceList());
    }, [dispatch]);

    const [isCreateTaxModalOpen, setIsCreateTaxModalOpen] = useState(false);
    const [createTaxByFile, setCreateTaxByFile] = useState([]);
    const [createTaxByFileError, setCreateTaxByFileError] = useState([false, ""]);

    const handleFileUpload = (e) => {
        if (e.target.files[0].size > 5 * 1000 * 1024) {
            setCreateTaxByFileError([true, "File size should be less than 5MB"]);
            setCreateTaxByFile([]);
        } else if (e.target.files[0].type !== "application/pdf" && e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/jpeg") {
            setCreateTaxByFileError([true, "File type should be pdf, png or jpeg"]);
            setCreateTaxByFile([]);
        } else {
            setCreateTaxByFile(e.target.files[0]);
            setCreateTaxByFileError([false, ""]);
        }
    }

    const showModalCreateTax = () => {
        setIsCreateTaxModalOpen(true);
    };
    const handleCancelCreateTax = () => {
        setIsCreateTaxModalOpen(false);
        setCreateTaxByFile([]);
    };

    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
    const showPendingModal = () => {
        setIsPendingModalOpen(true);
    };
    const handleCancelPending = () => {
        setIsPendingModalOpen(false);
        dispatch(getExtractedTaxInvoiceList());
    };

    const handleDelete = (id) => {
        dispatch(deleteTaxInvoice(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getTaxInvoiceList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getTaxInvoiceList());
        }
    }, [dispatch, searchText]);

    const columns = taxInvoiceColumns(showModal, navigate);

    const pendingColumns = [
        {
            title: 'TI Date',
            dataIndex: 'ti_date',
            key: 'ti_date',
        },
        {
            title: 'TI Number',
            dataIndex: 'ti_number',
            key: 'ti_number',
            render: (text, record) => (
                <div>
                    {record.ti_number === null ? record.staging_id : record.ti_number}
                </div>
            ),
        },
        // {
        //     title: 'Customer Name',
        //     dataIndex: 'customer_name',
        //     key: 'customer_name',
        // },
        // {
        //     title: 'TI Status',
        //     dataIndex: 'ti_status',
        //     key: 'ti_status',
        // },
        {
            title: 'Document',
            dataIndex: 'attachment_url',
            key: 'attachment_url',
            align: 'center',
            render: (text, record) => (
                <div className="action__button" onClick={() => window.open(record.attachment_url)}>
                    <EyeOutlined />
                </div>
            ),
        },
    ];

    return (
        <>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={400}
                className='mainPage__list--delete--modal'
            >
                <div className='delete--modal'>
                    <img src={errorIcon} alt="error" />
                    <h1>Are you sure you?</h1>
                    <p>This action cannot be undone.</p>
                    <div className="delete__modal__buttons">
                        <button id='cancel' onClick={handleCancel}>Cancel</button>
                        <button id='confirm' onClick={() => handleDelete(record.ti_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'> Tax Invoices </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    <a className='mainPage__header--btn1' onClick={() => dispatch(downloadTaxInvoiceList())}>Download</a>
                    <a onClick={showModalCreateTax} className='mainPage__header--btn2'>Create / Upload Tax Invoice</a>
                </div>
            </div>
            <Modal
                open={isCreateTaxModalOpen}
                onCancel={handleCancelCreateTax}
                footer={null}
                width={400}
            >
                <div className='taxInvoice__create--modal'>
                    <a className="taxInvoice__modal--btn1"
                        onClick={() => navigate("/tax-invoice/create")}
                    >
                        Create Manually &nbsp;
                        <ArrowRightOutlined />
                    </a>
                    <Divider
                        style={{ borderColor: "black", opacity: "0.2", borderWidth: "1px" }}
                    />
                    <form className='taxInvoice__modal--form'>
                        <input id="createTaxByFile" type='file' name='createTaxByFile'
                            onChange={(e) => handleFileUpload(e)}
                            hidden
                        />
                        <label htmlFor="createTaxByFile"><InboxOutlined /> UPLOAD</label>
                        <p id="create-tax-file-chosen">{createTaxByFile.name || "No File Chosen"}</p>
                        {createTaxByFileError[0] ?
                            <p style={{ fontSize: "0.8rem" }} className="phone__error--span">
                                {createTaxByFileError[1]}
                            </p>
                            : <></>
                        }
                        <button className="taxInvoice__modal--btn2" onClick={(e) => {
                            e.preventDefault(); 
                            !createTaxByFileError[0] && dispatch(extractDataFromTaxInvoice(createTaxByFile, navigate));
                            handleCancelCreateTax();
                            dispatch(getExtractedTaxInvoiceList());
                        }}>
                            Submit &nbsp;
                            <ArrowRightOutlined />
                        </button>
                    </form>
                </div>
            </Modal>
            <Modal
                open={isPendingModalOpen}
                onCancel={handleCancelPending}
                footer={null}
                width={800}
                className='mainPage__list--delete--modal'
            >
                <h1>Pending Tax Invoices</h1>
                <br />
                <TableCard columns={pendingColumns} items={extractedTaxInvoices} />
            </Modal>
            <div className="table">
                <div className='table--pending__tasks' onClick={showPendingModal}>
                    {
                        taxInvoices?.total_pending_items > 0 ? `${taxInvoices?.total_pending_items} Tax Invoices Pending` : ""
                    }
                </div>
                <TableCard columns={columns} dispatch={dispatch} loading={loading} items={taxInvoices} getList={getTaxInvoiceList} searchText={searchText} />
            </div>
        </>
    )
}

export default TaxInvoice;
