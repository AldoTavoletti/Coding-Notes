import useSWR from "swr";
import { getContrastColor, switchState } from "./utils";
import { noteBodyContext } from "./noteBodyContext";
import { noteTitleContext } from "./noteTitleContext";
import { useContext } from "react";

const NoteList = ({ currentNote, setCurrentNote, menuStatus, setMenuStatus }) => {

    const [noteTitle, setNoteTitle] = useContext(noteTitleContext);
    const [noteBody, setNoteBody] = useContext(noteBodyContext);

    const GET_FOLDERS_URL = 'http://localhost/www/folders_api.php';

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data: folders, isValidating, error, mutate } = useSWR(GET_FOLDERS_URL, fetcher);

    // Handles error and loading state
    if (error) return (<div className="note-list"><div className='failed'>Error</div></div>);
    if (isValidating) return (< div className="note-list"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>);

    const handleNoteClick = (noteID)=>{
        mutate(GET_FOLDERS_URL);
        switchState(currentNote, setCurrentNote, noteID);
        menuStatus !== "normal" && switchState(menuStatus, setMenuStatus, "normal");


    }

    return (
        <div className="note-list">

            { folders && folders.map((folder, i) => (


                <div className="accordion" key={ folder.folderID } id={ "accordion" + i }  >
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" style={ { backgroundColor: folder.color, color: getContrastColor(folder.color) } } type="button" data-bs-toggle="collapse" data-bs-target={ "#collapse" + i } aria-expanded="false" aria-controls="collapseThree">
                                { folder.folderName }
                            </button>
                        </h2>
                        <div id={ "collapse" + i } className="accordion-collapse collapse" data-bs-parent={ "#accordion" + i }>
                            <div className="accordion-body" style={ { backgroundColor: folder.color + "88" } }>
                                { folder && folder.notes.map((note) => (

                                    <div onClick={ () => handleNoteClick(note.noteID) } key={ note.noteID } className="note-list__note" style={ { backgroundColor: folder.color, color: getContrastColor(folder.color) } }>
                                        <h4 onClick={ (e) => e.currentTarget.focus() }>{ currentNote === note.noteID ? (noteTitle === "" ? `Note ${i + 1}`: noteTitle) : (note.title === "" ? `Note ${i + 1}`:note.title)  }</h4>
                                        <p onClick={ (e) => e.currentTarget.focus() }>{ currentNote === note.noteID ? noteBody : note.body }</p>

                                    </div>

                                )) }
                            </div>
                        </div>
                    </div>
                </div>


            )) }

        </div>
    );
};

export default NoteList;