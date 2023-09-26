import { useState } from "react";
import "./Register.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { sendLink } from "../../Actions/User";
import { getCountries, getStates } from 'country-state-picker';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [state, setState] = useState("");
  const [allState, setAllStates] = useState([]);
  const [agree, setAgree] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.userReducer);

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

  const handleRegister = (e) => {
    e.preventDefault();
    if (username == "" || email == "" || phone == "" || password == "" || country == "" || state == "") {
      toast.error("Please fill all the fields");
      return;
    }
    if (!agree) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    dispatch(sendLink({ email_id: email }));
    window.localStorage.setItem("user", JSON.stringify({ username, email, phone, password, country, state }));
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
              <input type='text' placeholder='Username' name='username' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className='register__auth__form--input'>
              <input type='email' placeholder='Email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='register__auth__form--input'>
              <input type='text' placeholder='Phone' name='phone' value={phone} onChange={(e) => {
                setPhone(e.target.value);
                if (e.target.value.length !== 10) {
                  setIsError(true);
                } else {
                  setIsError(false);
                }
              }} />
            </div>
            {
              isError ?
                <span className="phone__error--span__register">Phone number should be of length 10</span>
                :
                <></>
            }
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
