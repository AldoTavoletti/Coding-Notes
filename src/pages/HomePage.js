import Menu from "../components/Menu";
import NoteDisplay from "../components/NoteDisplay";
import { useState } from "react";

const HomePage = (
    {
        isLoggedIn,
        menuStatus,
        setMenuStatus,
        currentNote,
        setCurrentNote,
        noteTitle,
        setNoteTitle,
        setModalShowing
    }) => {

    // a state variable to determine where the user right clicked and on what element he did it
    const [contextMenuInfo, setContextMenuInfo] = useState({ x: null, y: null, element: null });

    return (

        <div className="home-page">

            <Menu 
            contextMenuInfo={ contextMenuInfo } 
            setContextMenuInfo={ setContextMenuInfo } 
            noteTitle={ noteTitle } 
            setNoteTitle={ setNoteTitle } 
            menuStatus={ menuStatus } 
            setMenuStatus={ setMenuStatus } 
            currentNote={ currentNote } 
            setCurrentNote={ setCurrentNote } 
            setModalShowing={ setModalShowing } 
            />

            {/* 
            the noteDisplay gets unmounted when the menu is expanded. This means:
                - when the menu gets expanded and then it gets set to normal again, the note has to reload.
                - since the note reloads everytime, if the theme gets changed in the expanded menu every color will be fine. If the component wasn't getting unmounted, the skin of the editor wouldn't be able to change. Maybe something could have been done with css though.
                - if the note contains a lot of text, unmounting it makes the expanding of the menu's animation much smoother. 
            */ }
            { (menuStatus !== "expanded" && menuStatus !== "only-notelist") && 
            <NoteDisplay 
            contextMenuInfo={ contextMenuInfo } 
            setContextMenuInfo={ setContextMenuInfo } 
            menuStatus={ menuStatus } 
            currentNote={ currentNote } 
            isLoggedIn={ isLoggedIn } /> 
            }

        </div>
    );
};

export default HomePage;