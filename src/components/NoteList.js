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
import { restrictToFirstScrollableAncestor, restrictToParentElement, restrictToVerticalAxis, restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";
import { getEventCoordinates } from '@dnd-kit/utilities';
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

    const noteListRef = useRef(null);
 
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

        setTimeout(() => {

            // i use a settimeout cause otherwise the accordion would expand as soon as the data-bs-toggle attribute is set again
            document.getElementById("collapseButton" + active.id).setAttribute("data-bs-toggle", "collapse");

        }, 1);
        
        if (active && over && active.id !== over.id) {

            const oldIndex = folders.findIndex((folder) => folder.folderID === active.id);
            const newIndex = folders.findIndex((folder) => folder.folderID === over.id);

           

            setFolders((folders) => {

                simplePatchCall({ oldIndex: oldIndex, newIndex: newIndex, folderID: active.id });

                folders[oldIndex].folderIndex = newIndex;
                folders[newIndex].folderIndex = oldIndex;

                return arrayMove(folders, oldIndex, newIndex);
            });



        }
    };

    /**
     * 
     * @param {Event} e
     */
    const handleDragStart = (e) => {
        const collapseButton = document.getElementById("collapseButton" + e.active.id);


        // remove the data-bs-toggle, so that the accordion doesn't open after the dragging finished (yes, if you drag an accordion towards the top, it opens, but with this rule it doesn't)
        collapseButton.removeAttribute("data-bs-toggle");

        collapseButton.querySelector(".accordion-button__folder-title").removeAttribute("data-bs-toggle");

        collapseFolders();



    };

    

    const snapYToCursor = ({
        activatorEvent,
        draggingNodeRect,
        transform,
    }) => {
        if (draggingNodeRect && activatorEvent) {
            const activatorCoordinates = getEventCoordinates(activatorEvent);

            if (!activatorCoordinates) {
                return transform;
            }

            const offsetY = activatorCoordinates.y - draggingNodeRect.top;

            return {
                ...transform,
                y: transform.y + offsetY - draggingNodeRect.height / 2,
            };
        }

        return transform;
    };


    return (
        <DndContext modifiers={ [restrictToVerticalAxis, snapYToCursor] } collisionDetection={ closestCorners } onDragEnd={ handleDragEnd } onDragStart={ handleDragStart } sensors={ sensors }>

            <div className="note-list" ref={noteListRef}>

                <SearchBar handleNoteClick={ handleNoteClick } />

                <SortableContext items={ folders.map(folder => folder.folderID) } strategy={ verticalListSortingStrategy }>

                    { folders && folders.map((folder, folderIndex) => (

                        <Folder setFolders={ setFolders } handleNoteClick={ handleNoteClick } lastNote={ lastNote } key={ folder.folderID } folder={ folder } folders={ folders } noteTitle={ noteTitle } folderIndex={ folderIndex } contextMenuInfo={ contextMenuInfo } setNoteTitle={ setNoteTitle } setMenuStatus={ setMenuStatus } setContextMenuInfo={ setContextMenuInfo } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } />

                    )) }
                </SortableContext>
            </div>
            <ContextMenu folders={ folders } contextMenuInfo={ contextMenuInfo } setModalShowing={ setModalShowing } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setContextMenuInfo={ setContextMenuInfo } />
        </DndContext>

    );
};

export default NoteList;
