import useSWR from "swr";
import { useEffect, useState } from "react";
import { URL, folderColors, logout, switchNote } from "../utils/utils";

const Modals = ({ setMenuStatus, setNoteTitle, currentNote, setCurrentNote, modalShowing, setModalShowing, setIsLoggedIn, isLoggedIn }) => {

    const [folderName, setFolderName] = useState("");
    const [selectedColor, setSelectedColor] = useState("black");
    const [noteTitleModal, setNoteTitleModal] = useState("");

    //it contains the parent folderID and the parent folderName. I also need the folderName cause it'll be shown in the header
    const [noteFolder, setNoteFolder] = useState({ folderID: null, folderName: null });

    // get the values from folderColors so that I can iterate it with map
    const colorsArr = Object.values(folderColors);
    const colorKeysArr = Object.keys(folderColors);

    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

    // I try to revalidate the least possible
    const { data: folders, isValidating, error, mutate } = useSWR(URL + "?retrieve=all", fetcher, { revalidateOnFocus: false, revalidateIfStale: false });

    useEffect(() => {

        if (folders) /* if the user's folders have been fetched */ {

            if (typeof modalShowing === "object") {

                switch (modalShowing.modalType) {

                    case "add-specific-note":

                        (modalShowing.folderID !== noteFolder.folderID || modalShowing.folderName !== noteFolder.folderName) &&
                            setNoteFolder({ folderID: modalShowing.folderID, folderName: modalShowing.folderName });

                        break;
                    case "modify-folder":

                        setFolderName(modalShowing.folderName);
                        setSelectedColor(modalShowing.folderColor);

                        break;

                    case "move-note":

                        if (modalShowing.parentFolderID !== folders[0].folderID) {

                            (noteFolder.folderID !== folders[0].folderID || noteFolder.folderName !== folders[0].folderName) &&
                                setNoteFolder({ folderID: folders[0].folderID, folderName: folders[0].folderName });

                        } else {

                            (noteFolder.folderID !== folders[1].folderID || noteFolder.folderName !== folders[1].folderName) &&
                                setNoteFolder({ folderID: folders[1].folderID, folderName: folders[1].folderName });

                        }

                        break;

                    default:
                        break;
                }

            } else if (modalShowing === "none") {

                resetFolderStates();
                resetNoteStates();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalShowing]);

    /**
  * @note reset the states relative to the folders modal
  */
    const resetFolderStates = () => {

        setFolderName("");
        setSelectedColor("black");

    };

    /**
     * @note reset the states relative to the notes modal
     */
    const resetNoteStates = () => {

        setNoteTitleModal("");
        setNoteFolder({ folderID: null, folderName: null });

    };

    /**
     * 
     */
    const addFolder = () => {

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

            // re-renders modals and notelist
            mutate();


        }).catch(err => console.log(err));

        //close the modal
        setModalShowing("none");

    };

    /**
     * 
     */
    const modifyFolder = () => {

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

            // refetch modals and notelist
            mutate();

            if (currentNote && currentNote.folderID === modalShowing.elementID) /* if the folder of the currentNote is being changed, change the currentNote foldername, which is shown in the header */ {
                folderName !== currentNote.folderName && setCurrentNote({ ...currentNote, folderName: folderName });
            }

        }).catch(err => console.log(err));


        //close the modal
        setModalShowing("none");

    };

    /**
     * 
     */
    const addNote = () => {

        // the note to add
        const newNote = { title: noteTitleModal, folderID: noteFolder.folderID };

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

            switchNote
                (
                    { noteID: msg["noteID"], folderName: noteFolder.folderName, folderID: noteFolder.folderID, title: noteTitleModal },
                    setCurrentNote,
                    setNoteTitle,
                    setMenuStatus
                );
            // refetch
            mutate();

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

                logout(setIsLoggedIn);

            }
        }).catch(err => console.log(err));

    };

    const moveNote = () => {

        fetch(URL, {

            method: "PATCH",
            credentials: "include",
            body: JSON.stringify({ noteID: modalShowing.noteID, folderID: noteFolder.folderID, action: "move-note" })


        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();


        }).then(msg => {

            // refetch modals and notelist
            mutate();
            if (currentNote.noteID === modalShowing.noteID) setCurrentNote({ ...currentNote, folderName: noteFolder.folderName, folderID: noteFolder.folderID });


        }).catch(err => console.log(err));


        //close the modal
        setModalShowing("none");

    };

    // Handles error and loading state. Without these useSWR wouldn't work
    if (error) return (<div></div>);
    if (isValidating) return (<div></div>);

    return (
        <>
            <div className={ `modal-container ${modalShowing !== "none" ? "modal-container--visible" : "modal-container--hidden"}` } onClick={ () => setModalShowing("none") }>

                {/* the black layer behind the modal */ }
                <div className={ `dim-layer` }></div>

                {/* add folder modal */ }
                <div
                    className={ `${"myModal"} ${modalShowing === "folder" || (typeof modalShowing === "object" && "folderColor" in modalShowing) ? "myModal--visible" : "myModal--hidden"}` }
                    // when the modal is open, don't make the dim layer onClick get triggered if clicking on the modal
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
                                            className={ `color-box${selectedColor === colorKeysArr[i] ? " color-box--selected" : ""}` }
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
                            onClick={ () => modalShowing === "folder" ? addFolder() : modifyFolder() }
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


                        <input type="text" name="note-name" placeholder="title..." value={ noteTitleModal } onChange={ (e) => setNoteTitleModal(e.target.value) } autoComplete="off" />

                        {/* since i have to retrieve the folderName too, the value of the option has to be an object. Since only strings are accepted, I use JSON. */ }
                        <select name="folder-selection" value={ JSON.stringify(noteFolder) } onChange={ (e) => setNoteFolder(JSON.parse(e.target.value)) }>
                            { folders.map((folder, i) => (

                                <option key={ folder.folderID } value={ JSON.stringify({ folderID: folder.folderID, folderName: folder.folderName }) } className="folder-selection__option">{ folder.folderName }</option>

                            )) }


                        </select>

                    </div>

                    <div className="myModal__footer">

                        <button className="secondary-button" onClick={ addNote }>Add</button>

                    </div>

                </div>



                {/* move the note modal */ }
                <div
                    className={ `${"myModal"} ${(typeof modalShowing === "object" && "parentFolderID" in modalShowing) ? "myModal--visible" : "myModal--hidden"}` }
                    // when the modal is clicked, don't make the dim layer onClick get triggered
                    onClick={ (e) => e.stopPropagation() }
                >
                    <div className="myModal__title">Move the note</div>

                    <div className="myModal__body">

                        {/* since i have to retrieve the folderName too, the value of the option has to be an object. Since only strings are accepted, I use JSON. */ }
                        <select name="folder-selection" value={ JSON.stringify(noteFolder) } onChange={ (e) => setNoteFolder(JSON.parse(e.target.value)) }>

                            { folders.map((folder, i) => {
                                // I don't want the current folder to be shown in the options
                                if (folder.folderID === modalShowing.parentFolderID) return null;

                                return (

                                    <option key={ folder.folderID } value={ JSON.stringify({ folderID: folder.folderID, folderName: folder.folderName }) } className="folder-selection__option">{ folder.folderName }</option>

                                );

                            }) }


                        </select>

                    </div>

                    <div className="myModal__footer">

                        <button className="secondary-button" onClick={ moveNote }>Add</button>

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