import useSWR, { useSWRConfig } from "swr";
import { URL } from "../utils/utils";
import React from "react";
import Folder from "./Folder";

const NoteList = ({ currentNote, setCurrentNote, menuStatus, setMenuStatus, setModalShowing, noteTitle, setNoteTitle, contextMenuInfo, setContextMenuInfo }) => {

    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

    const { data, isValidating, error } = useSWR(URL + `?retrieve=all`, fetcher);

    // this mutate is global, meaning I can mutate other URLs (in this case, the one that retrieves data relative to the current note)
    const { mutate } = useSWRConfig();

    if (error) return (<div className="note-list"><div className='failed'>Error</div></div>);

    //the notelist is not shown in the expanded menu on screens with width less than 769, so showing the spinner would be wrong
    if (isValidating && window.innerWidth < 769 && menuStatus === "expanded") return (<></>);

    if (isValidating) return (
        <div className="center-container">
            <div className="spinner-grow" role="status"></div>
        </div>);


    // copy the data read-only array to create a modifiable folders array
    const folders = [...data];

    /**
     * @note to delete folders/notes from the DB
     */
    const deleteElement = () => {

        // the folder/note to delete.
        const elementToDelete = { elementID: contextMenuInfo.elementID, elementType: contextMenuInfo.elementType };

        fetch(URL, {

            method: "DELETE",
            body: JSON.stringify(elementToDelete)

        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(data => {

            mutate(URL + "?retrieve=all");

            if (currentNote.noteID === contextMenuInfo.elementID || currentNote.folderID === contextMenuInfo.elementID) /* if the current note or its parent folder was deleted */ {

                setCurrentNote({ noteID: null, folderName: null, folderID: null });

            }


        }).catch(err => console.log(err));


    };

    //if the contextMenu is open and the screen is clicked, close the contextMenu
    document.onclick = () => contextMenuInfo.x && setContextMenuInfo({ x: null, y: null, elementID: null, elementType: null, folderName: null, folderColor: null });

    return (
        <div className="note-list">

            { folders && folders.map((folder, folderIndex) => (

                <Folder key={ folder.folderID } folder={ folder } folders={ folders } noteTitle={ noteTitle } folderIndex={ folderIndex } contextMenuInfo={ contextMenuInfo } setNoteTitle={ setNoteTitle } setMenuStatus={ setMenuStatus } setContextMenuInfo={ setContextMenuInfo } currentNote={ currentNote } setCurrentNote={ setCurrentNote } setModalShowing={ setModalShowing } />

            )) }

            {/* the context menu */ }
            { contextMenuInfo.x && (

                <div className="context-menu" style={ { "--left": contextMenuInfo.x, "--top": contextMenuInfo.y } }>


                    {/* this is shown only for the folders */ }
                    { contextMenuInfo.elementType === "folder" &&
                        <button
                            type="button"
                            className="icon-text-button"
                            onClick={ () => setModalShowing({ elementID: contextMenuInfo.elementID, folderName: contextMenuInfo.folderName, folderColor: contextMenuInfo.folderColor }) }
                        ><div>{ contextMenuInfo.elementType === "note" ? <i className="bi bi-file-plus-fill"></i> : <i className="bi bi-folder-fill"></i> }</div><span>Modify</span></button>
                    }

                    {/* this button is hidden only if a folder is clicked and there is only one of 'em */ }
                    { (contextMenuInfo.elementType === "note" || folders.length > 1) &&
                        <button
                            type="button"
                            className="icon-text-button"
                            onClick={ () => deleteElement() }
                        ><div>{ contextMenuInfo.elementType === "note" ? <i className="bi bi-file-x"></i> : <i className="bi bi-folder-x"></i> }</div><span>Delete</span></button>
                    }
                </div>


            )

            }


        </div>
    );
};

export default NoteList;
