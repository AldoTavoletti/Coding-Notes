/*
a website that gives the user the possibility to save coding notes. 
It should give the opportunity to write code in it. All the notes have to be saved in a DB created with XAMPP 
and connected to a PHP script. The react framework is used.
*/

import Header from "./Header";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import Modals from "./Modals";

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  /* 
  ?"none" if no modal is showing; 
  ?"folder" if the folder modal is showing; 
  ?"note" if it's the note modal. 
  */
  const [modalShowing, setModalShowing] = useState("none");

  return (
    <div className="App">

      <Modals modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

      <Header modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

      <BrowserRouter>
        <Routes>

          <Route path="/" element={ <HomePage modalShowing={ modalShowing } setModalShowing={ setModalShowing } /> } />
          <Route path="login" element={ <LoginPage /> } />

          {/* //todo: add a <Route path="*" element={<NoPage />} />, create a page for 404// */ }

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
