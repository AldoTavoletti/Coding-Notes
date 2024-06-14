import useSWR, { useSWRConfig } from "swr";
import { getContrastColor, openMenu } from "../utils/utils";
import { useEffect, useRef } from "react";
import { URL, folderColors } from "../utils/utils";
import React from "react";


const NoteList = ({ currentNote, setCurrentNote, menuStatus, setMenuStatus, setModalShowing, noteTitle, setNoteTitle, contextMenuInfo, setContextMenuInfo }) => {

    // used to settle the title of the last note, after another note has been clicked on
    const lastNote = useRef({ noteID: null, folderID: null });

    


    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

    const { data, isValidating, error } = useSWR(URL + `?retrieve=all`, fetcher);

    // this mutate is global, meaning I can mutate other URLs (in this case, the one that retrieves data relative to the current note)
    const { mutate } = useSWRConfig();


    useEffect(() => {
        // set the current note to be the last note viewed
        lastNote.current = { noteID: currentNote.noteID, folderID: currentNote.folderID };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentNote]);

    if (error) return (<div className="note-list"><div className='failed'>Error</div></div>);
    if (isValidating && window.innerWidth > 769) return (<div className="center-container">
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
            if(currentNote.noteID === contextMenuInfo.elementID || currentNote.folderID === contextMenuInfo.elementID) /* if the current note or its parent folder was deleted */{

                setCurrentNote({ noteID: null, folderName: null, folderID: null });
                
            }


        }).catch(err => console.log(err));


    };

    //if the contextMenu is open and the screen is clicked, close the contextMenu
    document.onclick = () => contextMenuInfo.x && setContextMenuInfo({ x: null, y: null, elementID: null, elementType: null, folderName: null, folderColor: null });

    return (
        <div className="note-list">

            { folders && folders.map((folder, folderIndex) => (

                // I use React.Fragment (which is the same as <>) to add the key value
                <React.Fragment key={ folder.folderID }>
                    <div className={ `accordion ${getContrastColor(folderColors[folder.color].primary) === "#ffffff" ? "accordion__white-svg" : "accordion__black-svg"}` } onContextMenu={ (e) => openMenu(e, setContextMenuInfo, folder.folderID, "folder", folder.folderName, folder.color) } id={ "accordion" + folderIndex } >
                        <div className="accordion-item">

                            <h2 className="accordion-header">

                                <button className="accordion-button collapsed" style={ { '--border-color': folderColors[folder.color].secondary, backgroundColor: folderColors[folder.color].primary, color: getContrastColor(folderColors[folder.color].primary) } } type="button" data-bs-toggle="collapse" data-bs-target={ "#collapse" + folderIndex } aria-expanded="false" aria-controls="collapseThree">
                                    <span className="accordion-button__folder-title" style={ { color: getContrastColor(folderColors[folder.color].secondary)}} >{ folder.folderName }</span>
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

                    {/* a horizontal line between folders shwon if it's not the last folder */ }
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
