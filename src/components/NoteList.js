import React from "react";
import { useRef } from "react";
import Folder from "./Folder";
import ContextMenu from "./ContextMenu";
import SearchBar from "./SearchBar";
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { saveLastNoteTitle, switchNote } from "../utils/utils";

const NoteList = ({ folders, currentNote, setCurrentNote, menuStatus, setMenuStatus, setModalShowing, noteTitle, setNoteTitle, contextMenuInfo, setContextMenuInfo }) => {
    // used to settle the title of the last note, after another note has been clicked on
    const lastNote = useRef({ noteID: null, folderID: null });

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

    return (
        <>
            <div className="note-list">

                    <SearchBar handleNoteClick={handleNoteClick} noteTitle={noteTitle} folders={folders} lastNote={lastNote} setMenuStatus={setMenuStatus} setCurrentNote={setCurrentNote} setNoteTitle={setNoteTitle}/>

                    <SortableContext items={ folders.map(folder=>folder.folderID) } strategy={ verticalListSortingStrategy }>

                        { folders && folders.map((folder, folderIndex) => (

                            <Folder handleNoteClick={ handleNoteClick } lastNote={ lastNote } key={ folder.folderID } folder={ folder } folders={ folders } noteTitle={ noteTitle } folderIndex={ folderIndex } contextMenuInfo={ contextMenuInfo } setNoteTitle={ setNoteTitle } setMenuStatus={ setMenuStatus } setContextMenuInfo={ setContextMenuInfo } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } />

                        )) }
                    </SortableContext>
            </div>
            <ContextMenu folders={ folders } contextMenuInfo={ contextMenuInfo } setModalShowing={ setModalShowing } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setContextMenuInfo={ setContextMenuInfo } />
        </>
    );
};

export default NoteList;
