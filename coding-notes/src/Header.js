import { useEffect, useRef } from "react";
import { URL } from "./utils";
import { simplePatchCall } from "./utils";
import useSWR from "swr";
const Header = ({ currentNote, noteTitle, setNoteTitle, isLoggedIn }) => {

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


        </div>

    );
};

export default Header;