import NoteList from "./NoteList";

import $ from "jquery";
import { URL } from "./utils";

const Menu = ({ menuStatus, setMenuStatus, currentNote, setCurrentNote, setModalShowing, noteTitle, setNoteTitle, setIsLoggedIn }) => {

    /**
     * @note handles the user's logout
     */
    const logout = () => {

        fetch(URL + "?logout=true", {

            method: "GET",
            credentials: "include",


        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(data => {

            data["code"] === 200 && setIsLoggedIn(false);


        }).catch(err => console.log(err));


    };

    /**
     * @note collapse all the open folders using classes
     */
    const collapseFolders = () => {

        // get all the collapsible divs of open accordions
        const accordionCollapseDivs = document.querySelectorAll(".show");

        // get all the buttons of open accordions
        const accordionButtons = document.querySelectorAll("button.accordion-button");

        const n = accordionCollapseDivs.length;


        for (let i = 0; i < n; i++) {

            // collapse the folder
            accordionCollapseDivs[i].classList.remove("show");

            // make the accordion button arrow change direction
            accordionButtons[i].classList.add("collapsed");


        }



    };
    /**
    * @note expand all the open folders using classes
    */
    const expandFolders = () => {

        // get all the expandible divs of open accordions
        const accordionCollapseDivs = document.querySelectorAll(".collapse:not(.show)");

        // get all the buttons of closed accordions
        const accordionButtons = document.querySelectorAll("button.accordion-button.collapsed");

        const n = accordionButtons.length;

        for (let i = 0; i < n; i++) {

            // expand the folder
            accordionCollapseDivs[i].classList.add("show");

            // make the accordion button arrow change direction
            accordionButtons[i].classList.remove("collapsed");
        }

    };

    return (

        <div className={ `${"menu"} ${menuStatus === "expanded" ? "menu--expanded" : menuStatus === "hidden" && "menu--hidden"}` }>


            <div className="menu__functionalities">

                { menuStatus === "normal" &&
                    (
                        <div className="subheader--normal">

                            <button className="text-button" onClick={ () => setMenuStatus("expanded") }>expand</button>
                            <i class="bi bi-arrow-bar-left" onClick={ () => setMenuStatus("hidden") }></i>

                        </div>
                    )
                }






                { menuStatus === "hidden" &&
                    (
                        <div className="subheader--small" onClick={ () => setMenuStatus("normal") }>

                            <button className="arrow right"></button>

                        </div>
                    )
                }






                { menuStatus === "expanded" &&
                    (
                        <div className="subheader--expanded">

                            <div className="header__buttons-div">

                                <button className="text-button" onClick={ () => logout() }>logout</button>

                                <div className="vert-line"></div>

                                <button className="primary-button" onClick={ () => setModalShowing("folder") }>Add a folder +</button>
                                <button className="primary-button" onClick={ () => setModalShowing("note") }>Add a note +</button>

                                <div className="vert-line"></div>

                                <button className="secondary-button" onClick={ () => expandFolders() }>Expand All</button>
                                <button className="secondary-button" onClick={ () => collapseFolders() }>Collapse All</button>

                            </div>

                            <i class="bi bi-arrow-bar-left" onClick={ () => setMenuStatus("normal") }></i>


                        </div>
                    )
                }

            </div>



            {/* the noteList is always mounted, even if the menu is hidden, so that open folders stay open even if the menu is closed and then reopened */ }
            <NoteList noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } currentNote={ currentNote } setCurrentNote={ setCurrentNote } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } setModalShowing={ setModalShowing } />

        </div>

    );
};

export default Menu;