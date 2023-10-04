import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";

import "./Upload.css"
import { uploadDocuments } from '../../Actions/Onboarding';

const Upload = () => {
    const [tradeLicense, setTradeLicense] = useState([]);
    const [moa, setMoa] = useState([]);
    const [vatNeeded, setVatNeeded] = useState(false);
    const [vat, setVat] = useState([]);
    const [emiratedId, setEmiratedId] = useState([]);
    const [ownerPassport, setOwnerPassport] = useState([]);

    const { handleSubmit } = useForm();
    const dispatch = useDispatch();
    const handleUpload = (e) => {
        const { tradeLicense, moa, vat, emiratedId, ownerPassport } = e.target;
        if (!tradeLicense.files[0] || !moa.files[0] || !emiratedId.files[0] || !ownerPassport.files[0]) {
            toast.error("Please upload all the documents");
            return;
        }
        if (vatNeeded && !vat?.files[0]) {
            toast.error("Please upload all the documents");
            return;
        }
        if (vatNeeded) {
            dispatch(uploadDocuments({
                trade_license_file: tradeLicense.files[0],
                moa_file: moa.files[0],
                vat_file: vat.files[0],
                emirates_id_file: emiratedId.files[0],
                passport_file: ownerPassport.files[0],
            }));
        } else {
            dispatch(uploadDocuments({
                trade_license_file: tradeLicense.files[0],
                moa_file: moa.files[0],
                emirates_id_file: emiratedId.files[0],
                passport_file: ownerPassport.files[0],
            }));
        }
    }

    const handleVatCheck = () => {
        setVatNeeded(!vatNeeded);
    }

    return (
        <div className="upload__main">
            <div className="upload__heading">
                <p>
                    Upload Documents
                </p>
            </div>
            <div className="upload__form__data">
                <form className='upload__form' onSubmit={(e) => { e.preventDefault(); handleUpload(e) }}>
                    <div className="upload__form--split">
                        <div className='upload__form--left'>
                            <div className='upload__form--input'>
                                <span>Trade License</span>
                                <input id="tradeLicense" type='file' name='tradeLicense' onChange={(e) => setTradeLicense(e.target.files[0])} hidden />
                                <label htmlFor="tradeLicense">UPLOAD</label>
                                <p id="file-chosen">{tradeLicense.name || "No File Chosen"}</p>
                            </div>
                            <div className='upload__form--input'>
                                <span>Memorandum of Association (MOA) / <br /> Article of Association (AOA)</span>
                                <input id="moa" type='file' name='moa' onChange={(e) => setMoa(e.target.files[0])} hidden />
                                <label htmlFor="moa">UPLOAD</label>
                                <p id="file-chosen">{moa.name || "No File Chosen"}</p>
                            </div>
                            <div className="upload__form__checkbox">
                                <input value="vatNeeded" type="checkbox" onChange={handleVatCheck} />
                                <span>VAT Registered</span>
                            </div>
                            {
                                !vatNeeded ? <></> :
                                    <div className='upload__form--input'>
                                        <span>VAT</span>
                                        <input id="vat" type='file' name='vat' onChange={(e) => setVat(e.target.files[0])} hidden />
                                        <label htmlFor="vat">UPLOAD</label>
                                        <p id="file-chosen">{vat.name || "No File Chosen"}</p>
                                    </div>
                            }
                            <div className='upload__form--button'>
                                <button type='submit'>Submit</button>
                            </div>
                        </div>
                        <div className='upload__form--right'>
                            <div className='upload__form--input'>
                                <span>Emirates ID</span>
                                <input id="emiratedId" type='file' name='emiratedId' onChange={(e) => setEmiratedId(e.target.files[0])} hidden />
                                <label htmlFor="emiratedId">UPLOAD</label>
                                <p id="file-chosen">{emiratedId.name || "No File Chosen"}</p>
                            </div>
                            <div className='upload__form--input'>
                                <span>Address</span>
                                <input id="ownerPassport" type='file' name='ownerPassport' onChange={(e) => setOwnerPassport(e.target.files[0])} hidden />
                                <label htmlFor="ownerPassport">UPLOAD</label>
                                <p id="file-chosen">{ownerPassport.name || "No File Chosen"}</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Upload;
