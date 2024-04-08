import { switchState } from "./utils";
import useSWR from "swr";
import $ from "jquery";
import { useEffect, useState } from "react";
import { URL, folderColors } from "./utils";

const Modals = ({ modalShowing, setModalShowing }) => {

    // the folder name in the folders modal
    const [folderName, setFolderName] = useState("");

    // the selected color in the folders modal
    const [selectedColor, setSelectedColor] = useState("black");

    // the note title in the note modal
    const [noteTitle, setNoteTitle] = useState("");

    // the note's parent folder in the note modal
    const [noteFolderID, setNoteFolderID] = useState("");

    // transform the folderColors object in an array so that I can iterate it with map
    const colorsArr = Object.values(folderColors);

    const colorKeysArr = Object.keys(folderColors);


    const resetStatesFolder = () => {

        setFolderName("");
        setSelectedColor("black");


    };

    const resetStatesNote = () => {


        setNoteTitle("");
        setNoteFolderID({ folderName: folders[0].folderName, folderID: folders[0].folderID });

    };
    useEffect(() => {

        if (typeof modalShowing === "object") /* if it's the modify folder modal*/ {
            console.log(modalShowing);
            setFolderName(modalShowing.folderName);
            setSelectedColor(modalShowing.folderColor);
        } else if (modalShowing === "none" && folders) /*if the modal gets closed and it's not the first render of the application (&& folders)*/ {
            resetStatesFolder();
            resetStatesNote();

        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalShowing]);

    //#region

    const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

    const { data: folders, isValidating, error, mutate } = useSWR(URL + "?retrieve=all", fetcher, { revalidateOnFocus: false, revalidateIfStale: false });

    //#endregion
    useEffect(() => {

        if (folders && folders.length > 0) {
            setNoteFolderID( folders[0].folderID);
        }

    }, [folders]);
    // Handles error and loading state. Without these useSWR doesn't work
    if (error) return (<div></div>);
    if (isValidating) return (<div></div>);



    /**
     * 
     * @param {Event} e 
     */
    const addFolder = async (e) => {

        // the folder to post
        const newFolder = { name: folderName, color: selectedColor };

        $.ajax({
            url: URL,
            type: 'POST',
            data: JSON.stringify(newFolder),
            xhrFields: {
                withCredentials: true
            },
            success: (msg) => {
                console.log(msg);
                //? if it is positioned outside of this function, it doesn't work all the time 
                mutate(URL);

            },
            error: (err) => {

                console.log(err);

            }
        });

        //close the modal
        switchState(modalShowing, setModalShowing, "none");

    };

    /**
     * 
     * @param {Event} e 
     */
    const modifyFolder = async (e) => {

        // the folder to patch
        const folder = { name: folderName, color: selectedColor, folderID: modalShowing.elementID };

        $.ajax({
            url: URL,
            type: 'PATCH',
            data: JSON.stringify(folder),
            xhrFields: {
                withCredentials: true
            },
            success: (res) => {
                console.log(res);

                //? if it is positioned outside of this function, it doesn't work all the time 
                mutate(URL + "?retrieve=all");

            },
        });

        //close the modal
        switchState(modalShowing, setModalShowing, "none");

    };

    /**
     * 
     * @param {Event} e 
     */
    const addNote = (e) => {

        // the note to add
        const newNote = { title: noteTitle, folderID: noteFolderID };

        $.ajax({
            url: URL,
            type: 'POST',
            data: JSON.stringify(newNote),
            xhrFields: {
                withCredentials: true
            },
            success: (res) => {
                console.log(res);
                //? if it is positioned outside of this function, it doesn't work all the time 
                mutate(URL);

            },
            error: (err) => {

                console.log(err);

            }
        });

        //close the modal
        switchState(modalShowing, setModalShowing, "none");
    };



    return (
        <>
            <div
                // if the modal is showing, make the dim layer visible
                className={ `modal-container ${modalShowing !== "none" ? "modal-container--visible" : "modal-container--hidden"}` }
                // if the dim layer is pressed, close the modal and hide the dim layer
                onClick={ () => switchState(modalShowing, setModalShowing, "none") }
            >
                <div className={ `dim-layer` }></div>

                {/* add folder modal */ }
                <div
                    className={ `${"myModal"} ${modalShowing === "folder" || typeof modalShowing === "object" ? "myModal--visible" : "myModal--hidden"}` }
                    // when the modal is clicked, don't make the dim layer onClick get triggered
                    onClick={ (e) => e.stopPropagation() }
                >

                    {/* the title of the modal */ }
                    <div className="myModal__title">FOLDER</div>

                    {/* the body of the modal */ }
                    <div className="myModal__body">

                        {/* the name of the folder */ }

                        <input type="text" name="folder-name" placeholder="Folder name..." value={ folderName } onChange={ (e) => setFolderName(e.target.value) } />


                        {/* the color of the folder */ }
                        <div className="flex-container">
                            {
                                colorsArr.map(({primary,secondary},i) => {
                                    return (
                                        <div style={ { '--color': primary } } className={ `color-box ${selectedColor === colorKeysArr[i] && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, colorKeysArr[i]) }>{ selectedColor === colorKeysArr[i] && <i className="bi bi-check-lg"></i> }</div>
                                    );

                                })
                            }
                        </div>

                    </div>

                    {/* the footer of the modal */ }
                    <div className="myModal__footer">

                        {/* the add button */ }
                        <button onClick={ (e) => typeof modalShowing === "object" ? modifyFolder(e) : addFolder(e) } className="primary-button" disabled={folderName.trim() === "" ? true: false}>Add</button>

                    </div>

                </div>




                {/* note modal */ }
                <div
                    className={ `${"myModal"} ${modalShowing === "note" ? "myModal--visible" : "myModal--hidden"}` }
                    // when the modal is clicked, don't make the dim layer onClick get triggered
                    onClick={ (e) => e.stopPropagation() }
                >
                    {/* the title of the modal */ }
                    <div className="myModal__title">NOTE</div>

                    {/* the body of the modal */ }
                    <div className="myModal__body">

                        {/* the title of the note */ }

                        <input type="text" name="note-name" placeholder="title..." value={ noteTitle } onChange={ (e) => setNoteTitle(e.target.value) } />

                        {/* the folder where the note has to be inserted.*/ }
                        <select name="folder-selection" onChange={ (e) => setNoteFolderID(e.target.value) }>
                            { folders.map((folder, i) => (

                                <option key={ folder.folderID } value={ folder.folderID } className="folder-selection__option">{ folder.folderName }</option>

                            )) }


                        </select>

                    </div>

                    {/* the footer of the modal */ }
                    <div className="myModal__footer">

                        {/* the add button */ }
                        <button className="primary-button" onClick={ (e) => addNote(e) }>Add</button>

                    </div>

                </div>


            </div>
        </>
    );
};

export default Modals;