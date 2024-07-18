import Modals from "../components/Modals";
import Header from "../components/Header";
import HomePage from "./HomePage";
import LoadingScreen from "./LoadingScreen";
import { setUserTheme, URL, checkLoggedIn, debounce } from "../utils/utils";


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";

const PersonalArea = (
    {
        isLoggedIn,
        setIsLoggedIn
    }) => {

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
    "note" if it's the note modal;
    an object for other circumstances
    */
    const [modalShowing, setModalShowing] = useState("none");

    const [windowSize, setWindowSize] = useState();

    const navigate = useNavigate();

    const { mutate } = useSWRConfig();

    useEffect(() => {

        isLoggedIn === null && checkLoggedIn(setIsLoggedIn);

        setUserTheme();

        window.addEventListener("resize", debouncedResizeCheck);

        return () => window.removeEventListener("resize", debouncedResizeCheck);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        if (isLoggedIn === false) /* isLoggedIn is false after checkLoggedIn and no loggedIn user is found */ {

            setCurrentNote({ noteID: null, folderName: null, folderID: null });
            setNoteTitle("");
            navigate("/login");

        } else if (isLoggedIn) mutate(URL + "?retrieve=all");

        /*
        When a user logs in, the note list has to be refreshed, since "revalidateIfStale:false" was set due to performance reasons. 
        If mutate is taken out, there would be some cases where the previous' user notes are shown, or no notes are shown.
        */


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    useEffect(() => {

        setMenuStatus((current) => {

            if (window.innerWidth < 769) {

                if (menuStatus === "hidden" || menuStatus === "normal") return "hamburger";

            } else if (window.innerWidth > 769) {

                if (menuStatus === "only-notelist") return "expanded";

                if (menuStatus === "hamburger") return "hidden";

            }

            return current;

        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowSize]);

    const debouncedResizeCheck = debounce(() => {

        setWindowSize(window.innerWidth);

    }, 100);


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
                setMenuStatus={ setMenuStatus }
            />
            <Header
                menuStatus={ menuStatus }
                setMenuStatus={ setMenuStatus }
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