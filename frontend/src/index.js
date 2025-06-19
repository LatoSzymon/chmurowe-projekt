import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import keycloak from "./kaycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";

console.log("Keycloak object:", keycloak);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{ onLoad: 'login-required' }}
  >
    <App />
  </ReactKeycloakProvider>
);


reportWebVitals();
