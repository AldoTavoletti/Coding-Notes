import useSWR from "swr";
import { useEffect, useState } from "react";
import { URL, folderColors, logout } from "../utils/utils";

const Modals = ({ currentNote, setCurrentNote, modalShowing, setModalShowing, setIsLoggedIn, isLoggedIn }) => {

    // the folder name in the folders modal
    const [folderName, setFolderName] = useState("");

    // the selected color in the folders modal
    const [selectedColor, setSelectedColor] = useState("black");

    // the note title in the notes modal
    const [noteTitle, setNoteTitle] = useState("");

    //it contains the parent folderID and the parent folderName. I also need the folderName cause it'll be shown in the header
    const [noteFolder, setNoteFolder] = useState({ folderID: null, folderName: null });

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

        //? I don't reset the noteFolder to avoid useless re-renders (it's gonna be given a new value when a modal is opened anyway)

    };

    useEffect(() => {

        if (folders) /* if the user's folders have been fetched */ {

            if (typeof modalShowing === "object") {

                if ("folderID" in modalShowing) /* if it's the add-note modal from the + button in the accordion */ {

                    // if the current noteFolder is different from what it should be
                    (modalShowing.folderID !== noteFolder.folderID || modalShowing.folderName !== noteFolder.folderName) && setNoteFolder({ folderID: modalShowing.folderID, folderName: modalShowing.folderName });

                } else if ("folderColor" in modalShowing) /* if it's the modify-folder modal */ {

                    // show data relative to the folder to modify
                    setFolderName(modalShowing.folderName);
                    setSelectedColor(modalShowing.folderColor);

                }
            }

            if (modalShowing === "none") /*if the modal gets closed */ {

                resetFolderStates();
                resetNoteStates();

            } else if (modalShowing === "note") /* if it's the add-note from the menu */ {

                // if the current noteFolder is different from the first one
                (noteFolder.folderID !== folders[0].folderID || noteFolder.folderName !== folders[0].folderName) && setNoteFolder({ folderID: folders[0].folderID, folderName: folders[0].folderName });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalShowing]);

    // retrieve all the folders
    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

    // I try to revalidate the least possible
    const { data: folders, isValidating, error, mutate } = useSWR(URL + "?retrieve=all", fetcher, { revalidateOnFocus: false, revalidateIfStale: false });


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

            if (currentNote && currentNote.folderID === modalShowing.elementID) /* if the folder of the currentNote is being changed, change the currentNote foldername, which is shown in the header */ {
                setCurrentNote({ ...currentNote, folderName: folderName });
            }

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
        const newNote = { title: noteTitle, folderID: noteFolder.folderID };

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

            // set the currentNote to be the one that was just created
            setCurrentNote({ noteID: msg["noteID"], folderName: noteFolder.folderName, folderID: noteFolder.folderID });

            //close the modal
            setModalShowing("none");


        }).catch(err => console.log(err));


    };

    /**
     * @note delete the account
     */
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
                    className={ `${"myModal"} ${modalShowing === "folder" || (typeof modalShowing === "object" && "folderColor" in modalShowing) ? "myModal--visible" : "myModal--hidden"}` }
                    // when the modal is clicked, don't make the dim layer onClick get triggered
                    onClick={ (e) => e.stopPropagation() }
                >

                    <div className="myModal__title">{ modalShowing === "folder" ? "Add a folder" : "Modify a folder" }</div>

                    <div className="myModal__body">

                        <input type="text" name="folder-name" placeholder="Folder name..." value={ folderName } onChange={ (e) => setFolderName(e.target.value) } autoComplete="off" />

                        <div className="colors-container">
                            {
                                colorsArr.map((color, i) => {
                                    return (
                                        <div
                                            style={ { '--color': color.primary } } // create a css variable with the primary color of the folder
                                            className={ `color-box ${selectedColor === colorKeysArr[i] && "color-box--selected"}` }
                                            onClick={ () => setSelectedColor(colorKeysArr[i]) }
                                            key={ color.primary }>
                                            { selectedColor === colorKeysArr[i] && <i className="bi bi-check-lg"></i> }
                                        </div>
                                    );

                                })
                            }
                        </div>

                    </div>

                    <div className="myModal__footer">

                        <button
                            onClick={ (e) => modalShowing === "folder" ? addFolder(e) : modifyFolder(e) }
                            className="secondary-button"
                            disabled={ folderName.trim() === "" ? true : false } // if the folderName field is empty disable the button
                        >{ modalShowing === "folder" ? "Add" : "Modify" }</button>

                    </div>

                </div>


                {/* note modal */ }
                <div
                    className={ `${"myModal"} ${modalShowing === "note" || (typeof modalShowing === "object" && "folderID" in modalShowing) ? "myModal--visible" : "myModal--hidden"}` }
                    // when the modal is clicked, don't make the dim layer onClick get triggered
                    onClick={ (e) => e.stopPropagation() }
                >
                    <div className="myModal__title">Add a note</div>

                    <div className="myModal__body">


                        <input type="text" name="note-name" placeholder="title..." value={ noteTitle } onChange={ (e) => setNoteTitle(e.target.value) } autoComplete="off" />

                        {/* since i have to retrieve the folderName too, the value of the option has to be an object. Since only strings are accepted, I use JSON. */ }
                        <select name="folder-selection" value={ JSON.stringify(noteFolder) } onChange={ (e) => setNoteFolder(JSON.parse(e.target.value)) }>
                            { folders.map((folder, i) => (

                                <option key={ folder.folderID } value={ JSON.stringify({ folderID: folder.folderID, folderName: folder.folderName }) } className="folder-selection__option">{ folder.folderName }</option>

                            )) }


                        </select>

                    </div>

                    <div className="myModal__footer">

                        <button className="secondary-button" onClick={ (e) => addNote(e) }>Add</button>

                    </div>

                </div>


            </div>


            {/* delete account modal */ }
            <div className="modal fade" id="deleteAccountModal" aria-labelledby="#deleteAccountModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Delete account</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            { isLoggedIn }, do you confirm the deletion of this account?
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