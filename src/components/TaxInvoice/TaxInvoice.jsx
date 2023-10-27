import { EyeOutlined, ArrowRightOutlined, InboxOutlined } from '@ant-design/icons';
import { Modal, Input, Table, Tooltip, Divider } from 'antd';

import editIcon from '../../assets/Icons/editIcon.svg';
import deleteIcon from '../../assets/Icons/deleteIcon.svg';
import errorIcon from '../../assets/Icons/error.svg';
import "./TaxInvoice.css"

import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTaxInvoice, downloadTaxInvoiceList, extractDataFromTaxInvoice, getTaxInvoiceList } from '../../Actions/TaxInvoice';
import { useEffect, useState } from 'react';

const TaxInvoice = () => {
    const dispatch = useDispatch();
    const { error, loading, taxInvoices } = useSelector(state => state.taxInvoiceReducer);
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getTaxInvoiceList());
    }, [dispatch]);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
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
    }, [searchText]);

    const columns = [
        {
            title: 'TI Date',
            dataIndex: 'ti_date',
            key: 'ti_date',
        },
        {
            title: 'TI Number',
            dataIndex: 'ti_number',
            key: 'ti_number',
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Amount (excl. VAT)',
            dataIndex: 'total_amount_excl_tax',
            key: 'total_amount_excl_tax',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (text, record) => (
                <>
                    <div className="action__buttons tax-invoices">
                        <div className="action__button" onClick={() => navigate(`/tax-invoice/view/${record.ti_id}`)}>
                            <Tooltip title="View" color='gray' placement="bottom">
                                <EyeOutlined />
                            </Tooltip>
                        </div>
                        {
                            record?.status === "Approved" ? "" :
                                <>
                                    {/* <div className="action__button">
                                        <Tooltip title="Convert to Invoice" color='green' placement="bottom">
                                            <img src={convertIcon} alt="convertIcon" />
                                        </Tooltip>
                                    </div> */}
                                    <div className="action__button" onClick={() => window.location.href = `/tax-invoice/edit/${record.ti_id}`} >
                                        <Tooltip title="Edit" color='blue' placement="bottom">
                                            <img src={editIcon} alt="editIcon" />
                                        </Tooltip>
                                    </div>
                                    <div className="action__button" onClick={showModal}>
                                        <Tooltip title="Delete" color='red' placement="bottom">
                                            <img src={deleteIcon} alt="deleteIcon" />
                                        </Tooltip>
                                    </div>
                                </>
                        }
                    </div>
                    <Modal
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={null}
                        width={400}
                        className='taxInvoice__list--delete--modal'
                    >
                        <div className='taxInvoice__delete--modal'>
                            <img src={errorIcon} alt="error" />
                            <h1>Are you sure you?</h1>
                            <p>This action cannot be undone.</p>
                            <div className="delete__modal__buttons">
                                <button id='cancel' onClick={handleCancel}>Cancel</button>
                                <button id='confirm' onClick={() => handleDelete(record.ti_id)}>Delete</button>
                            </div>
                        </div>
                    </Modal>
                </>
            ),
        }
    ];
    return (
        <>
            <div className='taxInvoice__header'>
                <div className='taxInvoice__header--left'>
                    <h1 className='taxInvoice__header--title'> Tax Invoices </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='taxInvoice__header--right'>
                    <a className='taxInvoice__header--btn1' onClick={() => dispatch(downloadTaxInvoiceList())}>Download</a>
                    <a onClick={showModalCreateTax} className='taxInvoice__header--btn2'>Create Tax Invoice</a>
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
                        <button className="taxInvoice__modal--btn2" onClick={(e) => { e.preventDefault(); !createTaxByFileError[0] && dispatch(extractDataFromTaxInvoice(createTaxByFile, navigate)) }}>
                            Create By File &nbsp;
                            <ArrowRightOutlined />
                        </button>
                    </form>
                </div>
            </Modal>

            <div className="table">
                <Table
                    columns={columns}
                    pagination={{
                        position: ['bottomCenter'],
                        pageSize: 20,
                        total: taxInvoices?.total_items,
                        defaultCurrent: 1,
                        showSizeChanger: false,
                    }}
                    sticky={true}
                    sortDirections={['descend', 'ascend']}
                    scroll={{ y: 550 }}
                    loading={loading}
                    dataSource={taxInvoices?.items}
                    onChange={(pagination) => {
                        searchText.length > 2 ? dispatch(getTaxInvoiceList(pagination.current, searchText)) : dispatch(getTaxInvoiceList(pagination.current));
                    }}
                />
            </div>
        </>
    )
}

export default TaxInvoice;
