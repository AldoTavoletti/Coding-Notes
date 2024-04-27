import useSWR from "swr";
import { useEffect, useState } from "react";
import { URL, folderColors } from "./utils";

const Modals = ({ modalShowing, setModalShowing }) => {

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

            if (typeof modalShowing === "object") /* if it's the modify-folder modal */ {

                // show data relative to the folder to modify
                setFolderName(modalShowing.folderName);
                setSelectedColor(modalShowing.folderColor);

            } else if (modalShowing === "none") /*if the modal gets closed and it's not the first render of the application (&& folders)*/ {

                resetFolderStates();
                resetNoteStates();

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

        // set the note's parent folder to be the first of the list
        folders && folders.length > 0 && setnoteFolderID(folders[0].folderID);


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

    return (
        <>
            <div className={ `modal-container ${modalShowing !== "none" ? "modal-container--visible" : "modal-container--hidden"}` } onClick={ () => setModalShowing("none") }>

                {/* the black layer behind the modal */ }
                <div className={ `dim-layer` }></div>

                {/* add folder modal */ }
                <div
                    className={ `${"myModal"} ${modalShowing === "folder" || typeof modalShowing === "object" ? "myModal--visible" : "myModal--hidden"}` }
                    // when the modal is clicked, don't make the dim layer onClick get triggered
                    onClick={ (e) => e.stopPropagation() }
                >

                    <div className="myModal__title">FOLDER</div>

                    <div className="myModal__body">

                        <input type="text" name="folder-name" placeholder="Folder name..." value={ folderName } onChange={ (e) => setFolderName(e.target.value) } autoComplete="off" />

                        <div className="flex-container">
                            {
                                colorsArr.map((color, i) => {
                                    return (
                                        <div
                                            style={ { '--color': color.primary } } // create a css variable with the primary color of the folder
                                            className={ `color-box ${selectedColor === colorKeysArr[i] && "color-box--selected"}` }
                                            onClick={ () => setSelectedColor(colorKeysArr[i]) }>
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
                    className={ `${"myModal"} ${modalShowing === "note" ? "myModal--visible" : "myModal--hidden"}` }
                    // when the modal is clicked, don't make the dim layer onClick get triggered
                    onClick={ (e) => e.stopPropagation() }
                >
                    <div className="myModal__title">NOTE</div>

                    <div className="myModal__body">


                        <input type="text" name="note-name" placeholder="title..." value={ noteTitle } onChange={ (e) => setNoteTitle(e.target.value) } autoComplete="off"/>

                        <select name="folder-selection" onChange={ (e) => setnoteFolderID(e.target.value) }>
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
        </>
    );
};

export default Modals;