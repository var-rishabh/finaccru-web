import { Modal, Input, Table, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import editIcon from '../../assets/Icons/editIcon.svg';
import deleteIcon from '../../assets/Icons/deleteIcon.svg';
import errorIcon from '../../assets/Icons/error.svg';
import './CreditNote.css'

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCreditNote, downloadCreditNoteList, getCreditNoteList } from '../../Actions/CreditNote';
import { useEffect, useState } from 'react';
import creditNoteColumns from '../../Columns/CreditNote';
import TableCard from '../../Shared/TableCard/TableCard';

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

    const columns = creditNoteColumns(showModal, navigate);
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
                <TableCard columns={columns} dispatch={dispatch} loading={loading} items={creditNotes} getList={getCreditNoteList} searchText={searchText} />
            </div>
        </>
    )
}

export default CreditNote;
