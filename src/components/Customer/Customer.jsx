import { Modal, Input, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import convertIcon from '../../assets/Icons/convertIcon.svg';
import editIcon from '../../assets/Icons/editIcon.svg';
import deleteIcon from '../../assets/Icons/deleteIcon.svg';
import errorIcon from '../../assets/Icons/error.svg';
import "./Customer.css"

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCustomer, downloadCustomerList, getCustomerList } from '../../Actions/Customer';
import { useEffect, useState } from 'react';

const Customer = () => {
    const dispatch = useDispatch();
    const { error, loading, customers } = useSelector(state => state.customerReducer);

    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getCustomerList());
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
        dispatch(deleteCustomer(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getCustomerList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getCustomerList());
        }
    }, [searchText]);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'Customer_date',
            key: 'Customer_date',
        },
        {
            title: 'Customer No.',
            dataIndex: 'Customer_number',
            key: 'Customer_number',
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
            render: (text, record) => (
                <>
                    <div className="action__buttons">
                        <div className="action__button" onClick={() => navigate(`/customer/view/${record.customer_id}`)}>
                            <EyeOutlined />
                        </div>
                        <div className="action__button">
                            <img src={convertIcon} alt="convertIcon" />
                        </div>
                        <div className="action__button" onClick={() => window.location.href = `/customer/edit/${record.customer_id}`} >
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
                        className='customer__list--delete--modal'
                    >
                        <div className='customer__delete--modal'>
                            <img src={errorIcon} alt="error" />
                            <h1>Are you sure you?</h1>
                            <p>This action cannot be undone.</p>
                            <div className="delete__modal__buttons">
                                <button id='cancel' onClick={handleCancel}>Cancel</button>
                                <button id='confirm' onClick={() => handleDelete(record.Customer_id)}>Delete</button>
                            </div>
                        </div>
                    </Modal>
                </>
            ),
        }
    ];
    return (
        <>
            <div className='customer__header'>
                <div className='customer__header--left'>
                    <h1 className='customer__header--title'> Customers </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='customer__header--right'>
                    <a className='customer__header--btn1' onClick={() => dispatch(downloadCustomerList())}>Download</a>
                    <a onClick={() => navigate("/customer/create")} className='customer__header--btn2'>Create Customer</a>
                </div>
            </div>
            <div className="table">
                <Table
                    columns={columns}
                    pagination={{
                        position: ['bottomCenter'],
                        pageSize: 20,
                        total: customers?.total_items,
                        defaultCurrent: 1,
                        showSizeChanger: false,
                    }}
                    sticky={true}
                    sortDirections={['descend', 'ascend']}
                    scroll={{ y: 550 }}
                    loading={loading}
                    dataSource={customers?.items}
                    onChange={(pagination) => {
                        searchText.length > 2 ? dispatch(getCustomerList(pagination.current, searchText)) : dispatch(getCustomerList(pagination.current));
                    }}
                />
            </div>
        </>
    )
}

export default Customer;