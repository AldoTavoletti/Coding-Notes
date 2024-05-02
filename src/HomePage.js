
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";
import { URL } from "./utils";
import { useSWRConfig } from "swr";
import Header from "./Header";
import Modals from "./Modals";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

const HomePage = ({isLoggedIn, setIsLoggedIn }) => {

    const navigate = useNavigate();

    // the noteID of the note clicked by the user
    const [currentNote, setCurrentNote] = useState(null);

    // the title of the current note
    const [noteTitle, setNoteTitle] = useState("");

    /*
    "normal" if the menu is not expanded nor hidden; 
    "expanded" if the menu expanded; 
    "hidden" if the menu hidden. 
    */
    const [menuStatus, setMenuStatus] = useState("normal");

    const [modalShowing, setModalShowing] = useState("none");


    // this mutate is global, meaning I can mutate other URLs (in this case, it's used to refresh the notes list)
    const { mutate } = useSWRConfig();

    useEffect(() => {

        if (isLoggedIn === false) /* can't use !isLoggedIn, it would consider null too */ {
            currentNote && setCurrentNote(null);
            noteTitle !== "" && setNoteTitle("");
            navigate("/login");

        } else if (isLoggedIn) {

            /* 
            When a user logs in, the note list has to be refreshed, since "revalidateIfStale:false" was set due to performance reasons. 
            If this is taken out, there are some cases where the previous' user notes are shown, or no notes are shown.
            */
            mutate(URL + "?retrieve=all");

        }





    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, mutate, navigate]);


    if (isLoggedIn === null) /* loading screen as soon as you get into the website */{
        return (<div className="full-height-container"><LoadingScreen /></div>);
    }

    return (
        <>
            <Modals modalShowing={ modalShowing } setModalShowing={ setModalShowing } />

            <Header currentNote={ currentNote } noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } isLoggedIn={ isLoggedIn } />
            
            
            <div className="home-page">

                <Menu noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } setIsLoggedIn={ setIsLoggedIn } />

                {/* the noteDisplay is always mounted, even if the menu is expanded, so that when the menu gets closed EditorMCE doesn't have to reload. Everything is much smoother this way */ }
                <NoteDisplay menuStatus={ menuStatus } currentNote={ currentNote } />

            </div>
        </>
    );
};

export default HomePage;