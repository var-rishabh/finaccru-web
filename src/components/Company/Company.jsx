import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import "./Company.css";
import { getCompanyType, getIndustry, saveCompanyDetails } from '../../Actions/Onboarding';
import { getCountries, getStates } from 'country-state-picker';

const Company = () => {
    const [companyName, setCompanyName] = useState("");
    const [companyType, setCompanyType] = useState(0);
    const [tradeLicenseNumber, setTradeLicenseNumber] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [industry, setIndustry] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [address3, setAddress3] = useState("");
    const [country, setCountry] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [state, setState] = useState("");
    const [allState, setAllStates] = useState([]);
    const [poBox, setPoBox] = useState("");
    const dispatch = useDispatch();
    const { companyTypes, industries } = useSelector((state) => state.onboardingReducer);

    useEffect(() => {
        dispatch(getCompanyType());
        dispatch(getIndustry());
    }, [dispatch]);

    const handleCountryChange = (e) => {
        const countryCode = e.target.value;
        setSelectedCountry(countryCode);
        const selectedCountry = getCountries().find(country => country.code === countryCode);
        setCountry(selectedCountry ? selectedCountry.name : '');
        if (countryCode) {
            const countryStates = getStates(countryCode);
            setAllStates(countryStates);
        } else {
            setAllStates([]);
        }
    };

    const handleCompany = (e) => {
        e.preventDefault();
        if (companyName === "" || companyType === 0 || tradeLicenseNumber === "" || email === "" || telephone === "" || industry === "" || address1 === "" || address2 === "" || address3 === "" || country === "" || state === "" || poBox === "") {
            toast.error("Please fill all the fields");
            return;
        }
        dispatch(saveCompanyDetails({
            company_name: companyName,
            trade_license_number: tradeLicenseNumber,
            company_type_id: companyType,
            address_line_1: address1,
            address_line_2: address2,
            address_line_3: address3,
            country: country,
            state: state,
            po_box: poBox,
            industry: industry,
            company_email: email,
            company_telephone_number: telephone
        }))

    }
    return (
        <div className="company__main">
            <div className="company__heading">
                <p>
                    Company Details
                </p>
            </div>
            <div className="company__form__data">
                <form className='company__form' onSubmit={handleCompany}>
                    <div className="company__form--split">
                        <div className='company__form--left'>
                            <div className='company__form--input'>
                                <span>Company Name</span>
                                <input type='text' placeholder='Company Name' name='companyName' value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span>Company Type</span>
                                <select className="company__select" id="company_type" value={companyType} onChange={(e) => setCompanyType(e.target.value)}>
                                    <option value="">Select a company type</option>
                                    {companyTypes ? companyTypes.map((type) => (
                                        <option key={type.company_type_id} value={type.company_type_id}>
                                            {type.company_type_name}
                                        </option>))
                                        :
                                        <option key="" value="">
                                            Not Available
                                        </option>
                                    }
                                </select>
                            </div>
                            <div className='company__form--input'>
                                <span>Trade License Number</span>
                                <input type='text' placeholder='Trade License Number' name='tradeLicenseNumber' value={tradeLicenseNumber} onChange={(e) => setTradeLicenseNumber(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span>Company Email</span>
                                <input type='email' placeholder='Email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span>Company Telephone</span>
                                <input type='text' placeholder='Telephone' name='telephone' value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span>Industry</span>
                                <select className="company__select" id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                                    <option value="">Select industry</option>
                                    {industries ? industries.map((industry) => (
                                        <option key={industry.title} value={industry.title}>
                                            {industry.title}
                                        </option>))
                                        :
                                        <option key="" value="">
                                            Not Available
                                        </option>
                                    }
                                </select>
                            </div>
                            <div className='company__form--button'>
                                <button type='submit'>Next</button>
                            </div>
                        </div>
                        <div className='company__form--right'>
                            <div className='company__form--input'>
                                <span>Address Line 1</span>
                                <input type='text' placeholder='Address' name='address1' value={address1} onChange={(e) => setAddress1(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span>Address Line 2</span>
                                <input type='text' placeholder='Address' name='address2' value={address2} onChange={(e) => setAddress2(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span>Address Line 3</span>
                                <input type='text' placeholder='Address' name='address3' value={address3} onChange={(e) => setAddress3(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span>Country</span>
                                <select className="company__select" id="country" value={selectedCountry} onChange={handleCountryChange}>
                                    <option value="">Select a country</option>
                                    {getCountries().map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='company__form--input'>
                                {selectedCountry && (
                                    <>
                                        <span>{selectedCountry == "ae" ? "Emirates" : "State"}</span>
                                        <select className="company__select" id="state" onChange={(e) => setState(e.target.value)}>
                                            <option value="">Select a state</option>
                                            {allState.map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>
                            <div className='company__form--input'>
                                <span>PO Box</span>
                                <input type='text' placeholder='PO Box' name='poBox' value={poBox} onChange={(e) => setPoBox(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Company;
