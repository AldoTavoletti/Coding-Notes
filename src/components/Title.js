const Title = ({note, currentNote, setNoteTitle, isLoading, isValidating, noteTitle}) => {
    
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
                onInput={ (e) => setNoteTitle(e.currentTarget.innerText) }
            >{ note.title }</p>
        </div>
     );
}
 
export default Title;