
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import NoteDisplay from "../components/NoteDisplay";
import { URL } from "../utils/utils";
import { useSWRConfig } from "swr";
import Header from "../components/Header";
import Modals from "../components/Modals";

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

    if (isLoggedIn === null) /* loading screen as soon as you get into the website, until isLoggedIn is different from null */ {
        return (<div className="full-height-container"><LoadingScreen /></div>);
    }


    window.addEventListener("resize", () => {

        clearTimeout(timeoutID.current);
        timeoutID.current = setTimeout(() => {

            if (lastCheckedWidth.current !== window.innerWidth) /* if the width actually changed */ {

                if (window.innerWidth < 769 && (lastCheckedWidth.current > 769 || !lastCheckedWidth.current)) /* if the current width is < 769 and the last time it was > 769 */ {

                    if (menuStatus === "hidden" || menuStatus === "normal") /* if the menuStatus is "hidden" or "normal" */ {

                        // set it to "hamburger"
                        setMenuStatus("hamburger");

                    } else if (menuStatus === "expanded") /* if it is "expanded" */ {

                        // set it to "only-notelist"
                        setMenuStatus("only-notelist");

                    }

                } else if (window.innerWidth > 769 && (lastCheckedWidth.current < 769 || !lastCheckedWidth.current)) /* if the current width is > 769 and the last time it was < 769 */ {

                    // set it to "hidden"
                    setMenuStatus("hidden");


                }

                // save this width
                lastCheckedWidth.current = window.innerWidth;
            }


        }, 1);

    });

    return (
        <>
            <Modals modalShowing={ modalShowing } setModalShowing={ setModalShowing } setIsLoggedIn={ setIsLoggedIn } isLoggedIn={ isLoggedIn } />

            <Header menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } />


            <div className="home-page">

                <Menu noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } />

                {/* the noteDisplay gets unmounted when the menu is expanded. This means:
                - when the menu gets expanded and then it gets set to normal again, the note has to reload.
                - since the note reloads everytime, if the theme gets changed in the expanded menu every color will be fine. If the component wasn't getting unmounted, the skin of the editor wouldn't be able to change. Maybe something could have been done with css though.
                - if the note contains a lot of text, unmounting it makes the expanding of the menu's animation much smoother. 
                */ }
                { (menuStatus !== "expanded" && menuStatus !== "only-notelist") && <NoteDisplay menuStatus={ menuStatus } currentNote={ currentNote } /> }

            </div>
        </>
    );
};

export default HomePage;