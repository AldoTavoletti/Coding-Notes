import { useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";

import $ from "jquery";

import { switchState, openMenu } from "./utils";

import { noteBodyContext } from "./noteBodyContext";
import { noteTitleContext } from "./noteTitleContext";

const NoteDisplay = ({ menuStatus, currentNote }) => {

    const URL_PATCH_API = "http://localhost/CodingNotesRepo/coding-notes/PHP/patch_api.php";

    // get the current note title
    const [noteTitle, setNoteTitle] = useContext(noteTitleContext);

    // get the current note body
    const [noteBody, setNoteBody] = useContext(noteBodyContext);

    // a state variable to determine where the user right clicked and on what element he did do it over
    const [contextMenuInfo, setContextMenuInfo] = useState({ x: null, y: null, elementID: null, elementType: null });

    // a state variable to check if a patching operation is ongoing. I use useRef cause i don't want the component to re-render when the value changes.
    const isPatching = useRef(false);

    /**
     * @note makes an ajax call to patch the data in the DB
     * @param {object} obj 
     */
    const patchAjaxCall = (obj) => {

        $.ajax({
            url: URL_PATCH_API,
            type: 'PATCH',
            data: obj
        });

    };

    /**
     * @note it's used to replace html tags with the corresponding value, maybe there's a better way to do this in php or something.
     * @param {string} html 
     * @returns {string}
     */
    const saveLineBreaks = (html) => {

        return html.replace(/<div>/g, "\n").replace(/<br>/g, "").replace(/<\/div>/g, "").replace(/&nbsp;/g, " ");

    };
   
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

        //? the eslint error has got to be disabled cause adding "note" to the dependancy list causes problems
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteBody]);

    // Handles error and loading state. Without these useSWR doesn't work
    if (error) return (<div></div>);
    if (!note || isLoading || isValidating) return (<div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>);

    return (
        <>
            <div className={ `${"note-display"} ${menuStatus === "hidden" && "note-display--expanded"}` }>

                {/* //? the title */ }
                <p contentEditable="true" suppressContentEditableWarning={ true } data-placeholder="Title..." className="note-display__title" onInput={ (e) => switchState(noteTitle, setNoteTitle, saveLineBreaks(e.currentTarget.innerHTML)) }>{ note.title }</p>

                {/* //? the body */ }
                <p
                    contentEditable="true"
                    suppressContentEditableWarning={ true }
                    data-placeholder="Write some text..."
                    className="note-display__body"
                    onInput={ (e) => switchState(noteBody, setNoteBody, saveLineBreaks(e.currentTarget.innerHTML)) }
                /*onSelect={ (e) => openMenu(e, contextMenuInfo, setContextMenuInfo) }*/
                >{ note.body }</p>


            </div>

            {/* the context menu to style text */ }
            { contextMenuInfo.x && (
                <div className="context-menu" style={ { left: contextMenuInfo.x, top: contextMenuInfo.y } }>

                    <div className="list-group">
                        <button type="button" className="list-group-item list-group-item-action"></button>
                        <button type="button" className="list-group-item list-group-item-action" ></button>
                    </div>

                </div>
            ) }
        </>
    );
};

export default NoteDisplay;