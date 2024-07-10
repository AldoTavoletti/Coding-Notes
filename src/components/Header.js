import { useEffect, useRef, useState } from "react";
import { URL, simplePatchCall, logout } from "../utils/utils";
import useSWR, { useSWRConfig } from "swr";
import Title from "./Title";
const Header = ({ currentNote, noteTitle, setNoteTitle, isLoggedIn, setIsLoggedIn, menuStatus, setMenuStatus }) => {

    // I use an header ref to get its offsetWidth
    const header = useRef();


    const {cache, mutate} = useSWRConfig();

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading } = useSWR(URL + `?retrieve=single&note=${currentNote.noteID}`, fetcher);

    useEffect(() => {

        note && simplePatchCall({ noteID: currentNote.noteID, title: noteTitle });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteTitle]);

    

    return (

        <div className="header" ref={ header }>

            {/* if no note has been selected or if the login page is shown */ }
            { (!note && !isValidating && !isLoading) && <p className="header--note__title not-selectable">Coding Notes</p> }

            {/* if the selected note is validating */ }
            { (isValidating || isLoading) && <p></p> }

            { (note && currentNote && !isValidating && !isLoading) && 
            <Title 
            note={note}
            currentNote={currentNote}
            setNoteTitle={setNoteTitle}
            isLoading={isLoading}
            isValidating={isValidating}
            noteTitle={noteTitle}
            />
            }

            <div className="header__buttons-div">
                { isLoggedIn &&
                    <div className="dropdown">

                        {/* account button */ }
                        <button className="account-button" type="button" data-bs-toggle="dropdown">{ isLoggedIn[0].toUpperCase() }</button>

                        {/* the dropdown menu of the account button */ }
                        <ul className="dropdown-menu">
                            <li><h6 className="dropdown-header">Hi { isLoggedIn }!</h6></li>
                            <li><button onClick={ () => logout(setIsLoggedIn) }>Logout</button></li>
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