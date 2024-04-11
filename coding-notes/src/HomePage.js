
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";


import { useEffect, useState } from "react";

const HomePage = ({ setModalShowing, currentNote, setCurrentNote, noteTitle, setNoteTitle, isLoggedIn, setIsLoggedIn }) => {

    /*
    ?"normal" if the menu is not expanded nor hidden; 
    ?"expanded" if the menu expanded; 
    ?"hidden" if the menu hidden. 
    */
    const [menuStatus, setMenuStatus] = useState("normal");
    const navigate = useNavigate();
    
   

    useEffect(()=>{

        if (isLoggedIn === false) /* can't use !isLoggedIn, it would consider null too */ {
            navigate("/login");
        }

        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isLoggedIn]);


    return (

        <div className="home-page">

                    {/* sidemenu */ }
            <Menu noteTitle={noteTitle} setNoteTitle={setNoteTitle} menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } setIsLoggedIn={setIsLoggedIn} />

                    {/* the note display */ }
                    { (menuStatus !== "expanded") && <NoteDisplay menuStatus={ menuStatus } currentNote={ currentNote } /> }

        </div>

    );
};

export default HomePage;