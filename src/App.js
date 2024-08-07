import PersonalArea from "./pages/PersonalArea";
import Login from "./pages/Login";
import Page404 from "./pages/Page404";

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  // contains the username if the user is logged in. It's initally null, and becomes false if the user is not logged in.
  const [isLoggedIn, setIsLoggedIn] = useState(null);


  return (

      <div className="app">

        <BrowserRouter>
          <Routes>

            <Route path="/" element={ <PersonalArea isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } /> } />
            <Route path="/login" element={ <Login setIsLoggedIn={ setIsLoggedIn } /> } />
            <Route path="*" element={ <Page404 /> } />

          </Routes>
        </BrowserRouter>

      </div>

  );
}

export default App;
