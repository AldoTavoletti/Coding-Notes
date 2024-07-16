import { getContrastColor, openMenu, folderColors, simplePatchCall } from "../utils/utils";
import Note from "./Note";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    SortableContext,
    verticalListSortingStrategy,
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
    arrayMove
} from '@dnd-kit/sortable';

import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
const Folder = ({ setFolders, handleNoteClick, lastNote, setMenuStatus, folder, folders, folderIndex, setModalShowing, contextMenuInfo, setContextMenuInfo, currentNote, setCurrentNote, noteTitle, setNoteTitle }) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        setActivatorNodeRef
    } = useSortable({ id: folder.folderID });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

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








    const handleDragEnd = (e) => {
        const { active, over } = e;

        if (active && over && active.id !== over.id) {

        const oldIndex = folder.notes.findIndex((note) => note.noteID === active.id);
        const newIndex = folder.notes.findIndex((note) => note.noteID === over.id);
        folder.notes = arrayMove(folder.notes, oldIndex, newIndex);
        
        const newFolders = [...folders];
        newFolders[folder.folderIndex] = folder;

        setFolders(() => {

            folder.notes[oldIndex].noteIndex = newIndex;
            folder.notes[newIndex].noteIndex = oldIndex;


            simplePatchCall({ oldIndex: oldIndex, newIndex: newIndex, noteID: active.id, folderID: folder.folderID });

            return newFolders;
        });
    }

    };


    return (

        <div
            className={ `accordion ${getContrastColor(folderColors[folder.color].primary) === "#ffffff" ? "accordion__white-svg" : "accordion__black-svg"}` }
            onContextMenu={ (e) => openMenu(e, setContextMenuInfo, folder) }
            id={ "accordion" + folderIndex }
            ref={ setNodeRef }
            style={ style }

        >

            <div className="accordion-item">

                <h2 className="accordion-header">


                    <button ref={ setActivatorNodeRef } { ...attributes } { ...listeners } id={ "collapseButton" + folder.folderID } className="accordion-button collapsed" style={ { '--border-color': folderColors[folder.color].secondary, backgroundColor: folderColors[folder.color].primary, color: getContrastColor(folderColors[folder.color].primary) } } type="button" data-bs-toggle="collapse" data-bs-target={ "#collapse" + folderIndex } aria-expanded="false" aria-controls="collapseThree">
                        <span className="accordion-button__folder-title" style={ { color: getContrastColor(folderColors[folder.color].secondary) } } >{ folder.folderName }</span>
                        <span
                            className="non-collapsing plus-button" data-bs-toggle="collapse" data-bs-target // i set these attributes cause it works like a e.stopPropagation()
                            onClick={ (e) => setModalShowing({ folderID: folder.folderID, folderName: folder.folderName }) } //open the note modal
                            style={ { '--hover-color': getContrastColor(folderColors[folder.color].secondary), color: getContrastColor(folderColors[folder.color].secondary) + "cc" } } // set a style variable relative to the note color and set a visible text color 
                        >+</span>
                        <span className="accordion-button__folder-notesnumber" style={ { color: getContrastColor(folderColors[folder.color].secondary) + "cc" } } >{ folder.notes.length }</span>

                    </button>
                </h2>

                <div id={ "collapse" + folderIndex } className="accordion-collapse collapse" data-bs-parent={ "#accordion" + folderIndex }>

                    <div id={ "accordion-body-" + folder.folderID } style={ { backgroundColor: folderColors[folder.color].secondary } } className="accordion-body">

                        { folder.notes.length > 0 ?
                            (
                                <DndContext modifiers={ [restrictToVerticalAxis, restrictToParentElement] } collisionDetection={ closestCorners } onDragEnd={ handleDragEnd } sensors={ sensors }>

                                    <SortableContext items={ folder.notes.map(note => note.noteID) } strategy={ verticalListSortingStrategy }>

                                        { folder.notes.map((note) => (

                                            <Note setFolders={ setFolders } handleNoteClick={ handleNoteClick } lastNote={ lastNote } key={ note.noteID } note={ note } folder={ folder } folders={ folders } noteTitle={ noteTitle } folderIndex={ folderIndex } contextMenuInfo={ contextMenuInfo } setNoteTitle={ setNoteTitle } setMenuStatus={ setMenuStatus } setContextMenuInfo={ setContextMenuInfo } currentNote={ currentNote } setCurrentNote={ setCurrentNote } />

                                        )) }

                                    </SortableContext>
                                </DndContext>

                            )

                            :

                            (

                                <div className="empty-folder-content" style={ { backgroundColor: folderColors[folder.color].secondary, color: getContrastColor(folderColors[folder.color].secondary) } }>

                                    <p>This folder is empty! <i className="bi bi-folder2-open"></i></p>

                                </div>
                            ) }
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Folder;