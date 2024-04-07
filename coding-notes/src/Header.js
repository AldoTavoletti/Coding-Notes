import { switchState } from "./utils";
import { useEffect, useRef } from "react";
import { URL } from "./utils";
import { patchAjaxCall } from "./utils";
import useSWR from "swr";
import $ from "jquery";
const Header = ({ modalShowing, setModalShowing, currentNote, noteTitle, setNoteTitle, isLoggedIn, setIsLoggedIn, setCurrentNote }) => {

    const isPatching = useRef(false);

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading, error } = useSWR(URL + `?retrieve=single&note=${currentNote}`, fetcher, { revalidateOnFocus: false });

    useEffect(() => /* this is called at the first render and when the note gets fetched */ {

        if (note && noteTitle !== note.title) /* if the note has been fetched */ {
            setNoteTitle(note.title);

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note]);

    useEffect(() => {

        if (note && !isPatching.current && noteTitle !== note.title) /* if the note has been fetched and there is no patch operation ongoing */ {

            isPatching.current = true;
            patchAjaxCall({ noteID: note.noteID, title: noteTitle });
            isPatching.current = false;

        }
        //? the eslint error has got to be disabled cause adding "note" to the dependancy list causes problems
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteTitle]);
    // Handles error and loading state. Without these useSWR doesn't work
    if (error) return (<div></div>);
    // if (!note || isLoading || isValidating) return (<div className="header"></div>);

    const handleTitleInput = (e) => {

        switchState(noteTitle, setNoteTitle, e.currentTarget.innerText);
    };

    const logout = ()=>{

        

        $.ajax({
            url: URL + "?logout=true",
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: (res) => {
                console.log(res);
                const resParsed = JSON.parse(res);
                if (resParsed["code"] === 200) {
                    switchState(isLoggedIn, setIsLoggedIn);

                }



            },
            error: (err) => {
                // console.log(err);

            }
        });

    }

    return (

        <div className="header">

            { (!isLoggedIn || (!note && !isValidating && !isLoading)) && <p>Coding Notes</p> }
            { (!note && (isValidating || isLoading)) && <p></p> }
            { note && isLoggedIn && currentNote && <p contentEditable="true" suppressContentEditableWarning={ true } onDragStart={ (e) => e.preventDefault() } data-placeholder="Title..." className="note-display__title" onKeyDown={ (e) => (e.currentTarget.innerText.length > 50 && /^.$/.test(e.key)) && e.preventDefault() } onInput={ (e) => handleTitleInput(e) }>{ note.title }</p> }

            <div className="header__buttons-div">
                { isLoggedIn &&

                    (
                        <>
                        <button className="text-button" onClick={ () => logout()}>logout</button> 
                        <div className="vert-line"></div>
                            <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "folder") }>Add a folder +</button>
                            <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "note") }>Add a note +</button>
                        </>
                    )

                }



            </div>
        </div>

    );
};

export default Header;