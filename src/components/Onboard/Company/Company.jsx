import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import "./Company.css";
import { getCompanyType, getIndustry, saveCompanyDetails } from '../../../Actions/Onboarding';
import { getCountries, getStates } from 'country-state-picker';
import uaeStates from '../../../data/uaeStates';
import { LoadingOutlined } from '@ant-design/icons';

const Company = () => {
    const [companyName, setCompanyName] = useState("");
    const [companyType, setCompanyType] = useState(0);
    const [tradeLicenseNumber, setTradeLicenseNumber] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState(null);
    const [address3, setAddress3] = useState(null);
    const [country, setCountry] = useState("United Arab Emirates");
    const [selectedCountry, setSelectedCountry] = useState("ae");
    const [state, setState] = useState("");
    const [allState, setAllStates] = useState(uaeStates);
    const [poBox, setPoBox] = useState(null);

    const [industry, setIndustry] = useState("");
    const [otherIndustry, setOtherIndustry] = useState(false);

    const dispatch = useDispatch();
    const { companyTypes, industries, loading, comapanyTypeLoading, industryLoading } = useSelector((state) => state.onboardingReducer);

    const allIndustries = [...industries, { title: "Other", description: null, media_url: null }];

    useEffect(() => {
        dispatch(getCompanyType());
        dispatch(getIndustry());
    }, [dispatch]);

    const handleCountryChange = (e) => {
        const countryCode = e.target.value;
        setSelectedCountry(countryCode);
        const selectedCountry = getCountries().find(country => country.code === countryCode);
        setCountry(selectedCountry ? selectedCountry.name : '');
        if (countryCode === 'ae') {
            setAllStates(uaeStates);
            setState("");
        } else if (countryCode) {
            const countryStates = getStates(countryCode);
            setAllStates(countryStates);
            setState("");
        } else {
            setAllStates([]);
        }
    };

    const handleIndustryChange = (e) => {
        const industry = e.target.value;
        if (industry === "Other") {
            setOtherIndustry(true);
            setIndustry("Other");
            return;
        } else {
            setIndustry(industry);
            setOtherIndustry(false);
        }
    };

    const handleCompany = (e) => {
        e.preventDefault();
        if (companyName === "" || companyType === 0 || tradeLicenseNumber === "" || email == "" || telephone == "" || industry === "" || address1 === "" || country === "" || state === "") {
            toast.error("Please fill all the fields");
            return;
        }
        if (poBox !== null && (poBox.length < 5 || poBox.length > 6)) {
            toast.error("PO Box should be 5 or 6 digits.");
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
            <div className="company__heading">Company Details</div>
            <div className="company__form__data">
                <form className='company__form' onSubmit={handleCompany}>
                    <div className="company__form--split">
                        <div className='company__form--left'>
                            <div className='company__form--input'>
                                <span className='required__field'>Company Name</span>
                                <input type='text' placeholder='Company Name' name='companyName' value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span className='required__field'>Company Type</span>
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
                                <span className='required__field'>Trade License Number</span>
                                <input type='text' placeholder='Trade License Number' name='tradeLicenseNumber' value={tradeLicenseNumber} onChange={(e) => setTradeLicenseNumber(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span className='required__field'>Company Email</span>
                                <input type='email' placeholder='Email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span className='required__field'>Company Telephone</span>
                                <input type='text' placeholder='Telephone' name='telephone' value={telephone}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const isValid = inputValue === '' || inputValue === '+' || /^[0-9+]+$/.test(inputValue);
                                        if (isValid) {
                                            setTelephone(inputValue);
                                        }
                                    }}
                                />
                            </div>
                            <div className='company__form--input'>
                                <span className='required__field'>Industry</span>
                                <select className="company__select" id="industry" value={industry} onChange={handleIndustryChange}>
                                    <option value="">
                                        {otherIndustry == true ? 'Other' : 'Select industry'}
                                    </option>
                                    {allIndustries ? allIndustries.map((industry) => (
                                        <option key={industry.title} value={industry.title}>
                                            {industry.title}
                                        </option>
                                    ))
                                        :
                                        <option key="" value="">
                                            Not Available
                                        </option>
                                    }
                                </select>
                            </div>
                            <div className='company__form--input'>
                                {
                                    otherIndustry ?
                                        <input style={{ marginTop: "1.2rem" }} type='text' placeholder='Industry Name' name='otherIndustry' value={industry}
                                            onChange={(e) => {
                                                setIndustry(e.target.value)
                                            }}
                                        />
                                        : <></>
                                }
                            </div>
                            <div className='company__form--button'>
                                <button type='submit'>
                                    {
                                        loading ? <LoadingOutlined /> : "Next"
                                    }
                                </button>
                            </div>
                        </div>
                        <div className='company__form--right'>
                            <div className='company__form--input'>
                                <span className='required__field'>Address Line 1</span>
                                <input type='text' placeholder='Address' name='address1' value={address1} onChange={(e) => setAddress1(e.target.value)} />
                            </div>
                            <div className='company__form--input'>
                                <span>Address Line 2</span>
                                <input type='text' placeholder='Address' name='address2' value={address2}
                                    onChange={(e) => {
                                        if (e.target.value == "") {
                                            setAddress2(null);
                                        } else {
                                            setAddress2(e.target.value)
                                        }
                                    }}
                                />
                            </div>
                            <div className='company__form--input'>
                                <span>Address Line 3</span>
                                <input type='text' placeholder='Address' name='address3' value={address3}
                                    onChange={(e) => {
                                        if (e.target.value == "") {
                                            setAddress3(null);
                                        } else {
                                            setAddress3(e.target.value)
                                        }
                                    }}
                                />
                            </div>
                            <div className='company__form--input'>
                                <span className='required__field'>Country</span>
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
                                        <span className='required__field'>{selectedCountry == "ae" ? "Emirates" : "State"}</span>
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
                                <input type='text' placeholder='PO Box' name='poBox' value={poBox}
                                    onChange={(e) => {
                                        if (e.target.value == "") {
                                            setPoBox(null);
                                        } else {
                                            setPoBox(e.target.value)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default Company;
