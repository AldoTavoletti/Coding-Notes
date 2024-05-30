import useSWR, { useSWRConfig } from "swr";
import { getContrastColor, openMenu } from "../utils/utils";
import { useRef, useState } from "react";
import { URL, folderColors } from "../utils/utils";
import React from "react";


const NoteList = ({ currentNote, setCurrentNote, menuStatus, setMenuStatus, setModalShowing, noteTitle, setNoteTitle }) => {


    // the index of the previous note the user navigated to, so that it's value can be settled.
    const prevNoteIndex = useRef(null);

    // a state variable to determine where the user right clicked and on what element he did it
    const [contextMenuInfo, setContextMenuInfo] = useState({ x: null, y: null, elementID: null, elementType: null, folderName: null, folderColor: null });


    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

    // "revalidateIfStale:false" makes sure the noteList does not get revalidated everytime we reopen the menu
    const { data, isValidating, error } = useSWR(URL + `?retrieve=all`, fetcher, {
        revalidateIfStale: false
    });

    // this mutate is global, meaning I can mutate other URLs (in this case, the one that retrieves data relative to the current note)
    const { mutate } = useSWRConfig();


    if (error) return (<div className="note-list"><div className='failed'>Error</div></div>);
    if (isValidating) return (<div className="center-container">
        <div className="spinner-grow" role="status">
        </div>
    </div>);


    // copy the data read-only array to create a modifiable folders array
    const folders = [...data];
    /**
     * 
     * @param {object} note 
     * @param {number} folderIndex 
     * @param {number} noteIndex 
     */
    const handleNoteClick = (note, folderIndex, noteIndex, e) => {

        if (prevNoteIndex.current) /* if it's not the first selected note in the session */ {

            // modify the folders array so that it shows the correct modified title on the previous note
            folders[prevNoteIndex.current[0]].notes[prevNoteIndex.current[1]].title = noteTitle;

        }

        // change the currentNote state
        setCurrentNote({noteID:note.noteID, folderName: folders[folderIndex].folderName, folderID: folders[folderIndex].folderID});

        /*
                the noteTitle is changed, and then the mutate for the header is called. This way the noteTitle gets changed only here, and not also in the useEffects in Header.js
                if i didn't add the mutate, note.title in Header.js would be different to noteTitle, and the the useEffect would be executed
                if i didn't switch the state here, the useEffect in Header.js would have changed the noteTitle to the previous note.title and then to the correct one, since useSWR takes time to fetch.
                it also makes sure that if I switch to another note immediately after i wrote something in the title, it "gets saved".
                These 2 lines make sure everything about the title is ok. Maybe even about the note content itself.
                */
        setNoteTitle(note.title);
        mutate(URL + `?retrieve=single&note=${currentNote && currentNote.noteID}`);

        // if the menu isn't already in normal status, set it to be
        (menuStatus !== "normal" || menuStatus !== "hamburger") && setMenuStatus(window.innerWidth < 769 ? "hamburger" : "normal");

        // save the index of the current note in the prevNoteIndex ref
        prevNoteIndex.current = [folderIndex, noteIndex];


    };

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
            setCurrentNote(null);
            prevNoteIndex.current = null;


        }).catch(err => console.log(err));


    };

    //if the contextMenu is open and the screen is clicked, close the contextMenu
    document.onclick = () => contextMenuInfo.x && setContextMenuInfo({ x: null, y: null, elementID: null, elementType: null, folderName: null, folderColor: null });

    return (
        <div className="note-list">

            { folders && folders.map((folder, folderIndex) => (

                // I use React.Fragment (which is the same as <>) to add the key value
                <React.Fragment key={ folder.folderID }>
                    <div className={ `accordion ${getContrastColor(folderColors[folder.color].primary) === "#ffffff" ? "accordion__white-svg" : "accordion__black-svg"}`} onContextMenu={ (e) => openMenu(e, setContextMenuInfo, folder.folderID, "folder", folder.folderName, folder.color) } id={ "accordion" + folderIndex } >
                        <div className="accordion-item">

                            <h2 className="accordion-header">

                                <button className="accordion-button collapsed"  style={ { backgroundColor: folderColors[folder.color].primary, color: getContrastColor(folderColors[folder.color].primary) } } type="button" data-bs-toggle="collapse" data-bs-target={ "#collapse" + folderIndex } aria-expanded="false" aria-controls="collapseThree">
                                    <span className="accordion-button__folder-title">{ folder.folderName }</span>
                                    <span
                                        className="non-collapsing plus-button" data-bs-toggle="collapse" data-bs-target // i set these attributes cause it works like a e.stopPropagation()
                                        onClick={ (e) => setModalShowing({ folderID: folder.folderID, folderName: folder.folderName }) } //open the note
                                        style={ { '--hover-color': getContrastColor(folderColors[folder.color].secondary), color: getContrastColor(folderColors[folder.color].secondary) + "cc" } } // set a style variable relative to the note color and set a visible text color 
                                    >+</span>
                                </button>
                            </h2>

                            <div id={ "collapse" + folderIndex } className="accordion-collapse collapse" data-bs-parent={ "#accordion" + folderIndex }>

                                <div className="accordion-body">

                                    {/* if the folder has notes show 'em, otherwise show a "This folder is empty!" message */ }
                                    { folder.notes.length > 0 ?

                                        folder.notes.map((note, noteIndex) => (

                                            <div
                                                onClick={ (e) => handleNoteClick(note, folderIndex, noteIndex, e) } //open the note
                                                onContextMenu={ (e) => openMenu(e, setContextMenuInfo, note.noteID, "note") } // open the menu to delete the note 
                                                key={ note.noteID }
                                                className="note-list__note"
                                                style={ { '--hover-color': folderColors[folder.color].primary + "ee", backgroundColor: folderColors[folder.color].secondary, color: getContrastColor(folderColors[folder.color].secondary)} } // set a style variable relative to the note color and set a visible text color 
                                            >

                                                {/* // The note title. If the current note or every other note's title is empty show "Untitled Note"  */ }
                                                <p>{ currentNote && (currentNote.noteID === note.noteID) ? (noteTitle === "" ? `Untitled Note` : noteTitle) : (note.title === "" ? `Untitled Note` : note.title) }</p>

                                            </div>

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

                    {/* a horizontal line between folders */ }
                    { folderIndex !== folders.length - 1 && <hr /> }


                </React.Fragment>

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