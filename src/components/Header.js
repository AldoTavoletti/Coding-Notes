import { useEffect, useRef } from "react";
import { URL, simplePatchCall, logout } from "../utils/utils";
import useSWR from "swr";

const Header = ({ currentNote, noteTitle, setNoteTitle, isLoggedIn, setIsLoggedIn, menuStatus, setMenuStatus }) => {

    // I use an header ref to get its offsetWidth
    const header = useRef();

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading } = useSWR(URL + `?retrieve=single&note=${currentNote.noteID}`, fetcher, { revalidateOnFocus: false });

    useEffect(() => {

        if (note && note.title !== noteTitle) /* if the note was fetched and noteTitle (the real current title) is different form note.title (which could be a cached value) */ {

            // since useswr initially sets note to be the cached value, I gotta make sure the right title is shown
            note.title = noteTitle;

        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note]);

    useEffect(() => {

        note && simplePatchCall({ noteID: currentNote.noteID, title: noteTitle });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteTitle]);

    return (

        <div className="header" ref={ header }>

            {/* if no note has been selected or if the login page is shown */ }
            { (!isLoggedIn || (!note && !isValidating && !isLoading)) && <p className="header--note__title not-selectable">Coding Notes</p> }

            {/* if the selected note is validating */ }
            { (!note && (isValidating || isLoading)) && <p></p> }

            {/* if a note has been selected and it's been fetched */ }
            { (note && currentNote) &&
                <div className="header--note">
                    <div className="header--note__folder-div"><div>{ currentNote.folderName }</div>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</div>
                    <p
                        contentEditable="true"
                        suppressContentEditableWarning={ true }
                        onKeyDown={ (e) => e.key === "Enter" && e.preventDefault() }
                        onDragStart={ (e) => e.preventDefault() }
                        data-placeholder="Title..."
                        spellCheck="false"
                        className="header--note__title"
                        onInput={ (e) => setNoteTitle(e.currentTarget.innerText) }
                    >{ note.title }</p>
                </div> }


            <div className="header__buttons-div">
                { isLoggedIn &&
                    <div className="dropdown">

                        {/* account button */ }
                        <button className="account-button" type="button" data-bs-toggle="dropdown">{ isLoggedIn[0].toUpperCase() }</button>

                        {/* the dropdown menu of the account button */ }
                        <ul className="dropdown-menu">
                            <li><h6 className="dropdown-header">Hi { isLoggedIn }!</h6></li>
                            <li><button onClick={ () => logout(setIsLoggedIn, false) }>Logout</button></li>
                            <li><button data-bs-toggle="modal" data-bs-target="#deleteAccountModal">Delete account</button></li>

                        </ul>
                    </div>
                }
                { menuStatus === "hamburger" &&

                    // hamburger
                    <i className="bi bi-list" onClick={ () => setMenuStatus("expanded") }></i>

                }
            </div>
        </div>

    );
};

export default Header;