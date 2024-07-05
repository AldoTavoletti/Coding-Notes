import { useSWRConfig } from "swr";
import { URL } from "../utils/utils";

const ContextMenu = ({contextMenuInfo, setModalShowing, folders, currentNote, setCurrentNote, setContextMenuInfo}) => {
 
    // this mutate is global, meaning I can mutate other URLs (in this case, the one that retrieves data relative to the current note)
    const { mutate } = useSWRConfig();
    /**
    * @note to delete folders/notes from the DB
    */
    const deleteElement = () => {

        // the folder/note to delete.
        const elementToDelete = { elementID: contextMenuInfo.elementID, elementType: contextMenuInfo.elementType };

        fetch(URL, {

            method: "DELETE",
            body: JSON.stringify(elementToDelete)

        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(data => {
            console.log(data);
            
            mutate(URL + "?retrieve=all");

            if (currentNote.noteID === contextMenuInfo.elementID || currentNote.folderID === contextMenuInfo.elementID) /* if the current note or its parent folder was deleted */ {

                setCurrentNote({ noteID: null, folderName: null, folderID: null });

            }


        }).catch(err => console.log(err));


    };

    //if the contextMenu is open and the screen is clicked, close the contextMenu
    document.onclick = () => contextMenuInfo.x && setContextMenuInfo({ x: null, y: null, elementID: null, elementType: null, folderName: null, folderColor: null });

    
    return ( 

            contextMenuInfo.x && (

                <div className="context-menu" style={ { "--left": contextMenuInfo.x, "--top": contextMenuInfo.y } }>


                    {/* this is shown only for the folders */ }
                    { contextMenuInfo.elementType === "folder" &&
                        <button
                            type="button"
                            className="icon-text-button"
                            onClick={ () => setModalShowing({ elementID: contextMenuInfo.elementID, folderName: contextMenuInfo.folderName, folderColor: contextMenuInfo.folderColor }) }
                        ><div>{ contextMenuInfo.elementType === "note" ? <i className="bi bi-file-plus-fill"></i> : <i className="bi bi-folder-fill"></i> }</div><span>Modify</span></button>
                    }

                    {/* this button is hidden only if a folder is clicked and there is only one of 'em */ }
                    { (contextMenuInfo.elementType === "note" || folders.length > 1) &&
                        <button
                            type="button"
                            className="icon-text-button"
                            onClick={ () => deleteElement() }
                        ><div>{ contextMenuInfo.elementType === "note" ? <i className="bi bi-file-x"></i> : <i className="bi bi-folder-x"></i> }</div><span>Delete</span></button>
                    }
                </div>


            )



     );
}
 
export default ContextMenu;