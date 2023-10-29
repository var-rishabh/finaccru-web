import { Modal, Input, Table, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
// import convertIcon from '../../assets/Icons/convertIcon.svg';
import editIcon from '../../assets/Icons/editIcon.svg';
import deleteIcon from '../../assets/Icons/deleteIcon.svg';
import errorIcon from '../../assets/Icons/error.svg';
import './CreditNote.css'

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCreditNote, downloadCreditNoteList, getCreditNoteList } from '../../Actions/CreditNote';
import { useEffect, useState } from 'react';

const CreditNote = () => {
    const dispatch = useDispatch();
    const { error, loading, creditNotes } = useSelector(state => state.creditNoteReducer);

    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getCreditNoteList());
    }, [dispatch]);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});
    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

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

    const columns = [
        {
            title: 'CN Date',
            dataIndex: 'cn_date',
            key: 'cn_date',
        },
        {
            title: 'CN Number',
            dataIndex: 'cn_number',
            key: 'cn_number',
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
                    <div className="action__buttons credit-note">
                        <div className="action__button" onClick={() => navigate(`/credit-note/view/${record.cn_id}`)}>
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
                                    <div className="action__button" onClick={() => window.location.href = `/credit-note/edit/${record.cn_id}`} >
                                        <Tooltip title="Edit" color='blue' placement="bottom">
                                            <img src={editIcon} alt="editIcon" />
                                        </Tooltip>
                                    </div>
                                    <div className="action__button" onClick={() => { showModal(record) }}>
                                        <Tooltip title="Delete" color='red' placement="bottom">
                                            <img src={deleteIcon} alt="deleteIcon" />
                                        </Tooltip>
                                    </div>
                                </>
                        }
                    </div>

                </>
            ),
        }
    ];
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
                <Table
                    columns={columns}
                    pagination={{
                        position: ['bottomCenter'],
                        pageSize: 20,
                        total: creditNotes?.total_items,
                        defaultCurrent: 1,
                        showSizeChanger: false,
                    }}
                    sticky={true}
                    sortDirections={['descend', 'ascend']}
                    scroll={{ y: 550 }}
                    loading={loading}
                    dataSource={creditNotes?.items}
                    onChange={(pagination) => {
                        searchText.length > 2 ? dispatch(getCreditNoteList(pagination.current, searchText)) : dispatch(getCreditNoteList(pagination.current));
                    }}
                />
            </div>
        </>
    )
}

export default CreditNote;
