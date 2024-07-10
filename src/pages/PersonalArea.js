import Modals from "../components/Modals";
import Header from "../components/Header";
import HomePage from "./HomePage";
import LoadingScreen from "./LoadingScreen";

import { setUserTheme, URL, checkLoggedIn } from "../utils/utils";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";

const PersonalArea = (
    {
        isLoggedIn,
        setIsLoggedIn
    }) => {

    const navigate = useNavigate();

    // this mutate is global, meaning I can mutate other URLs (in this case, it's used to refresh the notes list)
    const { mutate } = useSWRConfig();

    // the title of the current note
    const [noteTitle, setNoteTitle] = useState("");

    const [currentNote, setCurrentNote] = useState({ noteID: null, folderName: null, folderID: null });

    /*
   "normal" if the menu is not expanded nor hidden; 
   "expanded" if the menu expanded; 
   "hamburger" if the window.innerWidth is < 769;
   "only-notelist" if the window.innerWidth is < 769;
   "hidden" if the menu hidden. 
   if window.innerWidth is < 769 make the website start in the only-notelist menu, otherwise in the normal 
   */
    const [menuStatus, setMenuStatus] = useState(() => window.innerWidth < 769 ? "only-notelist" : "normal");

    /*
    "none" if no modal is showing; 
    "folder" if the folder modal is showing; 
    "note" if it's the note modal. 
    */
    const [modalShowing, setModalShowing] = useState("none");


    useEffect(() => {

        isLoggedIn === null && checkLoggedIn(setIsLoggedIn);

        setUserTheme();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        if (isLoggedIn === false) /*//? can't use !isLoggedIn, it would consider null too */ {

            setCurrentNote({ noteID: null, folderName: null, folderID: null });
            setNoteTitle("");
            navigate("/login");

        } else if (isLoggedIn) {

            /* 
            When a user logs in, the note list has to be refreshed, since "revalidateIfStale:false" was set due to performance reasons. 
            If this is taken out, there would be some cases where the previous' user notes are shown, or no notes are shown.
            */
            mutate(URL + "?retrieve=all");

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    //used in the resize eventListener. Without a timeout, even if it's 1ms, the function could be executed multiple times for the same size. 
    const timeoutID = useRef();

    /* this ref checks the last width registered. It's used to check if an actual resize took place, sometimes the event is called multiple times for just one resize. */
    const lastCheckedWidth = useRef(window.innerWidth);

    window.addEventListener("resize", () => {

        clearTimeout(timeoutID.current);
        timeoutID.current = setTimeout(() => {

            if (lastCheckedWidth.current !== window.innerWidth) /* if the width actually changed */ {

                if (window.innerWidth < 769 && lastCheckedWidth.current > 769) /* if the current width is < 769 and the last time it was > 769*/ {

                    if (menuStatus === "hidden" || menuStatus === "normal") /* if the menuStatus is "hidden" or "normal" */ {

                        // set it to "hamburger"
                        setMenuStatus("hamburger");

                    }

                } else if (window.innerWidth > 769 && lastCheckedWidth.current < 769) /* if the current width is > 769 and the last time it was < 769 */ {

                    if (menuStatus === "only-notelist") {

                        setMenuStatus("expanded");

                    }
                    if (menuStatus === "hamburger") {
                        // set it to "hidden"
                        setMenuStatus("hidden");

                    }


                }

                // save this width
                lastCheckedWidth.current = window.innerWidth;
            }


        }, 1);

    });

    if (isLoggedIn === null) /* loading screen as soon as you get into the website, until isLoggedIn is different from null */ {
        return (<div className="full-height-container"><LoadingScreen /></div>);
    }

    return (

        <div className="personal-area">

            <Modals
                currentNote={ currentNote }
                setCurrentNote={ setCurrentNote }
                modalShowing={ modalShowing }
                setModalShowing={ setModalShowing }
                isLoggedIn={ isLoggedIn }
                setIsLoggedIn={ setIsLoggedIn }
                setNoteTitle={ setNoteTitle }
                setMenuStatus={setMenuStatus}
            />
            <Header
                menuStatus={ menuStatus }
                setMenuStatus={ setMenuStatus }
                noteTitle={ noteTitle }
                setNoteTitle={ setNoteTitle }
                isLoggedIn={ isLoggedIn }
                setIsLoggedIn={ setIsLoggedIn }
                currentNote={ currentNote }
            />
            
            <HomePage
                menuStatus={ menuStatus }
                setMenuStatus={ setMenuStatus }
                noteTitle={ noteTitle }
                setNoteTitle={ setNoteTitle }
                isLoggedIn={ isLoggedIn }
                currentNote={ currentNote }
                setCurrentNote={ setCurrentNote }
                setModalShowing={ setModalShowing }
            />

        </div>

    );
};

export default PersonalArea;