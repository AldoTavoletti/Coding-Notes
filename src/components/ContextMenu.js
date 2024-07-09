import { useSWRConfig } from "swr";
import { URL } from "../utils/utils";

const ContextMenu = ({ contextMenuInfo, setModalShowing, folders, currentNote, setCurrentNote, setContextMenuInfo }) => {

    // this mutate is global, meaning I can mutate other URLs (in this case, the one that retrieves data relative to the current note)
    const { mutate } = useSWRConfig();
    /**
    * @note to delete folders/notes from the DB
    */
    const deleteElement = () => {

        // the folder/note to delete.
        const elementToDelete = { elementID: contextMenuInfo.element.id, elementType: contextMenuInfo.element.folderName ? "folder" : "note" };

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

            if (currentNote.noteID === contextMenuInfo.element.id || currentNote.folderID === contextMenuInfo.element.id) /* if the current note or its parent folder was deleted */ {

                setCurrentNote({ noteID: null, folderName: null, folderID: null });

            }


        }).catch(err => console.log(err));


    };


    //if the contextMenu is open and the screen is clicked, close the contextMenu
    document.onclick = () => contextMenuInfo.x && setContextMenuInfo({ x: null, y: null, element: null });


    return (

        contextMenuInfo.x && (

            <div className="context-menu" style={ { "--left": contextMenuInfo.x, "--top": contextMenuInfo.y } }>


                {/* this is shown only for the folders */ }
                { contextMenuInfo.element.folderName &&
                    <button
                        type="button"
                        className="icon-text-button"
                        onClick={ () => setModalShowing({ elementID: contextMenuInfo.element.id, folderName: contextMenuInfo.element.folderName, folderColor: contextMenuInfo.element.folderColor }) }
                    ><div><i className="bi bi-folder-fill"></i></div><span>Modify</span></button>
}
                
                { (!contextMenuInfo.element.folderName && folders.length > 1) &&
                    <button
                        type="button"
                        className="icon-text-button"
                        onClick={ () => setModalShowing({ noteID: contextMenuInfo.element.id, parentFolderID: contextMenuInfo.element.parentFolderID }) }
                    ><div><i class="bi bi-arrow-up-right-square-fill"></i></div><span>Move</span></button>
}

                {/* this button is hidden only if a folder is clicked and there is only one of 'em */ }
                { (!contextMenuInfo.element.folderName || folders.length > 1) &&
                    <button
                        type="button"
                        className="icon-text-button"
                        onClick={ () => deleteElement() }
                    ><div><i class="bi bi-trash-fill"></i></div><span>Delete</span></button>
                }
            </div>


        )



    );
};

export default ContextMenu;