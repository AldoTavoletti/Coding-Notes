/*
a website that gives the user the possibility to save coding notes. 
It should give the opportunity to write code in it. All the notes have to be saved in a DB created with XAMPP 
and connected to a PHP script. The react framework is used.
*/

import { useState } from "react";
import Header from "./Header";
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";
import Modals from "./Modals";


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
  const [menuStatus, setMenuStatus] = useState("normal");

  return (
    <div className="App">

      {/* the modals */ }
      <Modals modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

      {/* the header */ }
      <Header modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

      {/* the content */ }
      <div className="content">

        {/* sidemenu */ }
        <Menu menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } />

        {/* the current note */ }
        <NoteDisplay menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } />
      </div>
    </div>

  );
}

export default App;
