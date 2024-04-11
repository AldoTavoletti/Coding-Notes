import { useEffect, useRef } from "react";
import EditorMCE from "./EditorMCE";

const NoteDisplay = ({ menuStatus, currentNote }) => {

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

      { currentNote ? <EditorMCE currentNote={ currentNote } /> : 
      (
          <div className="note-display__message">
      <i class="bi bi-journals"></i>
      <p className="">Choose a note!</p>
          </div>
      )}



    </div>
  );
};

export default NoteDisplay;