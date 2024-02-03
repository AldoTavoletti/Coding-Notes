import useSWR, { useSWRConfig } from "swr";
import { getContrastColor, switchState } from "./utils";
import { noteBodyContext } from "./noteBodyContext";
import { noteTitleContext } from "./noteTitleContext";
import { useContext, useRef, useState } from "react";
import $ from "jquery";

const NoteList = ({ currentNote, setCurrentNote, menuStatus, setMenuStatus }) => {

    const [noteTitle, setNoteTitle] = useContext(noteTitleContext);
    const [noteBody, setNoteBody] = useContext(noteBodyContext);

    const GET_FOLDERS_URL = 'http://localhost/www/folders_api.php';
    const DELETE_URL = 'http://localhost/www/delete_api.php';


    const prevNoteIndex = useRef(null);
    const [contextMenuInfo, setcontextMenuInfo] = useState({x:null,y:null, elementID:null, elementType:null});

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, isValidating, error } = useSWR(GET_FOLDERS_URL, fetcher);

    const { mutate } = useSWRConfig();



    // Handles error and loading state
    if (error) return (<div className="note-list"><div className='failed'>Error</div></div>);
    if (isValidating) return (< div className="note-list"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>);

    const folders = [...data];

    const handleNoteClick = async (note, folderIndex, noteIndex) => {

        if (prevNoteIndex.current) {
            folders[prevNoteIndex.current[0]].notes[prevNoteIndex.current[1]].title = noteTitle;
            folders[prevNoteIndex.current[0]].notes[prevNoteIndex.current[1]].body = noteBody;
        }
        await mutate(`http://localhost/www/single_note_api.php?note=${currentNote}`);
        // await mutate(GET_FOLDERS_URL);
        switchState(currentNote, setCurrentNote, note.noteID);
        menuStatus !== "normal" && switchState(menuStatus, setMenuStatus, "normal");

        prevNoteIndex.current = [folderIndex, noteIndex];
    };

    const openMenu = (e, elementID, elementType)=>{

        e.preventDefault();
        e.stopPropagation();

        switchState(contextMenuInfo, setcontextMenuInfo, { x: e.pageX + "px", y: e.pageY + "px", elementID: elementID, elementType: elementType });



    }

    const deleteElement = ()=>{

        const elementToDelete = {elementID:contextMenuInfo.elementID, elementType:contextMenuInfo.elementType}

        $.ajax({
            url: DELETE_URL,
            type: 'DELETE',
            data: elementToDelete,
            success: () => {
                console.log(elementToDelete);
                mutate(GET_FOLDERS_URL);

            }, error: () => {


            }
        });

    }

    document.onclick = () => contextMenuInfo.x !== null && switchState(contextMenuInfo, setcontextMenuInfo, { x: null, y: null, elementID: null, elementType: null });

    return (
        <div className="note-list">

            { folders && folders.map((folder, folderIndex) => (

                <>
                    <div className="accordion" onContextMenu={ (e) => openMenu(e, folder.folderID, "folder") } key={ folder.folderID } id={ "accordion" + folderIndex } style={ menuStatus === "expanded" ? { maxWidth: "50%" } : {} } >
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button" style={ { backgroundColor: folder.color, color: getContrastColor(folder.color) } } type="button" data-bs-toggle="collapse" data-bs-target={ "#collapse" + folderIndex } aria-expanded="false" aria-controls="collapseThree">
                                    { folder.folderName }
                                </button>
                            </h2>
                            <div id={ "collapse" + folderIndex } className="accordion-collapse collapse show" data-bs-parent={ "#accordion" + folderIndex }>
                                <div className="accordion-body" style={ { backgroundColor: folder.color + "88" } }>
                                    { folder && folder.notes.map((note, noteIndex) => (

                                        <div onClick={ () => handleNoteClick(note, folderIndex, noteIndex) } onContextMenu={ (e)=> openMenu(e, note.noteID, "note") } key={ note.noteID } className="note-list__note" style={ { backgroundColor: folder.color, color: getContrastColor(folder.color) } }>

                                            <h4>{ currentNote === note.noteID ? (noteTitle === "" ? `Untitled Note` : noteTitle) : (note.title === "" ? `Untitled Note` : note.title) }</h4>
                                            <p>{ currentNote === note.noteID ? noteBody : note.body }</p>

                                        </div>

                                    )) }
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr style={ menuStatus === "expanded" ? { maxWidth: "50%" } : {} } />

                    { contextMenuInfo.x && (

                        <div className="context-menu" style={{left:contextMenuInfo.x, top:contextMenuInfo.y}}>

                            <div className="list-group">
                                <button type="button"  className="list-group-item list-group-item-action">Rename</button>
                                <button type="button"  className="list-group-item list-group-item-action" onClick={()=>deleteElement()}>Delete</button>
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