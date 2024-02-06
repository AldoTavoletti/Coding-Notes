
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";

import { noteTitleContext } from "./noteTitleContext";
import { noteBodyContext } from "./noteBodyContext";

import { useState } from "react";

const HomePage = ({ modalShowing, setModalShowing }) => {

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

    // the body of the current note
    const [noteBody, setNoteBody] = useState("");

    //|| the noteTitle and noteBody state variables are passed over to the other components via Context.

    return (

        <div className="home-page">

            <noteTitleContext.Provider value={ [noteTitle, setNoteTitle] }>
                <noteBodyContext.Provider value={ [noteBody, setNoteBody] }>

                    {/* sidemenu */ }
                    <Menu menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

                    {/* the note display */ }
                    { (currentNote && menuStatus !== "expanded") && <NoteDisplay menuStatus={ menuStatus } currentNote={ currentNote } /> }

                </noteBodyContext.Provider>
            </noteTitleContext.Provider>

        </div>

    );
};

export default HomePage;