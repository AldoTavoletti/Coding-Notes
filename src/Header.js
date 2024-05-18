import { useEffect, useRef } from "react";
import { URL } from "./utils";
import { simplePatchCall } from "./utils";
import useSWR from "swr";
const Header = ({ currentNote, noteTitle, setNoteTitle, isLoggedIn, setIsLoggedIn, menuStatus, setMenuStatus }) => {

    // I use an header ref to get its offsetWidth
    const header = useRef();

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading } = useSWR(URL + `?retrieve=single&note=${currentNote}`, fetcher, { revalidateOnFocus: false });

    useEffect(() => {

        // if the note had been fetched and noteTitle is not equal to note.title, set it to be
        (note && noteTitle !== note.title) && setNoteTitle(note.title);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note]);


    useEffect(() => {

        note && simplePatchCall({ noteID: note.noteID, title: noteTitle });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteTitle]);
    /**
         * @note handles the user's logout
         */
    const logout = () => {

        fetch(URL + "?logout=true", {

            method: "GET",
            credentials: "include",


        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(data => {

            data["code"] === 200 && setIsLoggedIn(false);


        }).catch(err => console.log(err));


    };
    const deleteAccount = () => {

        fetch(URL, {

            method: "DELETE",
            body: JSON.stringify({ deleteUser: true }),
            credentials: "include",


        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(data => {
            if (data["code"] === 200) {

                logout();

            }
        }).catch(err => console.log(err));

    };
    return (

        <div className="header" ref={ header }>





            {/* if no note has been selected or if the login page is shown */ }
            { (!isLoggedIn || (!note && !isValidating && !isLoading)) && <p>Coding Notes</p> }

            {/* if the selected note is validating */ }
            { (!note && (isValidating || isLoading)) && <p></p> }

            {/* if a note has been selected and it's been fetched */ }
            { (note && currentNote) &&
                <p
                    contentEditable="true"
                    suppressContentEditableWarning={ true }
                    onDragStart={ (e) => e.preventDefault() }
                    data-placeholder="Title..."
                    className="note-display__title"
                    onKeyDown={ (e) => (e.currentTarget.offsetWidth > (header.current.offsetWidth / 1.2) && /^.$/.test(e.key)) && e.preventDefault() }
                    onInput={ (e) => setNoteTitle(e.currentTarget.innerText) }
                >{ note.title }</p> }

            <div className="main-header__buttons-div">
                { isLoggedIn && 
                <div class="dropdown">
                <button className="account-button" type="button" data-bs-toggle="dropdown">{ isLoggedIn[0].toUpperCase() }</button>
                    <ul class="dropdown-menu">
                            <li><h6 class="dropdown-header">Hi {isLoggedIn}!</h6></li>
                            <li><button onClick={ () => logout() }>Logout</button></li>
                            <li><button onClick={ () => deleteAccount() }>Delete account</button></li>

                    </ul>
                </div>
}
                { menuStatus === "hamburger" &&

                    <i class="bi bi-list" onClick={ () => setMenuStatus("expanded") }></i>

                }
            </div>
        </div>

    );
};

export default Header;