
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";


import { useEffect, useState } from "react";

const HomePage = ({ modalShowing, setModalShowing, currentNote, setCurrentNote, noteTitle, setNoteTitle, isLoggedIn, setIsLoggedIn }) => {

    /*
    ?"normal" if the menu is not expanded nor hidden; 
    ?"expanded" if the menu expanded; 
    ?"hidden" if the menu hidden. 
    */
    const [menuStatus, setMenuStatus] = useState("expanded");
    const navigate = useNavigate();
    
   

    useEffect(()=>{

        if (isLoggedIn === false) /* can't use !isLoggedIn, it would consider null too */ {
            navigate("/login");
        }

        
    });


    return (

        <div className="home-page">

                    {/* sidemenu */ }
            <Menu noteTitle={noteTitle} setNoteTitle={setNoteTitle} menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

                    {/* the note display */ }
                    { (menuStatus !== "expanded") && <NoteDisplay noteTitle={noteTitle} setNoteTitle={setNoteTitle} menuStatus={ menuStatus } setMenuStatus={setMenuStatus} currentNote={ currentNote } /> }

        </div>

    );
};

export default HomePage;