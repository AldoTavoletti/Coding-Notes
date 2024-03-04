
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";


import { useState } from "react";

const HomePage = ({ modalShowing, setModalShowing }) => {
    console.log('HomePage rerendered!');

    /*
    ?"normal" if the menu is not expanded nor hidden; 
    ?"expanded" if the menu expanded; 
    ?"hidden" if the menu hidden. 
    */
    const [menuStatus, setMenuStatus] = useState("expanded");

    // the note the user clicked
    const [currentNote, setCurrentNote] = useState(null);

    // the title of the current note
    const [noteTitle, setNoteTitle] = useState("");



    return (

        <div className="home-page">

                    {/* sidemenu */ }
                    <Menu noteTitle={noteTitle} menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

                    {/* the note display */ }
                    { (currentNote && menuStatus !== "expanded") && <NoteDisplay noteTitle={noteTitle} setNoteTitle={setNoteTitle} menuStatus={ menuStatus } currentNote={ currentNote } /> }

        </div>

    );
};

export default HomePage;