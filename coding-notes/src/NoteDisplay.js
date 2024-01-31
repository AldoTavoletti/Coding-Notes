import { useContext, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { switchState } from "./utils";
import $ from "jquery";
import { noteBodyContext } from "./noteBodyContext";
import { noteTitleContext } from "./noteTitleContext";

const NoteDisplay = ({ menuStatus, setMenuStatus, currentNote, setCurrentNote}) => {

    const URL_PATCH = "http://localhost/www/patch_api.php";


    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data: note, isValidating, isLoading, error } = useSWR(`http://localhost/www/single_note_api.php?note=${currentNote}`, fetcher);
    
    //? if you don't know what error occured in the php file, do console.log(error)
    const [noteTitle, setNoteTitle] = useContext(noteTitleContext);
    const [noteBody, setNoteBody] = useContext(noteBodyContext);


    useEffect(() => {

        if (note) {

            setNoteTitle(note.title);
            setNoteBody(note.body);

        }

    }, [note]);

    useEffect(() => {
        if (note) {

            const titleObj = { noteID: note.noteID, title: noteTitle };
            $.ajax({
                url: URL_PATCH,
                type: 'PATCH',
                data: titleObj,
                success: (res) => {

                }
            });
        }
        //? the eslint error has got to be disabled cause adding "note" to the dependancy list causes problems
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteTitle]);

    useEffect(() => {
        if (note) {

            const bodyObj = { noteID: note.noteID, body: noteBody };
            $.ajax({
                url: URL_PATCH,
                type: 'PATCH',
                data: bodyObj,
                success: () => {

                }
            });
        }
        //? the eslint error has got to be disabled cause adding "note" to the dependancy list causes problems

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteBody]);

    // Handles error and loading state. Without these useSWR doesn't work
    if (error) return (<div></div>);
    if (!note || isLoading || isValidating) return (<div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>);




    return (

        <div className={ `${"note-display"} ${menuStatus === "hidden" && "note-display--expanded"}` }>

            <p contentEditable="true" data-placeholder= "Title..." className="note-display__title" onInput={ (e) => switchState(noteTitle, setNoteTitle, e.currentTarget.textContent) }>{ note.title }</p>
            <p contentEditable="true" data-placeholder="Write some text..." className="note-display__body" onInput={ (e) => switchState(noteBody, setNoteBody, e.currentTarget.textContent) }>{  note.body }</p>


        </div>

    );
};

export default NoteDisplay;