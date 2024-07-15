import React from "react";
import { useRef } from "react";
import Folder from "./Folder";
import ContextMenu from "./ContextMenu";
import SearchBar from "./SearchBar";
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    arrayMove
} from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";

import {
    closestCorners,
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
import { saveLastNoteTitle, switchNote, simplePatchCall, collapseFolders } from "../utils/utils";

const NoteList = ({ setFolders, folders, currentNote, setCurrentNote, menuStatus, setMenuStatus, setModalShowing, noteTitle, setNoteTitle, contextMenuInfo, setContextMenuInfo }) => {
    // used to settle the title of the last note, after another note has been clicked on
    const lastNote = useRef({ noteID: null, folderID: null });
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 }

        }),
        useSensor(TouchSensor, {

            activationConstraint: { delay: 500, tolerance: 5 }

        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    /**
     * 
     * @param {Object} item the clicked note 
     */
    const handleNoteClick = (note) => {

        saveLastNoteTitle(lastNote.current, folders, noteTitle);

        switchNote
            (
                note,
                setCurrentNote,
                setNoteTitle,
                setMenuStatus
            );


    };
    
    const handleDragEnd = (e) => {
        const { active, over } = e;
        active.id = parseInt(active.id);
        over.id = parseInt(over.id);

        if (active && over && active.id !== over.id) {

            const oldIndex = folders.findIndex((folder) => folder.folderID === active.id);
            const newIndex = folders.findIndex((folder) => folder.folderID === over.id);


            setFolders((folders) => {

                simplePatchCall({ oldIndex: oldIndex, newIndex: newIndex, folderID: active.id });
                return arrayMove(folders, oldIndex, newIndex);
            });

        }
    };

    /**
     * 
     * @param {Event} event 
     */
    const handleDragStart = (e) => {

        const collapseButton = document.getElementById("collapseButton" + parseInt(e.active.id));


        // remove the data-bs-toggle, so that the accordion doesn't open after the dragging finished (yes, if you drag an accordion towards the top, it opens, but with this rule it doesn't)
        collapseButton.removeAttribute("data-bs-toggle");

        collapseButton.querySelector(".accordion-button__folder-title").removeAttribute("data-bs-toggle");

        collapseFolders();

    };
    return (
        <DndContext modifiers={ [restrictToVerticalAxis, restrictToParentElement] } collisionDetection={ closestCorners } onDragEnd={ handleDragEnd } onDragStart={ handleDragStart } sensors={ sensors }>

            <div className="note-list">

                    <SearchBar handleNoteClick={handleNoteClick} />

                    <SortableContext items={ folders.map(folder=>folder.folderID+"-folder") } strategy={ verticalListSortingStrategy }>

                        { folders && folders.map((folder, folderIndex) => (

                            <Folder setFolders={setFolders} handleNoteClick={ handleNoteClick } lastNote={ lastNote } key={ folder.folderID } folder={ folder } folders={ folders } noteTitle={ noteTitle } folderIndex={ folderIndex } contextMenuInfo={ contextMenuInfo } setNoteTitle={ setNoteTitle } setMenuStatus={ setMenuStatus } setContextMenuInfo={ setContextMenuInfo } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } />

                        )) }
                    </SortableContext>
            </div>
            <ContextMenu folders={ folders } contextMenuInfo={ contextMenuInfo } setModalShowing={ setModalShowing } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setContextMenuInfo={ setContextMenuInfo } />
        </DndContext>

    );
};

export default NoteList;
