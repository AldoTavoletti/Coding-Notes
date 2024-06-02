import { useEffect, useRef } from "react";
import EditorMCE from "./EditorMCE";

const NoteDisplay = ({ menuStatus, currentNote, isLoggedIn }) => {

  // a ref for the note-display div, used to handle the sticky tinyMCE toolbar, which would be buggy without thes adjustments
  const noteDisplayRef = useRef(null);

  useEffect(() => {

    /*
    This useEffect is used to manage the tinyMCE sticky toolbar, which leads to some problems when resizing divs if not handled correctly.
    I use 4 self made classes to resize the sticky toolbar to my needs.
    "menuStatus === 'expanded'"doesn't need to be handled since note-display gets set to "visibility: hidden" when the menu gets expanded. 
    */

    const editorHeader = noteDisplayRef.current.querySelector(".tox-editor-header");

    if (editorHeader) /* if the editor has been rendered*/ {


      if (menuStatus === "normal") {

        // shrink the sticky toolbar
        editorHeader.classList.remove("my-tox-header-sticky--expanded");
        editorHeader.classList.remove("my-tox-header-sticky--hamburger");
        editorHeader.classList.add("my-tox-header-sticky--normal");

      } else if (menuStatus === "hidden") {

        // expand the sticky toolbar
        editorHeader.classList.remove("my-tox-header-sticky--normal");
        editorHeader.classList.remove("my-tox-header-sticky--hamburger");
        editorHeader.classList.add("my-tox-header-sticky--expanded");

      } else if (menuStatus === "hamburger") {

        // expand the sticky toolbar
        editorHeader.classList.remove("my-tox-header-sticky--normal");
        editorHeader.classList.remove("my-tox-header-sticky--expanded");
        editorHeader.classList.add("my-tox-header-sticky--hamburger");

      }


    }

  }, [menuStatus]);

  return (
    <div className={ `${"note-display"} ${currentNote.noteID && "editor-opened"} ${menuStatus === "hidden" && "note-display--expanded"} ${(menuStatus === "expanded" || menuStatus === "only-notelist") && "note-display--hidden"}` } ref={ noteDisplayRef }>

      {/* unmounting the component everytime the menu is expanded may seem bad for performance, but this acutally makes menu animations smoother */ }
      { currentNote.noteID ?

        <EditorMCE currentNote={ currentNote } />
        :
        (
            <div className="ripple-background">

              <p className="sponsor">Hi <span className="sponsor--purple">{ isLoggedIn }</span>,<br></br>store your ideas!</p>
              <div className="circle xxlarge shade1"></div>
              <div className="circle xlarge shade2"></div>
              <div className="circle large shade3"></div>
              <div className="circle medium shade4"></div>

            </div>
        ) }



    </div>
  );
};

export default NoteDisplay;