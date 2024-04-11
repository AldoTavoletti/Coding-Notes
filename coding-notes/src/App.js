import Header from "./Header";
import HomePage from "./HomePage";
import Modals from "./Modals";
import Login from "./Login";
import Page404 from "./Page404";

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { URL } from "./utils";

import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  /* 
  "none" if no modal is showing; 
  "folder" if the folder modal is showing; 
  "note" if it's the note modal. 
  */
  const [modalShowing, setModalShowing] = useState("none");

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
      credentials: "include",


    }).then(res => {

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();


    }).then(data => {

      data["code"] === 200 ? setIsLoggedIn(true) : setIsLoggedIn(false);


    }).catch(err => console.log(err));

  };

  //? using a useEffect is pointless here
  if (isLoggedIn === null) /* if the user just got into the website (isLoggedIn is null only at the start)*/ {

    checkLoggedIn();

  }

  return (
    
    <GoogleOAuthProvider clientId="225902902685-nfk9t53m1894vf4rmi4jj3fpp3o913cp.apps.googleusercontent.com">
      <div className="App">

        <Modals modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

        <Header currentNote={ currentNote } noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } />

        <BrowserRouter>
          <Routes>

            <Route path="/" element={ <HomePage isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } setModalShowing={ setModalShowing } currentNote={ currentNote } setCurrentNote={ setCurrentNote } noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } /> } />
            <Route path="/login" element={ <Login isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } setCurrentNote={ setCurrentNote } currentNote={ currentNote } noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } /> } />
            <Route path="*" element={<Page404 />} />

          </Routes>
        </BrowserRouter>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
