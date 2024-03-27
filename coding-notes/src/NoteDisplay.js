import { useRef } from "react";
import EditorMCE from "./EditorMCE";

const NoteDisplay = ({ menuStatus, currentNote, noteTitle, setNoteTitle, setMenuStatus}) => {

    const noteDisplayRef = useRef(null);

    const checkSticky= ()=>{
      if (noteDisplayRef.current.querySelector(".tox-tinymce--toolbar-sticky-on")) {
      
      setMenuStatus(null);

      }else {
        
        setMenuStatus("normal");


      }
    }


    return (
            <div className={ `${"note-display"} ${(menuStatus === "hidden" || menuStatus === null) && "note-display--expanded"}` } ref={noteDisplayRef} onScroll={checkSticky}>
             {/* <p contentEditable="true" suppressContentEditableWarning={ true } onDragStart={ (e) => e.preventDefault() } data-placeholder="Title..." className="note-display__title" onInput={ (e) => switchState(noteTitle, setNoteTitle, e.currentTarget.innerText) }>{ note.title }</p> */}

           <EditorMCE currentNote={currentNote}/>


            </div>
    );
};

export default NoteDisplay;