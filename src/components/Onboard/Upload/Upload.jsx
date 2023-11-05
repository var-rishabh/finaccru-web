import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

import "./Upload.css"
import { uploadDocuments } from '../../../Actions/Onboarding';
import { LoadingOutlined } from '@ant-design/icons';

const UploadFiles = () => {
    const [tradeLicense, setTradeLicense] = useState([]);
    const [tradeError, setTradeError] = useState([false, ""]);
    const [moa, setMoa] = useState([]);
    const [moaError, setMoaError] = useState([false, ""]);
    const [vatNeeded, setVatNeeded] = useState(false);
    const [vat, setVat] = useState([]);
    const [vatError, setVatError] = useState([false, ""]);
    const [emiratedId, setEmiratedId] = useState([]);
    const [emiratedIdError, setEmiratedIdError] = useState([false, ""]);
    const [ownerPassport, setOwnerPassport] = useState([]);
    const [ownerPassportError, setOwnerPassportError] = useState([false, ""]);
    const { loading } = useSelector(state => state.onboardingReducer);

    const handleFileUpload = (e, errorState, uploadState) => {
        if (e.target.files[0].size > 5 * 1000 * 1024) {
            errorState([true, "File size should be less than 5MB"]);
            uploadState([]);
        } else if (e.target.files[0].type !== "application/pdf" && e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/jpeg") {
            errorState([true, "File type should be pdf, png or jpeg"]);
            uploadState([]);
        } else {
            uploadState(e.target.files[0]);
            errorState([false, ""]);
        }
    }
    
    const { handleSubmit } = useForm();
    const dispatch = useDispatch();
    const handleUpload = (e) => {
        const { tradeLicense, moa, vat, emiratedId, ownerPassport } = e.target;
        if (!tradeLicense.files[0] || !moa.files[0] || !emiratedId.files[0] || !ownerPassport.files[0] || (vatNeeded && !vat.files[0])) {
            toast.error("Please upload all the documents.");
            return;
        }
        if (tradeError[0] || moaError[0] || emiratedIdError[0] || ownerPassportError[0] || (vatNeeded && vatError[0])) {
            toast.error("Please upload all the documents correctly.");
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
                                <span className='required__field'>Trade License</span>
                                <input id="tradeLicense" name='tradeLicense' type='file'
                                    onChange={(e) => handleFileUpload(e, setTradeError, setTradeLicense ) }
                                    hidden
                                />
                                <label htmlFor="tradeLicense">UPLOAD</label>
                                <p id="file-chosen">{tradeLicense.name || "No File Chosen"}</p>
                                {tradeError[0] ?
                                    <span style={{marginTop: "-2rem", fontSize: "0.8rem"}} className="phone__error--span"> {tradeError[1]} </span>
                                    : <></>
                                }
                            </div>
                            <div className='upload__form--input'>
                                <span className='required__field'>Memorandum of Association (MOA) / <br /> Article of Association (AOA)</span>
                                <input id="moa" type='file' name='moa'
                                    onChange={(e) => handleFileUpload(e, setMoaError, setMoa)}
                                    hidden
                                />
                                <label htmlFor="moa">UPLOAD</label>
                                <p id="file-chosen">{moa.name || "No File Chosen"}</p>
                                {moaError[0] ?
                                    <span style={{marginTop: "-2rem", fontSize: "0.8rem"}} className="phone__error--span"> {moaError[1]} </span>
                                    : <></>
                                }
                            </div>
                            <div className="upload__form__checkbox">
                                <input value="vatNeeded" type="checkbox" onChange={handleVatCheck} />
                                <span>VAT Registered</span>
                            </div>
                            {
                                !vatNeeded ? <></> :
                                    <div className='upload__form--input'>
                                        <span className='required__field'>VAT</span>
                                        <input id="vat" type='file' name='vat'
                                            onChange={(e) => handleFileUpload(e, setVatError, setVat)}
                                            hidden
                                        />
                                        <label htmlFor="vat">UPLOAD</label>
                                        <p id="file-chosen">{vat.name || "No File Chosen"}</p>
                                        {vatError[0] ?
                                            <span style={{marginTop: "-2rem", fontSize: "0.8rem"}} className="phone__error--span"> {vatError[1]} </span>
                                            : <></>
                                        }
                                    </div>
                            }
                            <div className='upload__form--button'>
                                <button type='submit'>
                                    {
                                        loading ? <LoadingOutlined /> : "Next"
                                    }
                                </button>
                            </div>
                        </div>
                        <div className='upload__form--right'>
                            <div className='upload__form--input'>
                                <span className='required__field'>Emirates ID</span>
                                <input id="emiratedId" type='file' name='emiratedId'
                                    onChange={(e) => handleFileUpload(e, setEmiratedIdError, setEmiratedId)}
                                    hidden
                                />
                                <label htmlFor="emiratedId">UPLOAD</label>
                                <p id="file-chosen">{emiratedId.name || "No File Chosen"}</p>
                                {emiratedIdError[0] ?
                                    <span style={{marginTop: "-2rem", fontSize: "0.8rem"}} className="phone__error--span"> {emiratedIdError[1]} </span>
                                    : <></>
                                }
                            </div>
                            <div className='upload__form--input'>
                                <span className='required__field'>Owners Passport</span>
                                <input id="ownerPassport" type='file' name='ownerPassport'
                                    onChange={(e) => handleFileUpload(e, setOwnerPassportError, setOwnerPassport)}
                                    hidden
                                />
                                <label htmlFor="ownerPassport">UPLOAD</label>
                                <p id="file-chosen">{ownerPassport.name || "No File Chosen"}</p>
                                {ownerPassportError[0] ?
                                    <span style={{marginTop: "-2rem", fontSize: "0.8rem"}} className="phone__error--span"> {ownerPassportError[1]} </span>
                                    : <></>
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UploadFiles;
