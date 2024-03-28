import { useEffect, useRef } from "react";
import EditorMCE from "./EditorMCE";

const NoteDisplay = ({ menuStatus, currentNote, noteTitle, setNoteTitle, setMenuStatus }) => {

  const noteDisplayRef = useRef(null);

  useEffect(() => {
    if (noteDisplayRef.current.querySelector(".tox-editor-header")) {

      
    if (menuStatus === "normal") {

      noteDisplayRef.current.querySelector(".tox-editor-header").classList.replace("my-tox-header-sticky--expanded", "my-tox-header-sticky--normal");


    } else if (menuStatus === "hidden") {

      noteDisplayRef.current.querySelector(".tox-editor-header").classList.contains("my-tox-header-sticky--normal") ? noteDisplayRef.current.querySelector(".tox-editor-header").classList.replace("my-tox-header-sticky--normal", "my-tox-header-sticky--expanded") : noteDisplayRef.current.querySelector(".tox-editor-header").classList.add("my-tox-header-sticky--expanded");


    }
    }

  }, [menuStatus]);

  return (
    <div className={ `${"note-display"} ${(menuStatus === "hidden") && "note-display--expanded"}` } ref={ noteDisplayRef }>
      {/* <p contentEditable="true" suppressContentEditableWarning={ true } onDragStart={ (e) => e.preventDefault() } data-placeholder="Title..." className="note-display__title" onInput={ (e) => switchState(noteTitle, setNoteTitle, e.currentTarget.innerText) }>{ note.title }</p> */ }

      <EditorMCE currentNote={ currentNote } />


    </div>
  );
};

export default NoteDisplay;