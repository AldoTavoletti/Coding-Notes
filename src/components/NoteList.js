import React from "react";
import { useRef } from "react";
import Folder from "./Folder";
import ContextMenu from "./ContextMenu";
import SearchBar from "./SearchBar";
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const NoteList = ({ folders, currentNote, setCurrentNote, menuStatus, setMenuStatus, setModalShowing, noteTitle, setNoteTitle, contextMenuInfo, setContextMenuInfo }) => {
    // used to settle the title of the last note, after another note has been clicked on
    const lastNote = useRef({ noteID: null, folderID: null });

    return (
        <>
            <div className="note-list">

                    <SearchBar noteTitle={noteTitle} folders={folders} lastNote={lastNote} setMenuStatus={setMenuStatus} setCurrentNote={setCurrentNote} setNoteTitle={setNoteTitle}/>

                    <SortableContext items={ folders.map(folder=>folder.folderID) } strategy={ verticalListSortingStrategy }>

                        { folders && folders.map((folder, folderIndex) => (

                            <Folder lastNote={ lastNote } key={ folder.folderID } folder={ folder } folders={ folders } noteTitle={ noteTitle } folderIndex={ folderIndex } contextMenuInfo={ contextMenuInfo } setNoteTitle={ setNoteTitle } setMenuStatus={ setMenuStatus } setContextMenuInfo={ setContextMenuInfo } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } />

                        )) }
                    </SortableContext>
            </div>
            <ContextMenu folders={ folders } contextMenuInfo={ contextMenuInfo } setModalShowing={ setModalShowing } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setContextMenuInfo={ setContextMenuInfo } />
        </>
    );
};

export default NoteList;
