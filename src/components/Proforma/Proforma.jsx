import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "../../Styles/MainPage.css"
import { Modal, Input } from 'antd';
import errorIcon from '../../assets/Icons/error.svg';

import { deleteProforma, downloadProformaList, getProformaList } from '../../Actions/Proforma';
import performaColumns from '../../Columns/Proforma';
import TableCard from '../../Shared/TableCard/TableCard';

const Proforma = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { loading, proformas } = useSelector(state => state.proformaReducer);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});


    useEffect(() => {
        dispatch(getProformaList());
    }, [dispatch]);

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getProformaList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getProformaList());
        }
    }, [dispatch, searchText]);

    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteProforma(id));
        setIsModalOpen(false);
    }


    const columns = performaColumns(showModal, navigate)
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
                        <button id='confirm' onClick={() => handleDelete(record.pi_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'>Proforma Invoice</h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    <a className='mainPage__header--btn1' onClick={() => dispatch(downloadProformaList())}>Download</a>
                    <a onClick={() => navigate("/proforma/create")} className='mainPage__header--btn2'>Create Proforma Invoice</a>
                </div>
            </div>
            <div className="table">
                <TableCard columns={columns} dispatch={dispatch} loading={loading} items={proformas} getList={getProformaList} searchText={searchText} />
            </div>
        </>
    )
}

export default Proforma;
