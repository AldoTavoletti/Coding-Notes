import HomePage from "./HomePage";
import Login from "./Login";
import Page404 from "./Page404";
import { Suspense } from "react";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { URL } from "./utils";

import { GoogleOAuthProvider } from '@react-oauth/google';
import LoadingScreen from "./LoadingScreen";
function App() {

  /* 
  "none" if no modal is showing; 
  "folder" if the folder modal is showing; 
  "note" if it's the note modal. 
  */

  // the noteID of the note clicked by the user
  const [currentNote, setCurrentNote] = useState(null);

  // the title of the current note
  const [noteTitle, setNoteTitle] = useState("");

  // checks wether the user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState(null);


  /**
   * @note check if the user is logged in (checks if $_SESSION["userID"] is set)
   */
  const checkLoggedIn = () => {

    fetch(URL + "?check=login", {

      method: "GET",
      credentials: "include"
      


    }).then(res => {
      console.log(res);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();


    }).then(data => {
      console.log(data);
      data["code"] === 200 ? setIsLoggedIn(true) : setIsLoggedIn(false);


    }).catch(err => console.log(err));

  };

  //? using a useEffect is pointless here

  if (isLoggedIn === null) /* if the user just got into the website (isLoggedIn is null only at the start)*/ {

    checkLoggedIn();

  }


  return (

    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} /* this could be public but I decided to put it in the .env file anyway */>


      <div className="App">

        

        <BrowserRouter>
          <Routes>

            <Route path="/" element={ <HomePage isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } currentNote={ currentNote } setCurrentNote={ setCurrentNote } noteTitle={ noteTitle } setNoteTitle={ setNoteTitle }/> } />
            <Route path="/login" element={ <Login isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } setCurrentNote={ setCurrentNote } currentNote={ currentNote } noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } /> } />
            <Route path="*" element={ <Page404 /> } />

          </Routes>
        </BrowserRouter>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
