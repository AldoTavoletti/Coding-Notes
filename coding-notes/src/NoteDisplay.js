const NoteDisplay = ({ menuStatus, setMenuStatus }) => {
    return ( 

        <div className={ `${"note-display"} ${menuStatus === "expanded" ? "note-display--hidden" : menuStatus === "hidden" && "note-display--expanded"}` }>


            
        </div>

     );
}
 
export default NoteDisplay;