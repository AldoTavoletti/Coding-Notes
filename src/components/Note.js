import { useEffect } from "react";
import { getContrastColor, openMenu, folderColors } from "../utils/utils";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Note = ({ setFolders, handleNoteClick, lastNote, setMenuStatus, folder, folders, note, folderIndex, setModalShowing, contextMenuInfo, setContextMenuInfo, currentNote, setCurrentNote, noteTitle, setNoteTitle }) => {
    

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: note.noteID+"-note" });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };
    

    useEffect(() => {
        // set the current note to be the last note visited
        lastNote.current = { noteID: currentNote.noteID, folderID: currentNote.folderID };
        

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentNote]);

    
    
    return (

        <div
            onClick={ (e) => handleNoteClick({...note,folderName:folder.folderName}) } //open the note
            onContextMenu={ (e) => openMenu(e, setContextMenuInfo, note) } // open the menu to delete the note 
            className="note-list__note"
            id={"note"+ note.noteID}           
            parent-folder-index={folderIndex}
            drag-element="note"
            ref={ setNodeRef }
            { ...attributes }
            { ...listeners }
            style={ { ...style, '--hover-color': folderColors[folder.color].primary + "88", backgroundColor: folderColors[folder.color].primary, color: getContrastColor(folderColors[folder.color].secondary) } } // set a style variable relative to the note color and set a visible text color 
        >

            {/* // The note title. If the current note or every other note's title is empty show "Untitled Note"  */ }
            <p drag-element="note">{ currentNote && (currentNote.noteID === note.noteID) ? (noteTitle === "" ? <span style={ { color: getContrastColor(folderColors[folder.color].primary) + "88" } }>Untitled Note</span> : noteTitle) : (note.title === "" ? <span style={ { color: getContrastColor(folderColors[folder.color].primary)+"88" } }>Untitled Note</span> : note.title) }</p>

        </div>

    );
};

export default Note;