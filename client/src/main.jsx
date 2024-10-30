import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import persistor, { store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
PersistGate;
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} />
      <BrowserRouter>
        <Toaster />
        <Layout>
          <App />
        </Layout>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
