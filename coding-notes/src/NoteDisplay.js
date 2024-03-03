import { switchState } from "./utils";
import { useRef,useEffect } from "react";
import useSWR from "swr";
import { patchAjaxCall } from "./utils";
import { URL } from "./utils";
import EditorMCE from "./EditorMCE";

const NoteDisplay = ({ menuStatus, currentNote, noteTitle, setNoteTitle}) => {
   console.log(currentNote);

    useEffect(() => {

        if (note && !isPatching.current) /* if the note has been fetched and there is no patch operation ongoing */ {

            isPatching.current = true;
            patchAjaxCall({ noteID: note.noteID, title: noteTitle });
            isPatching.current = false;

        }
        //? the eslint error has got to be disabled cause adding "note" to the dependancy list causes problems
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteTitle]);

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: note, isValidating, isLoading, error } = useSWR(URL + `?retrieve=single&note=${currentNote}`, fetcher);

    // a state variable to check if a patching operation is ongoing. I use useRef cause i don't want the component to re-render when the value changes.
    const isPatching = useRef(false);


    useEffect(() => /* this is called at the first render and when the note gets fetched */ {
        
        if (note) /* if the note has been fetched */ {
            
            console.log("hi");
            setNoteTitle(note.title);
            
        }

    }, [note, setNoteTitle]);

    // Handles error and loading state. Without these useSWR doesn't work
    if (error) return (<div></div>);
    if (!note || isLoading || isValidating) return (<div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>);

    

    return (
            <div className={ `${"note-display"} ${menuStatus === "hidden" && "note-display--expanded"}` }>
            <p contentEditable="true" suppressContentEditableWarning={ true } onDragStart={ (e) => e.preventDefault() } data-placeholder="Title..." className="note-display__title" onInput={ (e) => switchState(noteTitle, setNoteTitle, e.currentTarget.innerText) }>{ note.title }</p>

           <EditorMCE />


            </div>
    );
};

export default NoteDisplay;