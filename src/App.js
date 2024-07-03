import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Page404 from "./pages/Page404";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { URL } from "./utils/utils";

import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {

  // contains the username if the user is logged in. It's initally null, and becomes false if the user is not logged in.
  const [isLoggedIn, setIsLoggedIn] = useState(null);

 

  return (

    <GoogleOAuthProvider clientId={ process.env.REACT_APP_GOOGLE_CLIENT_ID } /* this could be public but I decided to put it in the .env file anyway */>

      <div className="app">

        <BrowserRouter>
          <Routes>

            <Route path="/" element={ <HomePage isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } /> } />
            <Route path="/login" element={ <Login isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } /> } />
            <Route path="*" element={ <Page404 /> } />

          </Routes>
        </BrowserRouter>
      </div>

    </GoogleOAuthProvider>
  );
}

export default App;
