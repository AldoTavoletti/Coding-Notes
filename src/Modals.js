import useSWR from "swr";
import { useEffect, useState } from "react";
import { URL, folderColors, logout } from "./utils";

const Modals = ({ modalShowing, setModalShowing, setIsLoggedIn, isLoggedIn }) => {

    // the folder name in the folders modal
    const [folderName, setFolderName] = useState("");

    // the selected color in the folders modal
    const [selectedColor, setSelectedColor] = useState("black");

    // the note title in the notes modal
    const [noteTitle, setNoteTitle] = useState("");

    /* 
     * the note's parent folder ID in the note modal
     * it's initial value is set in a useEffect after the folders' fetch. It cannot be set now since folders would be undefined, and it cannot be declared later since Hooks cannot be declared after "if (error) return (<div></div>);"
     */
    const [noteFolderID, setnoteFolderID] = useState(null);

    // get the values from folderColors so that I can iterate it with map
    const colorsArr = Object.values(folderColors);


    const colorKeysArr = Object.keys(folderColors);

    /**
     * @note reset the states relative to the folders modal
     */
    const resetFolderStates = () => {

        folderName !== "" && setFolderName("");
        selectedColor !== "black" && setSelectedColor("black");


    };

    /**
     * @note reset the states relative to the notes modal
     */
    const resetNoteStates = () => {


        noteTitle !== "" && setNoteTitle("");
        // if I don't check folders[0], moving from login to homepage etc. in the URL could mess things up apparently 
        (folders[0] && noteFolderID !== folders[0].folderID) && setnoteFolderID(folders[0].folderID);

    };

    useEffect(() => {

        if (folders) /* if the user's folders have been fetched */ {

            if (typeof modalShowing === "object") {

                if ("folderName" in modalShowing) /* if it's the modify-folder modal */ {

                    // show data relative to the folder to modify
                    setFolderName(modalShowing.folderName);
                    setSelectedColor(modalShowing.folderColor);

                } else if ("noteFolderID" in modalShowing) /* if it's the add note from the folder button */ {

                    setnoteFolderID(modalShowing.noteFolderID);

                }

            } else if (modalShowing === "none") /*if the modal gets closed and it's not the first render of the application (&& folders)*/ {

                resetFolderStates();
                resetNoteStates();

            }else if(modalShowing === "note"){

                !noteFolderID && setnoteFolderID(folders[0].folderID);

            }
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalShowing]);

    // retrieve all the folders
    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

    // I try to revalidate the least possible
    const { data: folders, isValidating, error, mutate } = useSWR(URL + "?retrieve=all", fetcher, { revalidateOnFocus: false, revalidateIfStale: false });


    //|| this useEffect cannot be put elsewhere
    useEffect(() => {

        


    }, [folders]);


    // Handles error and loading state. Without these useSWR wouldn't work
    if (error) return (<div></div>);
    if (isValidating) return (<div></div>);

    /**
     * 
     * @param {Event} e 
     */
    const addFolder = (e) => {

        // the folder to post
        const newFolder = { name: folderName, color: selectedColor };

        fetch(URL, {

            method: "POST",
            credentials: "include",
            body: JSON.stringify(newFolder)


        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(msg => {

            mutate();


        }).catch(err => console.log(err));

        //close the modal
        setModalShowing("none");

    };

    /**
     * 
     * @param {Event} e 
     */
    const modifyFolder = (e) => {

        // the folder to patch
        const folder = { name: folderName, color: selectedColor, folderID: modalShowing.elementID };

        fetch(URL, {

            method: "PATCH",
            credentials: "include",
            body: JSON.stringify(folder)


        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(msg => {

            mutate();


        }).catch(err => console.log(err));


        //close the modal
        setModalShowing("none");

    };

    /**
     * 
     * @param {Event} e 
     */
    const addNote = (e) => {

        // the note to add
        const newNote = { title: noteTitle, folderID: noteFolderID };


        fetch(URL, {

            method: "POST",
            credentials: "include",
            body: JSON.stringify(newNote)


        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(msg => {

            mutate();


        }).catch(err => console.log(err));


        //close the modal
        setModalShowing("none");
    };

    const deleteAccount = () => {

        fetch(URL, {

            method: "DELETE",
            body: JSON.stringify({ deleteUser: true }),
            credentials: "include",


        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(data => {
            if (data["code"] === 200) {

                logout(setIsLoggedIn, false);

            }
        }).catch(err => console.log(err));

    };

    return (
        <>
            <div className={ `modal-container ${modalShowing !== "none" ? "modal-container--visible" : "modal-container--hidden"}` } onClick={ () => setModalShowing("none") }>

                {/* the black layer behind the modal */ }
                <div className={ `dim-layer` }></div>

                {/* add folder modal */ }
                <div
                    className={ `${"myModal"} ${modalShowing === "folder" || (typeof modalShowing === "object" && "folderName" in modalShowing)  ? "myModal--visible" : "myModal--hidden"}` }
                    // when the modal is clicked, don't make the dim layer onClick get triggered
                    onClick={ (e) => e.stopPropagation() }
                >

                    <div className="myModal__title">Add a folder</div>

                    <div className="myModal__body">

                        <input type="text" name="folder-name" placeholder="Folder name..." value={ folderName } onChange={ (e) => setFolderName(e.target.value) } autoComplete="off" />

                        <div className="flex-container">
                            {
                                colorsArr.map((color, i) => {
                                    return (
                                        <div
                                            style={ { '--color': color.primary } } // create a css variable with the primary color of the folder
                                            className={ `color-box ${selectedColor === colorKeysArr[i] && "color-box--selected"}` }
                                            onClick={ () => setSelectedColor(colorKeysArr[i]) }
                                            key={color.primary}>
                                            { selectedColor === colorKeysArr[i] && <i className="bi bi-check-lg"></i> }
                                        </div>
                                    );

                                })
                            }
                        </div>

                    </div>

                    <div className="myModal__footer">

                        <button
                            onClick={ (e) => typeof modalShowing === "object" ? modifyFolder(e) : addFolder(e) }
                            className="primary-button"
                            disabled={ folderName.trim() === "" ? true : false } // if the folderName field is empty disable the button
                        >Add</button>

                    </div>

                </div>




                {/* note modal */ }
                <div
                    className={ `${"myModal"} ${modalShowing === "note" || (typeof modalShowing === "object" && "noteFolderID" in modalShowing) ? "myModal--visible" : "myModal--hidden"}` }
                    // when the modal is clicked, don't make the dim layer onClick get triggered
                    onClick={ (e) => e.stopPropagation() }
                >
                    <div className="myModal__title">Add a note</div>

                    <div className="myModal__body">


                        <input type="text" name="note-name" placeholder="title..." value={ noteTitle } onChange={ (e) => setNoteTitle(e.target.value) } autoComplete="off" />

                        <select name="folder-selection" value={noteFolderID ? noteFolderID : ""} onChange={ (e) => setnoteFolderID(e.target.value) }>
                            { folders.map((folder, i) => (

                                <option key={ folder.folderID } value={ folder.folderID } className="folder-selection__option">{ folder.folderName }</option>

                            )) }


                        </select>

                    </div>

                    <div className="myModal__footer">

                        <button className="primary-button" onClick={ (e) => addNote(e) }>Add</button>

                    </div>

                </div>


            </div>



            <div className="modal fade" id="deleteAccountModal" aria-labelledby="#deleteAccountModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Delete account</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {isLoggedIn}, do you confirm the deletion of this account?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={ () => deleteAccount() }>Delete account</button>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Modals;