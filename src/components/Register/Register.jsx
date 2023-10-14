import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';

import "./Register.css";
import { sendLink } from "../../Actions/User";
import { getCountries, getStates } from 'country-state-picker';
import uaeStates from '../../data/uaeStates';

const Register = () => {
  const query = useLocation().search;
  const params = new URLSearchParams(query);
  const email_id = params.get('email_id');
  const mobile_number = params.get('mobile_number');
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(email_id ? email_id : "");
  const [phone, setPhone] = useState("");
  const [countryPhoneCode, setCountryPhoneCode] = useState("+971");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("United Arab Emirates");
  const [selectedCountry, setSelectedCountry] = useState("ae");
  const [state, setState] = useState("");
  const [allState, setAllStates] = useState(uaeStates);
  const [agree, setAgree] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.userReducer);


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

  const handleCountryPhoneCodeChange = (e) => {
    const countryPhoneCode = e.target.value;
    setCountryPhoneCode(countryPhoneCode);
  }

  const handleRegister = (e) => {
    e.preventDefault();
    if (isError) {
      toast.error("Please Enter Valid Phone Number.");
      return;
    }
    if (username == "" || email == "" || phone == "" || password == "" || country == "" || state == "") {
      toast.error("Please fill all the fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if ((countryPhoneCode + phone).length > 13) {
      toast.error("Please Enter Valid Phone Number.");
      return;
    }
    if (!agree) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }
    dispatch(sendLink({ email_id: email, password: password, full_name: username, mobile_number: countryPhoneCode + phone, country: country, state: state }));
    window.localStorage.setItem("user", JSON.stringify({ username, phone, country, state }));
  }

  return (
    <div className="register__main">

      <div className="register__heading">
        <div className="register__heading--main">
          <h1>Create Account</h1>
        </div>
        <div className="register__heading--sub">
          <p>
            Follow the instructions to make it easier to register and you will be able to explore inside.
          </p>
        </div>
      </div>

      <div className="register__form__data">
        <div className="regiter__form">
          <form className='register__auth__form' onSubmit={handleRegister}>
            <div className='register__auth__form--input'>
              <input type='text' placeholder='Full Name' name='username' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className='register__auth__form--input'>
              <input type='email' placeholder='Email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='register__auth__form--phone-number'>
              <select className="country__code" id="country" value={countryPhoneCode} onChange={handleCountryPhoneCodeChange}>
                {getCountries().map((country) => (
                  <option key={country.code} value={country.dial_code}>
                    {country.dial_code}
                  </option>
                ))}
              </select>
              <input className="register--phone__input" type='text' placeholder='Phone' name='phone' value={phone} onChange={(e) => {
                setPhone(e.target.value);
                if (e.target.value.length > 10 || e.target.value.length < 9) {
                  setIsError(true);
                } else {
                  setIsError(false);
                }
              }} />
            </div>
            {/* {
              isError ?
                <span className="phone__error--span__register">Wrong Phone Number</span>
                :
                <></>
            } */}
            <div className='register__auth__form--input'>
              <input type='password' placeholder='Password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='register__auth__form--input'>
              <select className="register__select" id="country" value={selectedCountry} onChange={handleCountryChange}>
                <option value="">Select a country</option>
                {getCountries().map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='register__auth__form--input'>
              {selectedCountry && (
                <select className="register__select" id="state" onChange={(e) => setState(e.target.value)}>
                  <option value="">Select a state</option>
                  {allState.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="form__checkbox--register">
              <input value="agree" type="checkbox" onChange={(e) => setAgree(e.target.value)} />
              <span>&nbsp;I agree all <a href="#">Terms & Conditions</a></span>
            </div>
            <div className='register__auth__form--button'>
              <button type='submit'>{loading ? "Loading..." : "Create Account"}</button>
            </div>
          </form>
        </div>
      </div>

      <div className="signup__link">
        <p>
          Do you have an account? <a href="/">Sign In</a>
        </p>
      </div>

    </div>
  )
}

export default Register;
