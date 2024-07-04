import { getContrastColor, openMenu, folderColors } from "../utils/utils";
import Note from "./Note";

const Folder = ({ setMenuStatus, folder, folders, folderIndex, setModalShowing, contextMenuInfo, setContextMenuInfo, currentNote, setCurrentNote, noteTitle, setNoteTitle }) => {

    return (

        <div className={ `accordion ${getContrastColor(folderColors[folder.color].primary) === "#ffffff" ? "accordion__white-svg" : "accordion__black-svg"}` } onContextMenu={ (e) => openMenu(e, setContextMenuInfo, folder.folderID, "folder", folder.folderName, folder.color) } id={ "accordion" + folderIndex } >
            <div className="accordion-item">

                <h2 className="accordion-header">

                    <button className="accordion-button collapsed" style={ { '--border-color': folderColors[folder.color].secondary, backgroundColor: folderColors[folder.color].primary, color: getContrastColor(folderColors[folder.color].primary) } } type="button" data-bs-toggle="collapse" data-bs-target={ "#collapse" + folderIndex } aria-expanded="false" aria-controls="collapseThree">
                        <span className="accordion-button__folder-title" style={ { color: getContrastColor(folderColors[folder.color].secondary) } } >{ folder.folderName }</span>
                        <span
                            className="non-collapsing plus-button" data-bs-toggle="collapse" data-bs-target // i set these attributes cause it works like a e.stopPropagation()
                            onClick={ (e) => setModalShowing({ folderID: folder.folderID, folderName: folder.folderName }) } //open the note
                            style={ { '--hover-color': getContrastColor(folderColors[folder.color].secondary), color: getContrastColor(folderColors[folder.color].secondary) + "cc" } } // set a style variable relative to the note color and set a visible text color 
                        >+</span>
                        <span className="accordion-button__folder-notesnumber" style={ { color: getContrastColor(folderColors[folder.color].secondary) + "cc" } } >{ folder.notes.length }</span>

                    </button>
                </h2>

                <div id={ "collapse" + folderIndex } className="accordion-collapse collapse" data-bs-parent={ "#accordion" + folderIndex }>

                    <div className="accordion-body">

                        {/* if the folder has notes show 'em, otherwise show a "This folder is empty!" message */ }
                        { folder.notes.length > 0 ?

                            folder.notes.map((note) => (

                                <Note key={ note.noteID } note={ note } folder={ folder } folders={ folders } noteTitle={ noteTitle } folderIndex={ folderIndex } contextMenuInfo={ contextMenuInfo } setNoteTitle={ setNoteTitle } setMenuStatus={ setMenuStatus } setContextMenuInfo={ setContextMenuInfo } currentNote={ currentNote } setCurrentNote={ setCurrentNote } />

                            ))

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