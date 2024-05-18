
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";
import { URL } from "./utils";
import { useSWRConfig } from "swr";
import Header from "./Header";
import Modals from "./Modals";

import { useEffect, useRef, useState } from "react";
import LoadingScreen from "./LoadingScreen";

const HomePage = ({ isLoggedIn, setIsLoggedIn }) => {

    const navigate = useNavigate();

    // the noteID of the note clicked by the user
    const [currentNote, setCurrentNote] = useState(null);

    // the title of the current note
    const [noteTitle, setNoteTitle] = useState("");

    /*
    "normal" if the menu is not expanded nor hidden; 
    "expanded" if the menu expanded; 
    "hidden" if the menu hidden. 
    When the width goes under 769 pixels its value is set to hamburger
    */
    const [menuStatus, setMenuStatus] = useState(() => window.innerWidth < 769 ? "hamburger" : "normal");

    /*
  "none" if no modal is showing; 
  "folder" if the folder modal is showing; 
  "note" if it's the note modal. 
  */
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
            If this is taken out, there would be some cases where the previous' user notes are shown, or no notes are shown.
            */
            mutate(URL + "?retrieve=all");

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, mutate, navigate]);

    const timeoutID = useRef();

    /*
     this ref checks the last width registered. It's not important for PCs, but it is for smartphones and tablets. Matter of fact, when you open the keyboard 
     the resize event is called. So to make sure the the menustatus is called when an actual resize took place, this ref is used. Without it, if you click on the hamburger
     menu while you have the keyboard open, the expanded menu would be opened and then it would switch right back to hamburger because this line would be executed "menuStatus !== "hamburger" && setMenuStatus("hamburger");" 
     */
    const lastCheckedWidth = useRef();

    if (isLoggedIn === null) /* loading screen as soon as you get into the website */ {
        return (<div className="full-height-container"><LoadingScreen /></div>);
    }


    window.addEventListener("resize", () => {
        clearTimeout(timeoutID.current);
        timeoutID.current = setTimeout(() => {


            if (window.innerWidth < 769 && lastCheckedWidth.current !== window.innerWidth) {

                menuStatus !== "hamburger" && setMenuStatus("hamburger");

            } else {

                menuStatus === "hamburger" && setMenuStatus("hidden");


            }
            lastCheckedWidth.current = window.innerWidth;

        }, 200);

    });

    return (
        <>
            <Modals modalShowing={ modalShowing } setModalShowing={ setModalShowing } setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />

            <Header menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } isLoggedIn={ isLoggedIn } setIsLoggedIn={setIsLoggedIn}/>


            <div className="home-page">

                <Menu noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } isLoggedIn={isLoggedIn} setIsLoggedIn={ setIsLoggedIn } />

                {/* the noteDisplay is always mounted, even if the menu is expanded, so that when the menu gets closed EditorMCE doesn't have to reload. Everything is much smoother this way */ }
                { menuStatus !== "expanded" && <NoteDisplay menuStatus={ menuStatus } currentNote={ currentNote } /> }

            </div>
        </>
    );
};

export default HomePage;