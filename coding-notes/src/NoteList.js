/* eslint-disable no-unused-vars */

import useSWR, { useSWRConfig } from "swr";
import { getContrastColor, openMenu } from "./utils";
import { useContext, useRef, useState } from "react";
import $ from "jquery";
import { URL, folderColors } from "./utils";


const NoteList = ({ currentNote, setCurrentNote, menuStatus, setMenuStatus, setModalShowing, noteTitle, setNoteTitle }) => {


    // the index of the previous note the user navigated to, so that it's value can be settled.
    const prevNoteIndex = useRef(null);

    // a state variable to determine where the user right clicked and on what element he did do it over
    const [contextMenuInfo, setContextMenuInfo] = useState({ x: null, y: null, elementID: null, elementType: null, folderName: null, folderColor: null });

    //#region GET FOLDERS AND MUTATE DECLARATION

    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());
    // "revalidateIfStale:false" makes sure the noteList does not get revalidated everytime we reopen the menu
    const { data, isValidating, error } = useSWR(URL + `?retrieve=all`, fetcher,{revalidateIfStale:false});
    const { mutate } = useSWRConfig();
    console.log(data, error);
    //#endregion
    // Handles error and loading state
    if (error) return (<div className="note-list"><div className='failed'>Error</div></div>);
    if (isValidating) return (< div className="note-list"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>);

    // copy the data read-only array to create a modifiable folders array
    const folders = [...data];

    /**
     * 
     * @param {object} note 
     * @param {number} folderIndex 
     * @param {number} noteIndex 
     */
    const handleNoteClick = async (note, folderIndex, noteIndex, e) => {

        if (prevNoteIndex.current) /* if it's not the first selected note in the session */ {
            // modify the folders array so that it shows the correct modified title on the previous note
            folders[prevNoteIndex.current[0]].notes[prevNoteIndex.current[1]].title = noteTitle;

            // to be honest I don't really know why I need this, I think the refetch of the single note api makes sure the noteBody and noteTitle won't get set to the previous values when the note gets opened again. But I'm not sure. Anyway I need it. 
            //    await mutate(URL + `?retrieve=single&note=${note.noteID}`); //maybe i dont even need this line

        }
        setCurrentNote(note.noteID);


        // the noteTitle is changed, and then the mutate for the header is called. This way the noteTitle gets changed only here, and not also in the useEffects in Header.js
        // if i didn't add the mutate, note.title in Header.js would be different to noteTitle, and the the useEffect would be executed
        // if i didn't switch the state here, the useEffect in Header.js would have changed the noteTitle to the previous note.title and then to the correct one, since useSWR takes time to fetch.
        // it also makes sure that if I switch to another note immediately after i wrote something in the title, it "gets saved"
        // DO NOT CHANGE THESE LINES
        setNoteTitle(note.title);
        mutate(URL + `?retrieve=single&note=${currentNote}`);



        // if the menu isn't already in normal status, set it to be
        menuStatus !== "normal" && setMenuStatus("normal");

        // save the index of the current note in the prevNoteIndex ref.
        prevNoteIndex.current = [folderIndex, noteIndex];


    };

    /**
     * @note to delete folders/notes from the DB
     */
    const deleteElement = () => {

        // the folder/note to delete.
        const elementToDelete = { elementID: contextMenuInfo.elementID, elementType: contextMenuInfo.elementType };

        $.ajax({
            url: URL,
            type: 'DELETE',
            data: JSON.stringify(elementToDelete),
            success: () => {

                mutate(URL + "?retrieve=all");
                setCurrentNote(null);

                prevNoteIndex.current = null;


            }
        });

    };

    //if the contextMenu is open and the screen is clicked, close the contextMenu
    document.onclick = () => contextMenuInfo.x && setContextMenuInfo({ x: null, y: null, elementID: null, elementType: null, folderName: null, folderColor: null });
    return (
        <div className="note-list">

            { folders && folders.map((folder, folderIndex) => (

                <>
                    <div className="accordion" onContextMenu={ (e) => openMenu(e, contextMenuInfo, setContextMenuInfo, folder.folderID, "folder", folder.folderName, folder.color) } key={ folder.folderID } id={ "accordion" + folderIndex } style={ menuStatus === "expanded" ? { maxWidth: "50%" } : {} } >
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" style={ { backgroundColor: folderColors[folder.color].primary, color: getContrastColor(folderColors[folder.color].primary) } } type="button" data-bs-toggle="collapse" data-bs-target={ "#collapse" + folderIndex } aria-expanded="false" aria-controls="collapseThree">
                                    { folder.folderName }
                                </button>
                            </h2>
                            <div id={ "collapse" + folderIndex } className="accordion-collapse collapse" data-bs-parent={ "#accordion" + folderIndex }>
                                <div className="accordion-body">
                                    { /*folder && */folder.notes.length > 0 ? folder.notes.map((note, noteIndex) => (

                                        <div onClick={ (e) => handleNoteClick(note, folderIndex, noteIndex, e) } onContextMenu={ (e) => openMenu(e, contextMenuInfo, setContextMenuInfo, note.noteID, "note") } key={ note.noteID } className="note-list__note" style={ { '--hover-color': folderColors[folder.color].primary + "ee", backgroundColor: folderColors[folder.color].secondary, color: getContrastColor(folderColors[folder.color].secondary) } }>

                                            {/* //? The note title. If the current note or every other note's title is empty show "Untitled Note"  */ }
                                            <p>{ currentNote === note.noteID ? (noteTitle === "" ? `Untitled Note` : noteTitle) : (note.title === "" ? `Untitled Note` : note.title) }</p>

                                        </div>

                                    )): (



                                            <div className="empty-folder-content" style={ { backgroundColor: folderColors[folder.color].secondary, color: getContrastColor(folderColors[folder.color].secondary) }}>

                                                    
                                                <p>This folder is empty! <i class="bi bi-folder2-open"></i></p>

                                            </div>




                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* a horizontal line between folders */ }
                    {folderIndex !== folders.length - 1 && <hr style={ menuStatus === "expanded" ? { maxWidth: "50%" } : {} } />}

                    {/* the context menu */ }
                    { contextMenuInfo.x && (

                        <div className="context-menu" style={ { left: contextMenuInfo.x, top: contextMenuInfo.y } }>

                            <div className="list-group">
                                { contextMenuInfo.elementType === "folder" && <button type="button" className="list-group-item list-group-item-action" onClick={ () => setModalShowing({ elementID: contextMenuInfo.elementID, folderName: contextMenuInfo.folderName, folderColor: contextMenuInfo.folderColor }) }>Modify</button> }
                                { (contextMenuInfo.elementType === "note" || folders.length > 1) && <button type="button" className="list-group-item list-group-item-action" onClick={ () => deleteElement() }>Delete</button> }
                            </div>

                        </div>

                    )

                    }


                </>

            )) }

        </div>
    );
};

export default NoteList;