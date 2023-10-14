import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from './components/Auth/Auth';
import Login from './components/Login/Login';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import VerifyOTP from './components/VerifyOTP/VerifyOTP';
import Register from './components/Register/Register';
import Onboard from './components/Onboard/Onboard';
import ConfirmEmail from './components/ConfirmEmail/ConfirmEmail';
import Company from './components/Company/Company';
import Bank from './components/Bank/Bank';
import UploadFiles from './components/Upload/Upload';
import Loader from './components/Loader/Loader';
import NotFound from './components/NotFound/NotFound';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './Actions/User';
import Redirect from './components/Redirect/Redirect';
import Home from './components/Home/Home';
import menuItems from './MenuItems';

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
                  </>
                ) : (
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