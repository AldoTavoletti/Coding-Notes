import useSWR from "swr";
import { getContrastColor } from "./utils";

const NoteList = () => {

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data: folders, isValidating, error } = useSWR('http://localhost/www/db_connection.php', fetcher);

    // Handles error and loading state
    if (error) return (<div className="note-list"><div className='failed'>Error</div></div>);
    if (isValidating) return (< div className="note-list"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>);

    return (
        <div className="note-list">

            { folders && folders.map((folder, i) => (


                <div className="accordion" key={ folder.folderID } id={ "accordion" + i }  >
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" style={ { backgroundColor: folder.color, color: getContrastColor(folder.color) } } type="button" data-bs-toggle="collapse" data-bs-target={ "#collapse" + i } aria-expanded="false" aria-controls="collapseThree">
                                { folder.name }
                            </button>
                        </h2>
                        <div id={ "collapse" + i } className="accordion-collapse collapse" data-bs-parent={ "#accordion" + i }>
                            <div className="accordion-body" style={ { backgroundColor: folder.color + "88" } }>
                                { folder && folder.notes.map((note) => (

                                    <div key={ note.noteID } className="note-list__note" style={ { backgroundColor: folder.color } }>
                                        <h4>{ note.title }</h4>
                                        <p>{ note.body }</p>

                                    </div>

                                )) }
                            </div>
                        </div>
                    </div>
                </div>


            )) }

        </div>
    );
};

export default NoteList;