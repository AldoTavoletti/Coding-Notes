import { useRef, useEffect } from "react";
import { getContrastColor, openMenu, folderColors } from "../utils/utils";

const Note = ({ setMenuStatus, folder, folders, note, folderIndex, setModalShowing, contextMenuInfo, setContextMenuInfo, currentNote, setCurrentNote, noteTitle, setNoteTitle }) => {
    
    /**
     * @param {Object} note 
     * @param {String} folderName 
     */
    const handleNoteClick = (note, folderName) => {

        if (lastNote.current.noteID) /* if this isn't the first note that got clicked on */ {

            // set the title of the last note (which is still the current one) to be noteTitle
            folders
                .find(folder => folder.folderID === lastNote.current.folderID)["notes"]
                .find(note => note.noteID === lastNote.current.noteID)
                .title = noteTitle;

        }

        // change the currentNote state
        setCurrentNote({ noteID: note.noteID, folderName: folderName, folderID: note.folderID });

        // change the noteTitle
        setNoteTitle(note.title);

        setMenuStatus(window.innerWidth < 769 ? "hamburger" : "normal");

    };
    useEffect(() => {
        // set the current note to be the last note visited
        lastNote.current = { noteID: currentNote.noteID, folderID: currentNote.folderID };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentNote]);

    // used to settle the title of the last note, after another note has been clicked on
    const lastNote = useRef({ noteID: null, folderID: null });
    
    return (

        <div
            onClick={ (e) => handleNoteClick(note, folder.folderName) } //open the note
            onContextMenu={ (e) => openMenu(e, setContextMenuInfo, note.noteID, "note") } // open the menu to delete the note 
            key={ note.noteID }
            className="note-list__note"
            style={ { '--hover-color': folderColors[folder.color].primary + "ee", backgroundColor: folderColors[folder.color].secondary, color: getContrastColor(folderColors[folder.color].secondary) } } // set a style variable relative to the note color and set a visible text color 
        >

            {/* // The note title. If the current note or every other note's title is empty show "Untitled Note"  */ }
            <p>{ currentNote && (currentNote.noteID === note.noteID) ? (noteTitle === "" ? `Untitled Note` : noteTitle) : (note.title === "" ? `Untitled Note` : note.title) }</p>

        </div>

    );
};

export default Note;