import { Modal, Input, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import convertIcon from '../../assets/Icons/convertIcon.svg';
import editIcon from '../../assets/Icons/editIcon.svg';
import deleteIcon from '../../assets/Icons/deleteIcon.svg';
import errorIcon from '../../assets/Icons/error.svg';
import "./Invoice.css"

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteInvoice, downloadInvoiceList, getInvoiceList } from '../../Actions/Invoice';
import { useEffect, useState } from 'react';

const Invoice = () => {
    const dispatch = useDispatch();
    const { error, loading, invoices } = useSelector(state => state.invoiceReducer);

    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getInvoiceList());
    }, [dispatch]);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteInvoice(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getInvoiceList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getInvoiceList());
        }
    }, [searchText]);

    const columns = [
        {
            title: 'PI Number',
            dataIndex: 'pi_number',
            key: 'pi_number',
        },
        {
            title: 'PI Date',
            dataIndex: 'pi_date',
            key: 'pi_date',
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: 'Billing Address',
            dataIndex: 'billing_address',
            key: 'billing_address',
        },
        {
            title: 'Shipping Address',
            dataIndex: 'shipping_address',
            key: 'shipping_address',
        },
        {
            title: 'Sub Total',
            dataIndex: 'sub_total',
            key: 'sub_total',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <div className="action__buttons">
                        <div className="action__button" onClick={() => navigate(`/invoice/view/${record.invoice_id}`)}>
                            <EyeOutlined />
                        </div>
                        <div className="action__button">
                            <img src={convertIcon} alt="convertIcon" />
                        </div>
                        <div className="action__button" onClick={() => window.location.href = `/invoice/edit/${record.invoice_id}`} >
                            <img src={editIcon} alt="editIcon" />
                        </div>
                        <div className="action__button" onClick={showModal}>
                            <img src={deleteIcon} alt="deleteIcon" />
                        </div>
                    </div>
                    <Modal
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={null}
                        width={400}
                        className='invoice__list--delete--modal'
                    >
                        <div className='invoice__delete--modal'>
                            <img src={errorIcon} alt="error" />
                            <h1>Are you sure you?</h1>
                            <p>This action cannot be undone.</p>
                            <div className="delete__modal__buttons">
                                <button id='cancel' onClick={handleCancel}>Cancel</button>
                                <button id='confirm' onClick={() => handleDelete(record.invoice_id)}>Delete</button>
                            </div>
                        </div>
                    </Modal>
                </>
            ),
        }
    ];
    return (
        <>
            <div className='invoice__header'>
                <div className='invoice__header--left'>
                    <h1 className='invoice__header--title'> Invoices </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='invoice__header--right'>
                    <a className='invoice__header--btn1' onClick={() => dispatch(downloadInvoiceList())}>Download</a>
                    <a onClick={() => navigate("/invoice/create")} className='invoice__header--btn2'>Create Invoice</a>
                </div>
            </div>
            <div className="table">
                <Table
                    columns={columns}
                    pagination={{
                        position: ['bottomCenter'],
                        pageSize: 20,
                        total: invoices?.total_items,
                        defaultCurrent: 1,
                        showSizeChanger: false,
                    }}
                    sticky={true}
                    sortDirections={['descend', 'ascend']}
                    scroll={{ y: 550 }}
                    loading={loading}
                    dataSource={invoices?.items}
                    onChange={(pagination) => {
                        searchText.length > 2 ? dispatch(getInvoiceList(pagination.current, searchText)) : dispatch(getInvoiceList(pagination.current));
                    }}
                />
            </div>
        </>
    )
}

export default Invoice;
