
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";
import { URL } from "./utils";
import { useSWRConfig } from "swr";

import { useEffect, useState } from "react";

const HomePage = ({ setModalShowing, currentNote, setCurrentNote, noteTitle, setNoteTitle, isLoggedIn, setIsLoggedIn }) => {

    const navigate = useNavigate();

    /*
    "normal" if the menu is not expanded nor hidden; 
    "expanded" if the menu expanded; 
    "hidden" if the menu hidden. 
    */
    const [menuStatus, setMenuStatus] = useState("normal");

    // this mutate is global, meaning I can mutate other URLs (in this case, it's used to refresh the notes list)
    const { mutate } = useSWRConfig();

    useEffect(() => {

        if (isLoggedIn === false) /* can't use !isLoggedIn, it would consider null too */ {

            navigate("/login");

        } else if (isLoggedIn) {

            /* 
            When a user logs in, the note list has to be refreshed, since "revalidateIfStale:false" was set due to performance reasons. 
            If this is taken out, there are some cases where the previous' user notes are shown, or no notes are shown.
            */
            mutate(URL + "?retrieve=all");

        }


    }, [isLoggedIn, mutate, navigate]);


    return (

        <div className="home-page">

            <Menu noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } setIsLoggedIn={ setIsLoggedIn } />

            {/* the noteDisplay is always mounted, even if the menu is expanded, so that when the menu gets closed EditorMCE doesn't have to reload. Everything is much smoother this way */ }
            <NoteDisplay menuStatus={ menuStatus } currentNote={ currentNote } />

        </div>

    );
};

export default HomePage;