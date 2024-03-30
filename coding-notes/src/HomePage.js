
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";


import { useState } from "react";

const HomePage = ({ modalShowing, setModalShowing, currentNote, setCurrentNote, noteTitle, setNoteTitle, userID, setUserID }) => {

    /*
    ?"normal" if the menu is not expanded nor hidden; 
    ?"expanded" if the menu expanded; 
    ?"hidden" if the menu hidden. 
    */
    const [menuStatus, setMenuStatus] = useState("expanded");

    
    console.log(userID);



    return (

        <div className="home-page">

                    {/* sidemenu */ }
            <Menu userID={ userID } setUserID={ setUserID } noteTitle={noteTitle} setNoteTitle={setNoteTitle} menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

                    {/* the note display */ }
                    { (currentNote && menuStatus !== "expanded") && <NoteDisplay noteTitle={noteTitle} setNoteTitle={setNoteTitle} menuStatus={ menuStatus } setMenuStatus={setMenuStatus} currentNote={ currentNote } /> }

        </div>

    );
};

export default HomePage;