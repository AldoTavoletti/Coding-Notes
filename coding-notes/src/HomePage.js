
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";


import { useEffect, useState } from "react";

const HomePage = ({ setModalShowing, currentNote, setCurrentNote, noteTitle, setNoteTitle, isLoggedIn, setIsLoggedIn }) => {

    const navigate = useNavigate();

    /*
    "normal" if the menu is not expanded nor hidden; 
    "expanded" if the menu expanded; 
    "hidden" if the menu hidden. 
    */
    const [menuStatus, setMenuStatus] = useState("normal");

    useEffect(() => {

        if (isLoggedIn === false) /* can't use !isLoggedIn, it would consider null too */ {
            navigate("/login");
        }


    }, [isLoggedIn, navigate]);


    return (

        <div className="home-page">

            <Menu noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } setIsLoggedIn={ setIsLoggedIn } />
            
            {/* the noteDisplay is always mounted, even if the menu is expanded, so that when the menu gets closed EditorMCE doesn't have to reload. Everything is much smoother this way */ }
            <NoteDisplay menuStatus={ menuStatus } currentNote={ currentNote } />

        </div>

    );
};

export default HomePage;