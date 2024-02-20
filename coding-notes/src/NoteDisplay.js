
import { useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";

import $ from "jquery";

import { switchState } from "./utils";

import { noteBodyContext } from "./noteBodyContext";
import { noteTitleContext } from "./noteTitleContext";

import { URL_PATCH } from "./utils";   
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const NoteDisplay = ({ menuStatus, currentNote }) => {


    // get the current note title
    const [noteTitle, setNoteTitle] = useContext(noteTitleContext);

    // get the current note body
    const [noteBody, setNoteBody] = useContext(noteBodyContext);

    // a state variable to determine where the user right clicked and on what element he did do it over
    const [contextMenuInfo, setContextMenuInfo] = useState({ x: null, y: null });

    // a state variable to check if a patching operation is ongoing. I use useRef cause i don't want the component to re-render when the value changes.
    const isPatching = useRef(false);

    // the body element
    const bodyElement = useRef();

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
     * 
     * @param {Event} e 
     * @param {*} state 
     * @param {Function} setMethod 
     */
    const openStyleMenu = (e, state, setMethod) => {

        //// e.stopPropagation();
        //// e.preventDefault();

        // get the selected text
        const selectedText = window.getSelection().toString();

        if (selectedText) /* if some text has been selected */ {

            // set the position where the contextmenu has to appear
            switchState(state, setMethod, { x: e.pageX + "px", y: e.pageY + "px" });

        }

    };

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

    /**
     * 
     * @param {DocumentFragment} container 
     */
    const removeInnerChildren = (container, propertyToKeep) => {

        if (!container) {
            return null;
        }

        for (const child of container.childNodes) {

            if (child.nodeName === "#text") {
                
                continue;

            }
        
        // let tempChild = child.cloneNode(true);

        // while (tempChild.hasChildNodes()) {
            
        //     const spanChild = tempChild.querySelector("span");

        //     if (spanChild) {
                
        //         tempChild = spanChild.cloneNode(true); // check if you have to use clone node

        //     }else{

        //         break;

        //     }

        // }



            switch (propertyToKeep) {
                case "bold":

                    if (child.style.fontWeight === "bold") {
                        continue;
                    }

                    break;

                case "italic":

                    if (child.style.fontStyle === "italic") {
                        continue;
                    }

                    break;


                default:
                    break;
            }

            for (const innerChild of child.childNodes) {
                container.appendChild(innerChild);
                
            }
            container.removeChild(child);
            

        }
        return container;

    };

    /**
     * 
     * @param {string} chosenStyle "italic", "bold" or a color 
     */
    const textStyle = (chosenStyle) => {
        // Get selected text
        const selection = window.getSelection();

        
        
        // get the range, which will contain all the nodes that are in the selected text
        const range = selection.getRangeAt(0);
        // create a span element
        const span = document.createElement('span');

        
        let HTMLToAppend = range.extractContents();        
        
        // style the span
        switch (chosenStyle) {
            case "italic":

                HTMLToAppend = removeInnerChildren(HTMLToAppend, "bold");

                span.style.fontStyle = "italic";
                break;

            case "bold":

                HTMLToAppend = removeInnerChildren(HTMLToAppend, "italic");

                span.style.fontWeight = "bold";

                break;

            default /* if it's a color */:
                span.style.color = chosenStyle;
                break;
        }
        // append the selected notes in the span element
        // span.appendChild(HTMLToAppend);

        // Replace the selected text with the styled span
        // range.deleteContents();

        span.appendChild(HTMLToAppend);
        range.insertNode(span);
        // range.insertNode(span);
        // span.nextSibling.remove();

        // update the body
        switchState(noteBody, setNoteBody, bodyElement.current.innerHTML);

    };
    const handleBodyInput = () => {

        switchState(noteBody, setNoteBody, bodyElement.current.innerHTML);
        if (bodyElement.current.querySelector("br")) {

            bodyElement.current.innerHTML = "";

        }

    };

    /**
     * 
     * @param {Event} e 
     */
    const handleOnKeyDown = (e) => {

        if (e.ctrlKey && window.getSelection()) {

            if (e.key === "b") {

                textStyle("bold");

            } else if (e.key === "i") {

                textStyle("italic");

            }
        }


    };

    // Handles error and loading state. Without these useSWR doesn't work
    if (error) return (<div></div>);
    if (!note || isLoading || isValidating) return (<div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>);
    document.onclick = () => contextMenuInfo.x && switchState(contextMenuInfo, setContextMenuInfo, { x: null, y: null });

  



    return (
        <>
            <div className={ `${"note-display"} ${menuStatus === "hidden" && "note-display--expanded"}` }>

                {/* //? the title */ }
                <p contentEditable="true" suppressContentEditableWarning={ true } onDragStart={ (e) => e.preventDefault() } data-placeholder="Title..." className="note-display__title" onInput={ (e) => switchState(noteTitle, setNoteTitle, e.currentTarget.innerText) }>{ note.title }</p>

                {/* //? the body */ }

                <p
                    ref={ bodyElement }
                    contentEditable="plaintext-only" // if I dont' use plaintext-only, new lines get duplicated
                    suppressContentEditableWarning={ true }
                    data-placeholder="Write some text..."
                    className="note-display__body"
                    onInput={ () => { handleBodyInput(); } }
                    onClick={ (e) => e.stopPropagation() }
                    onMouseUp={ (e) => openStyleMenu(e, contextMenuInfo, setContextMenuInfo) }
                    onDragStart={ (e) => e.preventDefault() }
                    onKeyDown={ (e) => handleOnKeyDown(e) }
                    dangerouslySetInnerHTML={ { __html: note.body } }
                ></p>


            </div>

            {/* the context menu to style text */ }
            { contextMenuInfo.x && (
                <div className="context-menu" style={ { left: contextMenuInfo.x, top: contextMenuInfo.y } }>

                    <div className="list-group">
                        <button type="button" name="bold" className="list-group-item list-group-item-action" onClick={ () => textStyle("bold") }>Bold</button>
                        <button type="button" name="italic" className="list-group-item list-group-item-action" onClick={ () => textStyle("italic") } >italic</button>
                    </div>

                </div>
            ) }
        </>
    );
};

export default NoteDisplay;