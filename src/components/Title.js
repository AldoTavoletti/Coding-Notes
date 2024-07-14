import { useCallback, useRef } from "react";
import { simplePatchCall, debounce } from "../utils/utils";

const Title = ({ note, currentNote, setNoteTitle, isLoading, isValidating, noteTitle }) => {

    const currentID = useRef(null);

    const handleOnInput = useCallback(debounce((value) => {

        simplePatchCall({ noteID: currentID.current, title: value });

    }),[]);

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
                onInput={ (e)=>{
                    currentID.current = currentNote.noteID;
                    setNoteTitle(e.currentTarget.innerText);

                    handleOnInput(e.currentTarget.innerText);
                }
                
                }
            >{ note.title }</p>
        </div>
    );
};

export default Title;