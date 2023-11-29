import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "../../Styles/MainPage.css"
import { Modal, Input } from 'antd';
import errorIcon from '../../assets/Icons/error.svg';

// import { deleteDebitNote, downloadDebitNoteList, getDebitNoteList } from '../../Actions/DebitNote';
import debitNoteColumns from '../../Columns/DebitNote';
import TableCard from '../../Shared/TableCard/TableCard';

const DebitNote = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const { loading, debitNotes } = useSelector(state => state.debitNoteReducer);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    // useEffect(() => {
    //     dispatch(getDebitNoteList());
    // }, [dispatch]);

    // useEffect(() => {
    //     if (searchText.length > 2) {
    //         dispatch(getDebitNoteList(1, searchText));
    //     }
    //     if (searchText.length === 0) {
    //         dispatch(getDebitNoteList());
    //     }
    // }, [dispatch, searchText]);

    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // const handleDelete = (id) => {
    //     dispatch(deleteDebitNote(id));
    //     setIsModalOpen(false);
    // }

    const columns = debitNoteColumns(showModal, navigate)
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
                        {/* <button id='confirm' onClick={() => handleDelete(record.debitNote_id)}>Delete</button> */}
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'> Debit Notes </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    {/* <a className='mainPage__header--btn1' onClick={() => dispatch(downloadDebitNoteList())}>Download</a> */}
                    <a className='mainPage__header--btn1'>Download</a>
                    <a onClick={() => navigate("/debit-note/create")} className='mainPage__header--btn2'>Create DebitNote </a>
                </div>
            </div>
            <div className="table">
                <TableCard columns={columns} dispatch={dispatch}
                    // loading={loading} items={vendors} getList={getVendorList}
                    searchText={searchText}
                />
            </div>
        </>
    )
}

export default DebitNote;
