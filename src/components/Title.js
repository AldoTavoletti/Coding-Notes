import { simplePatchCall, debounce } from "../utils/utils";

const Title = ({ note, currentNote, setNoteTitle, isLoading, isValidating, noteTitle }) => {

    const handleOnInput = debounce((value) => {

        simplePatchCall({ noteID: currentNote.noteID, title: value });
        setNoteTitle(value);

    });

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
                    handleOnInput(e.currentTarget.innerText);
                }
                
                }
            >{ note.title }</p>
        </div>
    );
};

export default Title;