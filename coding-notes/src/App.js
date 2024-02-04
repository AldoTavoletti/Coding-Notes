/*
a website that gives the user the possibility to save coding notes. 
It should give the opportunity to write code in it. All the notes have to be saved in a DB created with XAMPP 
and connected to a PHP script. The react framework is used.
*/

import { createContext, useState } from "react";
import Header from "./Header";
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";
import Modals from "./Modals";
import { noteBodyContext } from "./noteBodyContext";
import { noteTitleContext } from "./noteTitleContext";

function App() {
  /* 
  "none" if no modal is showing; 
  "folder" if the modal folder is showing; 
  "note" if it's the modal note. 
  */
  const [modalShowing, setModalShowing] = useState("none");

  /*
  "normal" if the menu is not expanded nor hidden; 
  "expanded" if the menu expanded; 
  "hidden" if the menu hidden. 
  */
  const [menuStatus, setMenuStatus] = useState("expanded");

  const [currentNote, setCurrentNote] = useState(null);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  return (
    <div className="App">

      {/* the modals */ }
      <Modals modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

      {/* the header */ }
      <Header modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

      {/* the content */ }
      <div className="content">

        <noteTitleContext.Provider value={ [noteTitle, setNoteTitle] }>
          <noteBodyContext.Provider value={ [noteBody, setNoteBody] }>

            {/* sidemenu */ }
            <Menu menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

            {/* the current note */ }
            { (currentNote && menuStatus !== "expanded") && <NoteDisplay menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } /> }
          
          </noteBodyContext.Provider>
        </noteTitleContext.Provider>
      </div>
    </div>

  );
}

export default App;
