import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { ConfigProvider, theme } from "antd";
import en_US from 'antd/lib/locale/en_US';
import "dayjs/locale/en"
import dayjs from "dayjs";


dayjs.locale("en")


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={theme.darkAlgorithm} locale={en_US}>
      <App />

    </ConfigProvider>
  </React.StrictMode>,
);
