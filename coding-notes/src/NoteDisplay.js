import { useContext, useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import { switchState, openMenu } from "./utils";
import $ from "jquery";
import { noteBodyContext } from "./noteBodyContext";
import { noteTitleContext } from "./noteTitleContext";

const NoteDisplay = ({ menuStatus, setMenuStatus, currentNote, setCurrentNote }) => {

    const URL_PATCH = "http://localhost/www/patch_api.php";


    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data: note, isValidating, isLoading, error } = useSWR(`http://localhost/www/single_note_api.php?note=${currentNote}`, fetcher);

    //? if you don't know what error occured in the php file, do console.log(error)
    const [noteTitle, setNoteTitle] = useContext(noteTitleContext);
    const [noteBody, setNoteBody] = useContext(noteBodyContext);
    const [contextMenuInfo, setContextMenuInfo] = useState({ x: null, y: null, elementID: null, elementType: null });



    const isPatching = useRef(false);

    useEffect(() => {

        if (note) {

            setNoteTitle(note.title);
            setNoteBody(note.body);

        }

    }, [note]);

    // make a function to get rid of recurrent code in the next 2 useEffect.
    useEffect(() => {
        if (note && !isPatching.current) {
            isPatching.current = true;

            const titleObj = { noteID: note.noteID, title: noteTitle };
            $.ajax({
                url: URL_PATCH,
                type: 'PATCH',
                data: titleObj,
                success: () => {

                    isPatching.current = false;
                },error: ()=>{
                    
                    isPatching.current = false;

                }
            });
        }
        //? the eslint error has got to be disabled cause adding "note" to the dependancy list causes problems
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteTitle]);

    useEffect(() => {
        if (note && !isPatching.current) {
            isPatching.current = true;


            const bodyObj = { noteID: note.noteID, body: noteBody };
            $.ajax({
                url: URL_PATCH,
                type: 'PATCH',
                data: bodyObj,
                success: () => {
                    isPatching.current = false;

                }, error: () => {
                    isPatching.current = false;

                }
            });
        }
        //? the eslint error has got to be disabled cause adding "note" to the dependancy list causes problems

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteBody]);

    // Handles error and loading state. Without these useSWR doesn't work
    if (error) return (<div></div>);
    if (!note || isLoading || isValidating) return (<div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>);


    const saveLineBreaks = (html) => {

        return html.replace(/<div>/g, "\n").replace(/<br>/g, "").replace(/<\/div>/g, "").replace(/&nbsp;/g," ");

    };

    return (
        <>
        <div className={ `${"note-display"} ${menuStatus === "hidden" && "note-display--expanded"}` }>

            <p contentEditable="true" suppressContentEditableWarning={ true } data-placeholder="Title..." className="note-display__title" onInput={ (e) => switchState(noteTitle, setNoteTitle, saveLineBreaks(e.currentTarget.innerHTML)) }>{ note.title }</p>
            <p 
            contentEditable="true"
            suppressContentEditableWarning={ true } 
            data-placeholder="Write some text..." 
            className="note-display__body" 
            onInput={ (e) => switchState(noteBody, setNoteBody, saveLineBreaks(e.currentTarget.innerHTML)) }
            onSelect={(e)=>openMenu(e,contextMenuInfo,setContextMenuInfo)}
            >{ note.body }</p>


        </div>
            { contextMenuInfo.x && (
            <div className="context-menu" style={ { left: contextMenuInfo.x, top: contextMenuInfo.y } }>

                <div className="list-group">
                    <button type="button" className="list-group-item list-group-item-action"></button>
                    <button type="button" className="list-group-item list-group-item-action" ></button>
                </div>

            </div>
)}
        </>
    );
};

export default NoteDisplay;