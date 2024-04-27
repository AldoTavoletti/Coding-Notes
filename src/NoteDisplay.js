import { Suspense, useEffect, useRef } from "react";
import EditorMCE from "./EditorMCE";
import LoadingScreen from "./LoadingScreen";

const NoteDisplay = ({ menuStatus, currentNote }) => {

  // a ref for the note-display div, used to handle the sticky tinyMCE toolbar, which would be buggy without thes adjustments
  const noteDisplayRef = useRef(null);

  useEffect(() => {

    /*
    This useEffect is used to manage the tinyMCE sticky toolbar, which leads to some problems when resizing divs if not handled correctly (only once it gets sticky).
    I use two self made classes to resize the sticky toolbar to my needs.
    "menuStatus === 'expanded'"doesn't need to be handled since note-display gets set to "visibility: hidden" when the menu gets expanded. 
    */

    const editorHeader = noteDisplayRef.current.querySelector(".tox-editor-header");

    if (editorHeader) /* if the editor has been rendered */ {


      if (menuStatus === "normal") {

        // shrink the sticky toolbar
        editorHeader.classList.remove("my-tox-header-sticky--expanded");
        editorHeader.classList.add("my-tox-header-sticky--normal");

      } else if (menuStatus === "hidden") {

        // expand the sticky toolbar
        editorHeader.classList.remove("my-tox-header-sticky--normal");
        editorHeader.classList.add("my-tox-header-sticky--expanded");

      }


    }

  }, [menuStatus]);

  return (
    <div className={ `${"note-display"} ${menuStatus === "hidden" && "note-display--expanded"} ${menuStatus === "expanded" && "note-display--hidden"}` } ref={ noteDisplayRef }>

      { currentNote ?

        <EditorMCE currentNote={ currentNote } />
        :
        (
          <div className="note-display__message">
            <i class="bi bi-journals"></i>
            <p className="">Choose a note!</p>
          </div>
        ) }



    </div>
  );
};

export default NoteDisplay;