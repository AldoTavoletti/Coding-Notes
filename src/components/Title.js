import { useCallback, useRef } from "react";
import { simplePatchCall, debounce } from "../utils/utils";

const Title = ({ note, currentNote, setNoteTitle }) => {


    // this makes sure the id used to save the title in the DB is the right one (using currentNote.noteID would be problematic when switching between notes)
    const currentID = useRef(null);

    const debouncedSave = debounce((value) => {

        simplePatchCall({ noteID: currentID.current, title: value });

    });

    const handleOnInput = useCallback((value) => {

        currentID.current = currentNote.noteID;
        setNoteTitle(value);
        debouncedSave(value);

    }, [debouncedSave, currentNote.noteID, setNoteTitle]);

    return (

        <div className="header--note">

            <div className="header--note__folder-div"><div>{ currentNote.folderName }</div>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</div>
            
            <p
                contentEditable="true"
                suppressContentEditableWarning={ true }
                onKeyDown={ (e) => e.key === "Enter" && e.preventDefault() }
                onDragStart={ (e) => e.preventDefault() }
                data-placeholder="Title..."
                spellCheck="false"
                className="header--note__title"
                onInput={ (e) => handleOnInput(e.currentTarget.innerText) }
            >{ note.title }</p>
        </div>
    );
};

export default Title;