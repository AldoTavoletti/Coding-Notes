import useSWR from "swr";
import { URL } from "../utils/utils";
import React from "react";
import Folder from "./Folder";
import ContextMenu from "./ContextMenu";

const NoteList = ({ currentNote, setCurrentNote, menuStatus, setMenuStatus, setModalShowing, noteTitle, setNoteTitle, contextMenuInfo, setContextMenuInfo }) => {

    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

    const { data, isValidating, error } = useSWR(URL + `?retrieve=all`, fetcher);

    

    if (error) return (<div className="note-list"><div className='failed'>Error</div></div>);

    //the notelist is not shown in the expanded menu on screens with width less than 769, so showing the spinner would be wrong
    if (isValidating && window.innerWidth < 769 && menuStatus === "expanded") return (<></>);

    if (isValidating) return (
        <div className="center-container">
            <div className="spinner-grow" role="status"></div>
        </div>);


    // copy the data read-only array to create a modifiable folders array
    const folders = [...data];

   

    

    return (
        <>
            <div className="note-list">

                { folders && folders.map((folder, folderIndex) => (

                    <Folder key={ folder.folderID } folder={ folder } folders={ folders } noteTitle={ noteTitle } folderIndex={ folderIndex } contextMenuInfo={ contextMenuInfo } setNoteTitle={ setNoteTitle } setMenuStatus={ setMenuStatus } setContextMenuInfo={ setContextMenuInfo } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } />

                )) }
            </div>

            <ContextMenu folders={folders} contextMenuInfo={contextMenuInfo} setModalShowing={setModalShowing} currentNote={currentNote} setCurrentNote={setCurrentNote} setContextMenuInfo={setContextMenuInfo}/>


        </>
    );
};

export default NoteList;
