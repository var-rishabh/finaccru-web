// Main Css
import './App.css';

// Common Components
import Home from './components/Home/Home';
import Loader from './components/Loader/Loader';
import NotFound from './components/NotFound/NotFound';

// Auth Components
import Auth from './components/Auth/Auth';
import Login from './components/Auth/Login/Login';
import ForgetPassword from './components/Auth/ForgetPassword/ForgetPassword';
import ResetPassword from './components/Auth/ResetPassword/ResetPassword';
import VerifyOTP from './components/Auth/VerifyOTP/VerifyOTP';
import Register from './components/Auth/Register/Register';
import ConfirmEmail from './components/Auth/ConfirmEmail/ConfirmEmail';
import Redirect from './components/Auth/Redirect/Redirect';

// Onboarding Components
import Onboard from './components/Onboard/Onboard';
import Company from './components/Onboard/Company/Company';
import Bank from './components/Onboard/Bank/Bank';
import UploadFiles from './components/Onboard/Upload/Upload';

// Menu Items
import menuItems from './MenuItems';

// Redux and React Modules
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './Actions/User';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JuniorAccountant from './components/JuniorAccountant/JuniorAccountant';
import SeniorAccountant from './components/SeniorAccountant/SeniorAccountant';
import Client from './components/Client/Client';
import JrAccountants from './components/SeniorAccountant/JrAccountants/JrAccountants';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user, authLoading } = useSelector(state => state.userReducer);
  const { loading: onbordingLoading } = useSelector(state => state.onboardingReducer);
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {
          !loading ? (
            isAuthenticated ? (
              <>
                {user?.localInfo?.status !== 0 ? (
                  <>
                    <Route path="/onboard" element={<Onboard />}>
                      {user?.localInfo?.status === 3 && (
                        <Route path="/onboard" element={<Company />} />
                      )}
                      {user?.localInfo?.status === 2 && (
                        <Route path="/onboard/bank" element={<Bank />} />
                      )}
                      {user?.localInfo?.status === 1 && (
                        <Route path="/onboard/upload" element={<UploadFiles />} />
                      )}
                    </Route>
                    <Route path="*" element={<Loader />} />
                  </>
                ) : (
                  user?.localInfo?.role === 0 ? (
                    <>
                      <Route path="/" element={<Home />}>
                        {
                          menuItems.map((item) => {
                            return (
                              <>
                                <Route key={item.key} path={item.key} element={item.component} />
                                <Route key={`${item.key}-create`} path={item.key + "/create"} element={item.changecomponent} />
                                <Route key={`${item.key}-edit`} path={item.key + "/edit/:id"} element={item.changecomponent} />
                                <Route key={`${item.key}-view`} path={item.key + "/view/:id"} element={item.viewcomponent} />
                              </>
                            )
                          })
                        }
                      </Route>
                      <Route path="*" element={<NotFound />} />

                    </>
                  ) : user?.localInfo?.role === 1 ? (
                    <>
                      <Route path="/" element={<JuniorAccountant />} />
                      <Route path="/clients/:id" element={<Client />} />
                      <Route path="*" element={<NotFound />} />
                      {
                        menuItems.slice(4, 8).map((item) => {
                          return (
                            <>
                              <Route key={`${item.key}-edit`} path={"/clients/:client_id" + item.key + "/edit/:id"} element={item.changecomponent} />
                              <Route key={`${item.key}-view`} path={"/clients/:client_id" + item.key + "/view/:id"} element={item.viewcomponent} />
                            </>
                          )
                        })
                      }
                    </>
                  ) : user?.localInfo?.role === 2 ? (
                    <>
                      <Route path="/" element={<SeniorAccountant />} />
                      <Route path="/jr/:id" element={<JrAccountants />} />
                      <Route path="/jr/:jr_id/clients/:id" element={<Client />} />
                      <Route path="*" element={<NotFound />} />
                      {
                        menuItems.slice(4, 8).map((item) => {
                          return (
                            <>
                              <Route key={`${item.key}-edit`} path={"/jr/:jr_id/clients/:client_id" + item.key + "/edit/:id"} element={item.changecomponent} />
                              <Route key={`${item.key}-view`} path={"/jr/:jr_id/clients/:client_id" + item.key + "/view/:id"} element={item.viewcomponent} />
                            </>
                          )
                        })
                      }
                    </>
                  ) : <Route path="*" element={<NotFound />} />
                )}

              </>
            ) : (<>
              {authLoading || isAuthenticated ? <Route path="*" element={<Loader />} /> :
                <>
                  <Route path="/" element={<Auth />} >
                    <Route path="/" element={<Login />} />
                    <Route path="/forget" element={<ForgetPassword />} />
                    <Route path="/reset" element={<ResetPassword />} />
                    <Route path="/verifyotp" element={<VerifyOTP />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/confirm" element={<ConfirmEmail />} />
                    <Route path="/redirect" element={<Redirect />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </>
              }
            </>
            )) : (
            <Route path="*" element={<Loader />} />
          )}
      </Routes>
    </Router>
  );
}

export default App;