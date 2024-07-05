import NoteList from "./NoteList";
import { useState } from "react";
import Theme from "./Theme";
import useSWR from "swr";
import { URL, simplePatchCall } from "../utils/utils";
import {
    arrayMove
} from '@dnd-kit/sortable';
import { useEffect } from "react";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";

import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
const Menu = ({ menuStatus, setMenuStatus, currentNote, setCurrentNote, setModalShowing, noteTitle, setNoteTitle, contextMenuInfo, setContextMenuInfo }) => {

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 }

        }),
        useSensor(TouchSensor, {

            activationConstraint: { distance: 5 }

        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [folders, setFolders] = useState([]);


    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

    const { data, isValidating, error } = useSWR(URL + `?retrieve=all`, fetcher);

    useEffect(() => {

        if (data) {
            // copy the data read-only array to create a modifiable folders array
            setFolders([...data]);
        }

    }, [data]);


    if (error) return (<div className="note-list"><div className='failed'>Error</div></div>);

    //the notelist is not shown in the expanded menu on screens with width less than 769, so showing the spinner would be wrong
    if (isValidating && window.innerWidth < 769 && menuStatus === "expanded") return (<></>);



    /**
     * @note collapse all the open folders using classes
     */
    const collapseFolders = () => {
        // get all the collapsible divs of open accordions
        const accordionCollapseDivs = document.querySelectorAll(".show");

        // get all the buttons of open accordions
        const accordionButtons = document.querySelectorAll("button.accordion-button:not(.collapsed)");

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

    const handleDragEnd = (e) => {
        const { active, over } = e;
        console.log(e);
        if (active && over && active.id !== over.id) {

            if (e.activatorEvent.target.classList.contains("accordion-button")) {
                const oldIndex = folders.findIndex((folder) => folder.folderID === active.id);
                const newIndex = folders.findIndex((folder) => folder.folderID === over.id);


                setFolders((folders) => {

                    simplePatchCall({ oldIndex: oldIndex, newIndex: newIndex, folderID: active.id });
                    return arrayMove(folders, oldIndex, newIndex);
                });

            } else {
                let note = e.activatorEvent.target;
                if (!e.activatorEvent.target.classList.contains("note-list__note")) {
                    note = e.activatorEvent.target.parentElement;
                }

                console.log(note.getAttribute("parent-folder-index"));
                const parentFolder = folders[note.getAttribute("parent-folder-index")];

                const oldIndex = parentFolder.notes.findIndex((note) => note.noteID === active.id);
                const newIndex = parentFolder.notes.findIndex((note) => note.noteID === over.id);
                parentFolder.notes = arrayMove(parentFolder.notes, oldIndex, newIndex);

                const index = folders.findIndex((folder) => folder.folderID === parentFolder.folderID);
                const newFolders = folders.map((folder, i) => {

                    if (i === index) {
                        return parentFolder;
                    }
                    return folder;

                });

                setFolders(() => {
                    simplePatchCall({ oldIndex: oldIndex, newIndex: newIndex, noteID: active.id, folderID: parentFolder.folderID });

                    return newFolders;
                });


            }
        }
    };

    /**
     * 
     * @param {Event} event 
     */
    const handleDragStart = (e) => {
        const collapseButton = document.getElementById("collapseButton" + e.active.id);

        if (collapseButton)/* if a folder is being dragged */ {

            // remove the data-bs-toggle, so that the accordion doesn't open after the dragging finished (yes, if you drag an accordion towards the top, it opens, but with this rule it doesn't)
            collapseButton.removeAttribute("data-bs-toggle");

            // collapse all the folders
            collapseFolders();

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

                        {/* over-769 means it is shown only if the width is greater than 769 */ }
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



            <DndContext modifiers={ [restrictToVerticalAxis, restrictToParentElement] } collisionDetection={ closestCenter } onDragEnd={ handleDragEnd } onDragStart={ handleDragStart } sensors={ sensors }>

                {/* the noteList is always mounted so that open folders stay open even if the menu is closed and then reopened */ }
                <NoteList folders={ folders } contextMenuInfo={ contextMenuInfo } setContextMenuInfo={ setContextMenuInfo } noteTitle={ noteTitle } setNoteTitle={ setNoteTitle } currentNote={ currentNote } setCurrentNote={ setCurrentNote } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } setModalShowing={ setModalShowing } />

            </DndContext>


        </div>

    );
};

export default Menu;