import { useEffect } from "react";
import EditorMCE from "./EditorMCE";
import { Flip, ToastContainer } from "react-toastify";

const NoteDisplay = ({ menuStatus, currentNote, isLoggedIn, contextMenuInfo, setContextMenuInfo }) => {

  useEffect(() => {
    /*
    This useEffect is used to manage the tinyMCE sticky toolbar, which leads to some problems when resizing divs if not handled correctly.
    I use self made classes to resize the sticky toolbar to my needs.
    "menuStatus === 'expanded'"doesn't need to be handled since note-display gets unmounted when the menu is expanded. 
    */

    const editorHeader = document.querySelector(".tox-editor-header");

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
    <div className={ `${"note-display"} ${currentNote.noteID && "editor-opened"}${menuStatus !== "expanded" && menuStatus !== "only-notelist" && menuStatus !== "normal" ? " note-display--expanded" : (menuStatus === "expanded" || menuStatus === "only-notelist") ? " note-display--hidden":""}` }>

      {/* unmounting the component everytime the menu is expanded may seem bad for performance, but this acutally makes menu animations smoother */ }
      { currentNote.noteID?
      <>
        <ToastContainer
                position="top-center"
                autoClose={ 400 }
                hideProgressBar={ true }
                rtl={ false }
                theme={ localStorage.getItem("light-theme") ? "light" : "dark" }
                closeButton={ false }
                transition={ Flip }
            />
        <EditorMCE currentNote={ currentNote } contextMenuInfo={ contextMenuInfo } setContextMenuInfo={ setContextMenuInfo } />
        </>
        :
        (
            <div className="ripple-background">

              <p className="sponsor">Hi <span className="sponsor--purple">{ isLoggedIn }</span><br></br>store your ideas.</p>
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