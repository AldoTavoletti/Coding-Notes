import { switchState } from "./utils";
import { useRef,useEffect } from "react";
import useSWR from "swr";
import { patchAjaxCall } from "./utils";
import { URL } from "./utils";
import EditorMCE from "./EditorMCE";

const NoteDisplay = ({ menuStatus, currentNote, noteTitle, setNoteTitle}) => {

     

    return (
            <div className={ `${"note-display"} ${menuStatus === "hidden" && "note-display--expanded"}` }>
             {/* <p contentEditable="true" suppressContentEditableWarning={ true } onDragStart={ (e) => e.preventDefault() } data-placeholder="Title..." className="note-display__title" onInput={ (e) => switchState(noteTitle, setNoteTitle, e.currentTarget.innerText) }>{ note.title }</p> */}

           <EditorMCE currentNote={currentNote}/>


            </div>
    );
};

export default NoteDisplay;