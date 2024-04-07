import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="225902902685-nfk9t53m1894vf4rmi4jj3fpp3o913cp.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
);

