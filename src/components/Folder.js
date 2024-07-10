import { getContrastColor, openMenu, folderColors } from "../utils/utils";
import Note from "./Note";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
const Folder = ({ lastNote, setMenuStatus, folder, folders, folderIndex, setModalShowing, contextMenuInfo, setContextMenuInfo, currentNote, setCurrentNote, noteTitle, setNoteTitle }) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: folder.folderID });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const handleOnMouseUp = (e) => {

        //? i think this event propagates to the folder-title span element

        // i use a settimeout cause otherwise the accordion would expand as soon as the data-bs-toggle attribute is set again
        setTimeout(() => {

            e.target.setAttribute("data-bs-toggle", "collapse");

        }, 1);


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


                    <button { ...attributes } { ...listeners } drag-element="folder" onMouseUp={ (e) => handleOnMouseUp(e) } id={ "collapseButton" + folder.folderID } className="accordion-button collapsed" style={ { '--border-color': folderColors[folder.color].secondary, backgroundColor: folderColors[folder.color].primary, color: getContrastColor(folderColors[folder.color].primary) } } type="button" data-bs-toggle="collapse" data-bs-target={ "#collapse" + folderIndex } aria-expanded="false" aria-controls="collapseThree">
                        <span data-bs-target={ "#collapse" + folderIndex } drag-element="folder" className="accordion-button__folder-title" style={ { color: getContrastColor(folderColors[folder.color].secondary) } } >{ folder.folderName }</span>
                        <span
                            drag-element="folder"
                            className="non-collapsing plus-button" data-bs-toggle="collapse" data-bs-target // i set these attributes cause it works like a e.stopPropagation()
                            onClick={ (e) => setModalShowing({ folderID: folder.folderID, folderName: folder.folderName }) } //open the note modal
                            style={ { '--hover-color': getContrastColor(folderColors[folder.color].secondary), color: getContrastColor(folderColors[folder.color].secondary) + "cc" } } // set a style variable relative to the note color and set a visible text color 
                        >+</span>
                        <span drag-element="folder" className="accordion-button__folder-notesnumber" style={ { color: getContrastColor(folderColors[folder.color].secondary) + "cc" } } >{ folder.notes.length }</span>

                    </button>
                </h2>

                <div id={ "collapse" + folderIndex } className="accordion-collapse collapse" data-bs-parent={ "#accordion" + folderIndex }>

                    <div id={"accordion-body-" + folder.folderID} style={{backgroundColor:folderColors[folder.color].secondary}}className="accordion-body">

                        { folder.notes.length > 0 ?
                            (
                                <SortableContext items={ folder.notes.map(note => note.noteID) } strategy={ verticalListSortingStrategy }>

                                    { folder.notes.map((note) => (

                                        <Note lastNote={ lastNote } key={ note.noteID } note={ note } folder={ folder } folders={ folders } noteTitle={ noteTitle } folderIndex={ folderIndex } contextMenuInfo={ contextMenuInfo } setNoteTitle={ setNoteTitle } setMenuStatus={ setMenuStatus } setContextMenuInfo={ setContextMenuInfo } currentNote={ currentNote } setCurrentNote={ setCurrentNote } />

                                    )) }

                                </SortableContext>
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