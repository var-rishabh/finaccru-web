import { Modal, Input, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import convertIcon from '../../assets/Icons/convertIcon.svg';
import editIcon from '../../assets/Icons/editIcon.svg';
import deleteIcon from '../../assets/Icons/deleteIcon.svg';
import errorIcon from '../../assets/Icons/error.svg';
import "./Estimate.css"

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEstimate, downloadEstimateList, getEstimateList } from '../../Actions/Estimate';
import { useEffect, useState } from 'react';

const Estimate = () => {
    const dispatch = useDispatch();
    const { error, loading, estimates } = useSelector(state => state.estimateReducer);

    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getEstimateList());
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
        dispatch(deleteEstimate(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getEstimateList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getEstimateList());
        }
    }, [searchText]);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'estimate_date',
            key: 'estimate_date',
        },
        {
            title: 'Estimate No.',
            dataIndex: 'estimate_number',
            key: 'estimate_number',
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
                        <div className="action__button" onClick={() => navigate(`/estimate/view/${record.estimate_id}`)}>
                            <EyeOutlined />
                        </div>
                        <div className="action__button">
                            <img src={convertIcon} alt="convertIcon" />
                        </div>
                        <div className="action__button" onClick={() => window.location.href = `/estimate/edit/${record.estimate_id}`} >
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
                        className='estimate__list--delete--modal'
                    >
                        <div className='estimate__delete--modal'>
                            <img src={errorIcon} alt="error" />
                            <h1>Are you sure you?</h1>
                            <p>This action cannot be undone.</p>
                            <div className="delete__modal__buttons">
                                <button id='cancel' onClick={handleCancel}>Cancel</button>
                                <button id='confirm' onClick={() => handleDelete(record.estimate_id)}>Delete</button>
                            </div>
                        </div>
                    </Modal>
                </>
            ),
        }
    ];
    return (
        <>
            <div className='estimate__header'>
                <div className='estimate__header--left'>
                    <h1 className='estimate__header--title'> Estimates </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='estimate__header--right'>
                    <a className='estimate__header--btn1' onClick={() => dispatch(downloadEstimateList())}>Download</a>
                    <a onClick={() => navigate("/estimate/create")} className='estimate__header--btn2'>Create Estimate</a>
                </div>
            </div>
            <div className="table">
                <Table
                    columns={columns}
                    pagination={{
                        position: ['bottomCenter'],
                        pageSize: 20,
                        total: estimates?.total_items,
                        defaultCurrent: 1,
                        showSizeChanger: false,
                    }}
                    sticky={true}
                    sortDirections={['descend', 'ascend']}
                    scroll={{ y: 550 }}
                    loading={loading}
                    dataSource={estimates?.items}
                    onChange={(pagination) => {
                        searchText.length > 2 ? dispatch(getEstimateList(pagination.current, searchText)) : dispatch(getEstimateList(pagination.current));
                    }}
                />
            </div>
        </>
    )
}

export default Estimate;
