import { createContext, useState } from "react";
import { noteBodyContext } from "./noteBodyContext";
import { noteTitleContext } from "./noteTitleContext";
import Menu from "./Menu";

import NoteDisplay from "./NoteDisplay";

const HomePage = ({modalShowing, setModalShowing}) => {

    const [currentNote, setCurrentNote] = useState(null);

    const [noteTitle, setNoteTitle] = useState("");
    const [noteBody, setNoteBody] = useState("");

    

    /*
    "normal" if the menu is not expanded nor hidden; 
    "expanded" if the menu expanded; 
    "hidden" if the menu hidden. 
    */
    const [menuStatus, setMenuStatus] = useState("expanded");

    return ( 

        <div className="home-page">

                <noteTitleContext.Provider value={ [noteTitle, setNoteTitle] }>
                    <noteBodyContext.Provider value={ [noteBody, setNoteBody] }>

                        {/* sidemenu */ }
                        <Menu menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

                        {/* the current note */ }
                        { (currentNote && menuStatus !== "expanded") && <NoteDisplay menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } /> }

                    </noteBodyContext.Provider>
                </noteTitleContext.Provider>

        </div>

     );
}
 
export default HomePage;