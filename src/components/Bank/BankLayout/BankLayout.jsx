import { useNavigate } from 'react-router-dom';

import "./BankLayout.css";
import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";

import Banking from './Banking/Banking';
import PDC from './PDC/PDC';

import backButton from "../../../assets/Icons/back.svg";
import logo from "../../../assets/Icons/cropped_logo.svg";

const BankLayout = () => {
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type');

    return (
        <>
            <div className='layout__header'>
                <div className='layout__header--left'>
                    <img src={backButton} alt='back' className='layout__header--back-btn' onClick={() => navigate("/bank")} />
                    <h1 className='layout__header--title'> {type == "bank" ? "Banks" : "PDCs"} List </h1>
                </div>
            </div>
            <div className="layout__container">
                <div className="create__layout--main">
                    <div className="create__layout--top">
                        <img style={{ width: "9rem" }} src={logo} alt="logo" />
                        <h1 className='create__payment--head'> {type == "bank" ? "Bank" : "PDC"} </h1>
                    </div>
                    {
                        type == "bank" ?
                            <Banking /> : <PDC />
                    }
                </div>
            </div>
        </>
    )
}

export default BankLayout;
