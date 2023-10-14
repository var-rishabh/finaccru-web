import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider as ReduxProvider } from "react-redux";
import store from "./Store";
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ConfigProvider as AntdConfigProvider } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ToastContainer />
    <AntdConfigProvider theme={{
      components: {
        Menu: {
          itemSelectedColor: '#36BAA6',
          itemColor: '#064061',
          itemHoverColor: '#064061',
          itemHoverBg: 'none',
          itemSelectedBg: 'none',
          itemActiveBg: 'none',
          itemActiveColor: '#064061',
          iconMarginInlineEnd: '1rem',
        }
      }
    }}>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
    </AntdConfigProvider>
  </>
);

