import NoteList from "./NoteList";

import Theme from "./Theme";

const Menu = ({ menuStatus, setMenuStatus, currentNote, setCurrentNote, setModalShowing, noteTitle, setNoteTitle, contextMenuInfo, setContextMenuInfo }) => {

    /**
     * @note collapse all the open folders using classes
     */
    const collapseFolders = () => {

        // get all the collapsible divs of open accordions
        const accordionCollapseDivs = document.querySelectorAll(".show");

        // get all the buttons of open accordions
        const accordionButtons = document.querySelectorAll("button.accordion-button:not(.collapsed)");
        console.log(accordionButtons);

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

        <div className={ `${"menu"} ${menuStatus === "normal" ? "menu--normal" : menuStatus === "expanded" ? "menu--expanded" : menuStatus === "hidden" ? "menu--hidden" : menuStatus === "only-notelist" && "menu--only-notelist"}` }>

            { menuStatus === "expanded" &&
                (
                    <div className="menu__toolbar menu__toolbar--expanded">


                        <div className="button-group">
                            <Theme />
                            <i className="bi bi-arrow-left" onClick={ () => setMenuStatus(window.innerWidth < 769 ? "hamburger" : "normal") }></i>
                        </div>
                    <button className="icon-text-button choose-note" onClick={ () => setMenuStatus("only-notelist") }><div><i className="bi bi-file-earmark-text"></i></div><span>Choose a note</span></button>

                        <button className="icon-text-button" onClick={ () => setModalShowing("folder") }><div><i className="bi bi-folder-plus"></i></div><span>Add a folder</span></button>
                        <button className="icon-text-button" onClick={ () => setModalShowing("note") }><div><i className="bi bi-file-plus"></i></div><span>Add a note</span></button>

                        {/* over-769 means it is shown only if the width is greater than 769 */}
                        <hr className="over-769" />

                        <button className="icon-text-button over-769" onClick={ () => expandFolders() }><div><i className="bi bi-arrows-expand"></i></div><span>Expand All</span></button>
                        <button className="icon-text-button over-769" onClick={ () => collapseFolders() }><div><i className="bi bi-arrows-collapse"></i></div><span>Collapse All</span></button>


                    </div>
                )
            }

            { menuStatus === "normal" &&
                (
                    <div className="menu__toolbar menu__toolbar--normal">
                        <div className="button-group">

                            <button className="icon-text-button" onClick={ () => setMenuStatus("expanded") }><div><i className="bi bi-three-dots-vertical"></i></div><span>manage</span></button>
                            <i className="bi bi-arrow-left" onClick={ () => setMenuStatus("hidden") }></i>
                        </div>

                    </div>
                )
            }

            { menuStatus === "hidden" &&
                (
                    <div className="menu__toolbar menu__toolbar--small">

                        <i className="bi bi-list" onClick={ () => setMenuStatus("normal") }></i>
                    <i className="bi bi-folder-plus" onMouseEnter={ (e) => e.target.classList.replace("bi-folder-plus", "bi-folder-fill") } onMouseLeave={ (e) => e.target.classList.replace("bi-folder-fill", "bi-folder-plus") } onClick={ () => setModalShowing("folder") }></i>
                    <i className="bi bi-file-plus" onMouseEnter={ (e) => e.target.classList.replace("bi-file-plus", "bi-file-plus-fill") } onMouseLeave={ (e) => e.target.classList.replace("bi-file-plus-fill", "bi-file-plus") } onClick={ () => setModalShowing("note") }></i>

                    </div>
                )
            }

            { menuStatus === "only-notelist" &&
                (
                    <div className="menu__toolbar menu__toolbar--only-notelist">

                        <i className="bi bi-arrow-left" onClick={ () => setMenuStatus("expanded") }></i>
                        <div className="double-button-radius-container">
                            <button className="secondary-button" onClick={ () => collapseFolders() }><i className="bi bi-arrows-collapse"></i> Collapse All</button>
                            <button className="secondary-button" onClick={ () => expandFolders() }><i className="bi bi-arrows-expand"></i> Expand All</button>
                        </div>
                    </div>



                )


            }




            {/* the noteList is always mounted so that open folders stay open even if the menu is closed and then reopened */ }
            <NoteList contextMenuInfo={contextMenuInfo} setContextMenuInfo={setContextMenuInfo} noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } currentNote={ currentNote } setCurrentNote={ setCurrentNote } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } setModalShowing={ setModalShowing } />

        </div>

    );
};

export default Menu;