import { useEffect, useState } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../Actions/User";
import { getCountries } from "country-state-picker";

const Login = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const handleClick = (index) => setActiveIndex(index);
  const checkActive = (index, className) => activeIndex === index ? className : "";

  const { loading } = useSelector(state => state.userReducer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countries, setCountries] = useState([]);
  const [rememberMe, setRememberMe] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = () => {
    const data = getCountries;
    setCountries(data);
  };

  const dispatch = useDispatch();

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setCountryCode(countryCode);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (isError) {
      toast.error("Please Enter Valid Phone Number.");
      return;
    }
    if (loading) return;
    if (activeIndex === 2) {
      if (phone !== "") {
        dispatch(login({ mobile_number: countryCode + phone }));
      } else {
        toast.error("Please Enter Phone Number.");
      }
    } else {
      if (email !== "") {
        if (password !== "") {
          dispatch(login({ email_id: email, password: password, remember_me: rememberMe }));
        } else {
          toast.error("Please Enter Password");
        }
      } else {
        toast.error("Please Enter Email");
      }
    }
  }

  return (
    <div className="login__main">

      <div className="login__heading">
        <div className="login__heading--main">
          <h1>Welcome to Finaccru</h1>
        </div>
        <div className="login__heading--sub">
          <p>
            Welcome to more family please login with your personal account
          </p>
        </div>
      </div>

      <div className="form__data--login">
        <div className="login__form">

          <div className="login__tabs">
            <button
              className={`tabs tab_email ${checkActive(1, "active")}`}
              onClick={() => handleClick(1)}
            >
              Email
            </button>
            <button
              className={`tabs tab_phone ${checkActive(2, "active")}`}
              onClick={() => handleClick(2)}
            >
              Phone
            </button>
          </div>

          <div className="login__panels">
            <div className={`panel ${checkActive(1, "active")}`}>
              <form className='login__form' onSubmit={handleLogin}>
                <div className='login__form--input'>
                  <span>Email Address</span>
                  <input type='email' placeholder='Email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='login__form--input'>
                  <span>Password</span>
                  <input type='password' placeholder='Password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form__validation--login">
                  <div className="form__checkbox--login">
                    <input value="remember_me" type="checkbox" onChange={(e) => setRememberMe(e.target.value)} />
                    <span>Remember Me</span>
                  </div>
                  <div className='login__form--forgot'>
                    <a href='/forget'>Forgot Password?</a>
                  </div>
                </div>
                <div className='login__form--button'>
                  {loading ? <button type='submit' disabled>Loading...</button> : <button type='submit'>Login</button>}
                </div>
              </form>
            </div>

            <div className={`panel ${checkActive(2, "active")}`}>
              <form className='login__form' onSubmit={handleLogin}>
                <div className='login__form--input phone__input'>
                  <span>Phone Number</span>
                  <select className="country__code" id="country" value={countryCode} onChange={handleCountryChange}>
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.dial_code}>
                        ({country.dial_code}) {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="login__form--phone-number">
                    <input type='text' placeholder='Phone' name='phone' value={phone} onChange={(e) => {
                      setPhone(e.target.value);
                      if (e.target.value.length !== 10) {
                        setIsError(true);
                      } else {
                        setIsError(false);
                      }
                    }} />
                  </div>
                  <span className="phone__error--span">{isError ? "Phone number should be of length 10" : ""}</span>
                </div>
                <div className='login__form--button'>
                  {loading ? <button type='submit' disabled>Loading...</button> : <button type='submit'>Login</button>}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="signup__link--login">
          <p>
            Don&#39;t have an account? <a href="/register">Sign Up</a>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login;
