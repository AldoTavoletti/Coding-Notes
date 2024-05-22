import NoteList from "./NoteList";

import DarkMode from "./DarkMode";

const Menu = ({ menuStatus, setMenuStatus, currentNote, setCurrentNote, setModalShowing, noteTitle, setNoteTitle, setIsLoggedIn, isLoggedIn }) => {

    

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


                            <button className="primary-button" onClick={ () => setMenuStatus("expanded") }>manage</button>
                            <i class="bi bi-arrow-left" onClick={ () => setMenuStatus("hidden") }></i>
                        </div>
                    )
                }






                { menuStatus === "hidden" &&
                    (
                        <div className="subheader--small" onClick={ () => setMenuStatus("normal") }>

                            <i className="bi bi-arrow-right"></i>

                        </div>
                    )
                }






                { menuStatus === "expanded" &&
                    (
                        <div className="subheader--expanded">

                            <div className="header__buttons-div">

                                <div className="button-group" style={ { marginTop: "10px" } }>
                                    <DarkMode />
                                    <i class="bi bi-arrow-left" onClick={ () => setMenuStatus(window.innerWidth < 769 ? "hamburger" : "normal") }></i>
                                </div>

                            <button onClick={ () => setModalShowing("folder") }><i class="bi bi-folder-plus"></i> Add a folder</button>
                            <button onClick={ () => setModalShowing("note") }><i class="bi bi-file-plus"></i> Add a note</button>
                                <hr />

                            <button onClick={ () => expandFolders() }><i class="bi bi-arrows-expand"></i> Expand All</button>
                            <button onClick={ () => collapseFolders() }><i class="bi bi-arrows-collapse"></i> Collapse All</button>

                            </div>

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