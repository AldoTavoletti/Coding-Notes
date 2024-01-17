// the list of notes to show in the menu

import Note from "./Note";

const NoteList = () => {
    return (

        <div className="note-list">
            {/* insert a map function to iterate through a notes array long N, and create N notes */}
            <Note />

        </div>

    );
};

export default NoteList;