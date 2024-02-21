
import { useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";

import $ from "jquery";

import { switchState } from "./utils";

import { noteBodyContext } from "./noteBodyContext";
import { noteTitleContext } from "./noteTitleContext";

import Editor from "./Editor";

import { URL_PATCH } from "./utils";

const NoteDisplay = ({ menuStatus, currentNote }) => {




    // get the current note title
    const [noteTitle, setNoteTitle] = useContext(noteTitleContext);

    // get the current note body
    const [noteBody, setNoteBody] = useContext(noteBodyContext);

    // a state variable to check if a patching operation is ongoing. I use useRef cause i don't want the component to re-render when the value changes.
    const isPatching = useRef(false);


    //#region FETCH NOTE
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading, error } = useSWR(`http://localhost/CodingNotesRepo/coding-notes/PHP/single_note_api.php?note=${currentNote}`, fetcher);
    //|| if you don't know what error occured in the php file, do console.log(error)
    //#endregion

    useEffect(() => /* this is called at the first render and when the note gets fetched */ {

        if (note) /* if the note has been fetched */ {

            setNoteTitle(note.title);
            setNoteBody(note.body);

        }

    }, [note, setNoteBody, setNoteTitle]);

    useEffect(() => {

        if (note && !isPatching.current) /* if the note has been fetched and there is no patch operation ongoing */ {

            isPatching.current = true;
            patchAjaxCall({ noteID: note.noteID, title: noteTitle });
            isPatching.current = false;

        }
        //? the eslint error has got to be disabled cause adding "note" to the dependancy list causes problems
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteTitle]);

    useEffect(() => {

        if (note && !isPatching.current) /* if the note has been fetched and there is no patch operation ongoing */ {
            isPatching.current = true;
            patchAjaxCall({ noteID: note.noteID, body: noteBody });
            isPatching.current = false;

        }
        console.log(noteBody);

        //? the eslint error has got to be disabled cause adding "note" to the dependancy list causes problems
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteBody]);

    /**
        * @note makes an ajax call to patch the data in the DB
        * @param {object} obj 
        */
    const patchAjaxCall = (obj) => {

        $.ajax({
            url: URL_PATCH,
            type: 'PATCH',
            data: obj
        });

    };

    // Handles error and loading state. Without these useSWR doesn't work
    if (error) return (<div></div>);
    if (!note || isLoading || isValidating) return (<div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>);

    return (
            <div className={ `${"note-display"} ${menuStatus === "hidden" && "note-display--expanded"}` }>

                <Editor></Editor>

            </div>
    );
};

export default NoteDisplay;