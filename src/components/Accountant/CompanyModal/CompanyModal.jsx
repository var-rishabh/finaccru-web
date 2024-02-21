import "./CompanyModal.css"
import { Modal } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const CompanyModal = ({ isCompanyModalOpen, handleCompanyCancel, clientData }) => {
    return (
        <Modal
            open={isCompanyModalOpen}
            onCancel={handleCompanyCancel}
            footer={null}
            width={900}
            style={{ top: 15 }}
            className='company__modal'
        >
            <>
                <div className="company__modal">
                    <span className='company__modal--header'>Company Details</span>
                    <div className="company__modal--data">
                        <div className="company__modal--left">
                            <div className="company__modal--input">
                                <span>Company Name</span>
                                <p>{clientData?.company_data?.company_name}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>Company Type</span>
                                <p>{clientData?.company_data?.company_type_name}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>VAT TRN</span>
                                <p>{clientData?.company_data?.trade_license_number}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>Company Email</span>
                                <p>{clientData?.company_data?.email}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>Company Telephone</span>
                                <p>{clientData?.company_data?.telephone_number}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>Industry</span>
                                <p>{clientData?.company_data?.industry}</p>
                            </div>
                        </div>
                        <div className="company__modal--right">
                            <div className="company__modal--input">
                                <span>Address Line 1</span>
                                <p>{clientData?.company_data?.address_line_1}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>Address Line 2</span>
                                <p>{clientData?.company_data?.address_line_2}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>Address Line 3</span>
                                <p>{clientData?.company_data?.address_line_3}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>State</span>
                                <p>{clientData?.company_data?.state}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>Country</span>
                                <p>{clientData?.company_data?.country}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>PO Box</span>
                                <p>{clientData?.company_data?.po_box}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="company__modal">
                    <span className='company__modal--header'>Primary Bank Details</span>
                    <div className="company__modal--data">
                        <div className="company__modal--left">
                            <div className="company__modal--input">
                                <span>Bank Name</span>
                                <p>{clientData?.primary_bank?.bank_name}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>Account Number</span>
                                <p>{clientData?.primary_bank?.account_number}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>IBAN</span>
                                <p>{clientData?.primary_bank?.iban_number}</p>
                            </div>
                        </div>
                        <div className="company__modal--right">
                            <div className="company__modal--input">
                                <span>Account Holder Name</span>
                                <p>{clientData?.primary_bank?.account_holder_name}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>Branch Name</span>
                                <p>{clientData?.primary_bank?.branch_name}</p>
                            </div>
                            <div className="company__modal--input">
                                <span>Currency</span>
                                <p>{clientData?.primary_bank?.currency_abv}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="company__modal">
                    <span className='company__modal--header'>Company Documents</span>
                    <div className="company__modal--data">
                        <div className="company__modal--left">
                            <div className="company__modal--links">
                                <span>Emirates ID</span>
                                <Link to={clientData?.emirates_id_url} target="_blank" >
                                    <PaperClipOutlined />
                                </Link>
                            </div>
                            <div className="company__modal--links">
                                <span>MOA</span>
                                <Link to={clientData?.moa_url} target="_blank" >
                                    <PaperClipOutlined />
                                </Link>
                            </div>
                            {
                                clientData?.vat_url && (
                                    <div className="company__modal--links">
                                        <span>VAT</span>
                                        <Link to={clientData?.vat_url} target="_blank" >
                                            <PaperClipOutlined />
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                        <div className="company__modal--right">
                            <div className="company__modal--links">
                                <span>Passport</span>
                                <Link to={clientData?.passport_url} target="_blank" >
                                    <PaperClipOutlined />
                                </Link>
                            </div>
                            <div className="company__modal--links">
                                <span>Trade License</span>
                                <Link to={clientData?.trade_licence_url} target="_blank" >
                                    <PaperClipOutlined />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Modal>
    )
}

export default CompanyModal;
