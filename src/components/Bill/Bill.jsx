import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "../TaxInvoice/TaxInvoice.css";
import "../../Styles/MainPage.css";
import { Modal, Input, Divider } from 'antd';
import { ArrowRightOutlined, InboxOutlined } from '@ant-design/icons';
import errorIcon from '../../assets/Icons/error.svg';

import { deleteBill, downloadBillList, getBillList, extractDataFromBill } from '../../Actions/Bill';
import billColumns from '../../Columns/Bill';
import TableCard from '../../Shared/TableCard/TableCard';
import { toast } from 'react-toastify';

const Bill = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, bills } = useSelector(state => state.billReducer);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    useEffect(() => {
        dispatch(getBillList());
    }, [dispatch]);

    const [isCreateBillModalOpen, setIsCreateBillModalOpen] = useState(false);
    const [createBillByFile, setCreateBillByFile] = useState([]);
    const [createBillByFileError, setCreateBillByFileError] = useState([false, ""]);

    const handleFileUpload = (e) => {
        if (e.target.files[0].size > 5 * 1000 * 1024) {
            setCreateBillByFileError([true, "File size should be less than 5MB"]);
            setCreateBillByFile([]);
        } else if (e.target.files[0].type !== "application/pdf" && e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/jpeg") {
            setCreateBillByFileError([true, "File type should be pdf, png or jpeg"]);
            setCreateBillByFile([]);
        } else {
            setCreateBillByFile(e.target.files[0]);
            setCreateBillByFileError([false, ""]);
        }
    }

    const showModalCreateBill = () => {
        setIsCreateBillModalOpen(true);
    };
    const handleCancelCreateBill = () => {
        setIsCreateBillModalOpen(false);
    };

    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteBill(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getBillList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getBillList());
        }
    }, [dispatch, searchText]);

    const columns = billColumns(showModal, navigate)
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
                        <button id='confirm' onClick={() => handleDelete(record.po_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'> Bills </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    <a className='mainPage__header--btn1' onClick={() => dispatch(downloadBillList())}>Download</a>
                    <a onClick={showModalCreateBill} className='mainPage__header--btn2'>Create / Upload Bill</a>
                </div>
            </div>
            <Modal
                open={isCreateBillModalOpen}
                onCancel={handleCancelCreateBill}
                footer={null}
                width={400}
            >
                <div className='taxInvoice__create--modal'>
                    <a className="taxInvoice__modal--btn1"
                        onClick={() => navigate("/bill/create")}
                    >
                        Create Manually &nbsp;
                        <ArrowRightOutlined />
                    </a>
                    <Divider
                        style={{ borderColor: "black", opacity: "0.2", borderWidth: "1px" }}
                    />
                    <form className='taxInvoice__modal--form'>
                        <input id="createBillByFile" type='file' name='createBillByFile'
                            onChange={(e) => handleFileUpload(e)}
                            hidden
                        />
                        <label htmlFor="createBillByFile"><InboxOutlined /> UPLOAD</label>
                        <p id="create-tax-file-chosen">{createBillByFile.name || "No File Chosen"}</p>
                        {createBillByFileError[0] ?
                            <p style={{ fontSize: "0.8rem" }} className="phone__error--span">
                                {createBillByFileError[1]}
                            </p>
                            : <></>
                        }
                        <button className="taxInvoice__modal--btn2" onClick={(e) => {
                            e.preventDefault();
                            if (createBillByFileError[0] || createBillByFile.length === 0) {
                                toast.error("Please upload a valid file");
                            }
                            !createBillByFileError[0] && dispatch(extractDataFromBill(createBillByFile, navigate))
                        }}>
                            Create By File &nbsp;
                            <ArrowRightOutlined />
                        </button>
                    </form>
                </div>
            </Modal>
            <div className="table">
                <TableCard columns={columns} dispatch={dispatch}
                    loading={loading} items={bills} getList={getBillList}
                    searchText={searchText}
                />
            </div>
        </>
    )
}

export default Bill;
