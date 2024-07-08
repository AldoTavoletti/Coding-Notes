
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import NoteDisplay from "../components/NoteDisplay";
import { URL } from "../utils/utils";
import { useSWRConfig } from "swr";
import Header from "../components/Header";
import Modals from "../components/Modals";
import { setUserTheme } from "../utils/utils";

import { useEffect, useRef, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { Flip, ToastContainer } from "react-toastify";

const HomePage = ({ isLoggedIn, setIsLoggedIn }) => {

    const navigate = useNavigate();

    const [currentNote, setCurrentNote] = useState({ noteID: null, folderName: null, folderID: null });

    // the title of the current note
    const [noteTitle, setNoteTitle] = useState("");

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

    // a state variable to determine where the user right clicked and on what element he did it
    const [contextMenuInfo, setContextMenuInfo] = useState({ x: null, y: null, elementID: null, elementType: null, folderName: null, folderColor: null });

    // this mutate is global, meaning I can mutate other URLs (in this case, it's used to refresh the notes list)
    const { mutate } = useSWRConfig();


    /**
      * @note check if the user is logged in (checks if $_SESSION["userID"] or a rememberme cookie is set).
      */
    const checkLoggedIn = () => {

        fetch(URL + "?check=login", {

            method: "GET",
            credentials: "include"

        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(data => {

            data["code"] === 200 ? setIsLoggedIn(data["username"]) : setIsLoggedIn(false);


        }).catch(err => console.log(err));

    };

    useEffect(() => {

        isLoggedIn === null && checkLoggedIn();

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
        <>
            <Modals setNoteTitle={ setNoteTitle } currentNote={ currentNote } setCurrentNote={ setCurrentNote } modalShowing={ modalShowing } setModalShowing={ setModalShowing } setIsLoggedIn={ setIsLoggedIn } isLoggedIn={ isLoggedIn } />

            <Header menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } />


            <div className="home-page">

                <ToastContainer 
                position="top-center"
                    autoClose={ 400 }
                    hideProgressBar={ true }
                    rtl={ false }
                    theme={localStorage.getItem("light-theme") ? "light":"dark"}
                    closeButton={false}
                    transition={Flip}
                    />

                <Menu contextMenuInfo={contextMenuInfo} setContextMenuInfo={setContextMenuInfo} noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } />

                {/* the noteDisplay gets unmounted when the menu is expanded. This means:
                - when the menu gets expanded and then it gets set to normal again, the note has to reload.
                - since the note reloads everytime, if the theme gets changed in the expanded menu every color will be fine. If the component wasn't getting unmounted, the skin of the editor wouldn't be able to change. Maybe something could have been done with css though.
                - if the note contains a lot of text, unmounting it makes the expanding of the menu's animation much smoother. 
                */ }
                { (menuStatus !== "expanded" && menuStatus !== "only-notelist") && <NoteDisplay contextMenuInfo={ contextMenuInfo } setContextMenuInfo={ setContextMenuInfo } menuStatus={ menuStatus } currentNote={ currentNote } isLoggedIn={ isLoggedIn } /> }

            </div>
        </>
    );
};

export default HomePage;