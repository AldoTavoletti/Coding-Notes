import { switchState } from "./utils";
import useSWR from "swr";
import $ from "jquery";
import { useEffect, useState } from "react";
import { URL } from "./utils";

const Modals = ({ modalShowing, setModalShowing }) => {

    // the folder name in the folders modal
    const [folderName, setFolderName] = useState("");

    // the selected color in the folders modal
    const [selectedColor, setSelectedColor] = useState("#383737");

    // the note title in the note modal
    const [noteTitle, setNoteTitle] = useState("");

    // the note's parent folder in the note modal
    const [noteFolder, setNoteFolder] = useState("General");

    useEffect(()=>{

        if (typeof modalShowing === "object") {
            console.log(modalShowing);
            setFolderName(modalShowing.folderName);
            setSelectedColor(modalShowing.folderColor); 
        }
        

    },[modalShowing]);

    //#region

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: folders, isValidating, error, mutate } = useSWR(URL + "?retrieve=all", fetcher, {revalidateOnFocus:false, revalidateIfStale:false});

    //#endregion

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
            success: (msg) => {
                console.log(msg);
                //? if it is positioned outside of this function, it doesn't work all the time 
                mutate(URL);

                //reset the state variables so that when the modal gets opened again it's empty.
                resetStatesFolder();

            },
            error: (err)=>{

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
            success: (res) => {
                console.log(res);

                //? if it is positioned outside of this function, it doesn't work all the time 
                mutate(URL+"?retrieve=all");

                //reset the state variables so that when the modal gets opened again it's empty.
                resetStatesFolder();

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
        const newNote = { title: noteTitle, folder: noteFolder };

        $.ajax({
            url: URL,
            type: 'POST',
            data: JSON.stringify(newNote),
            success: (res) => {
                console.log(res);
                //? if it is positioned outside of this function, it doesn't work all the time 
                mutate(URL);

                //reset the state variables so that when the modal gets opened again it's empty.
                resetStatesNote();

            },
            error: (err)=>{

                console.log(err);

            }
        });

        //close the modal
        switchState(modalShowing, setModalShowing, "none");
    };

    const resetStatesFolder = () => {

        setFolderName("");
        setSelectedColor("#383737");


    };

    const resetStatesNote = () => {


        setNoteTitle("");
        setNoteFolder("General");

    };

    return (

        // the dim layer
        <div
            // if the modal is showing, make the dim layer visible
            className={ `${"dim-layer"} ${modalShowing !== "none" ? "dim-layer--visible" : "dim-layer--hidden"}` }
            // if the dim layer is pressed, close the modal and hide the dim layer
            onClick={ () => switchState(modalShowing, setModalShowing, "none") }
        >

            {/* add folder modal */ }
            <div
                className={ `${"myModal"} ${modalShowing === "folder" ? "myModal--visible" : "myModal--hidden"}` }
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
                        <div className={ `color-box color-box--black ${selectedColor === "#383737" && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, "#383737") }>{ selectedColor === "#383737" && <i className="bi bi-check-lg"></i> }</div>
                        <div className={ `color-box color-box--green ${selectedColor === "#03b703" && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, "#03b703") }>{ selectedColor === "#03b703" && <i className="bi bi-check-lg"></i> }</div>
                        <div className={ `color-box color-box--red ${selectedColor === "#ff0000" && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, "#ff0000") }>{ selectedColor === "#ff0000" && <i className="bi bi-check-lg"></i> }</div>
                        <div className={ `color-box color-box--blue ${selectedColor === "#4d94ff" && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, "#4d94ff") }>{ selectedColor === "#4d94ff" && <i className="bi bi-check-lg"></i> }</div>
                        <div className={ `color-box color-box--yellow ${selectedColor === "#e7e731" && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, "#e7e731") }>{ selectedColor === "#e7e731" && <i className="bi bi-check-lg"></i> }</div>
                    </div>

                </div>

                {/* the footer of the modal */ }
                <div className="myModal__footer">

                    {/* the add button */ }
                    <button type="submit" onClick={ (e) => addFolder(e) } className="primary-button">Add</button>

                </div>

            </div>


            {/* modify folder modal */ }
            <div
                className={ `${"myModal"} ${typeof modalShowing === "object" ? "myModal--visible" : "myModal--hidden"}` }
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
                        <div className={ `color-box color-box--black ${selectedColor === "#383737" && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, "#383737") }>{ selectedColor === "#383737" && <i className="bi bi-check-lg"></i> }</div>
                        <div className={ `color-box color-box--green ${selectedColor === "#03b703" && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, "#03b703") }>{ selectedColor === "#03b703" && <i className="bi bi-check-lg"></i> }</div>
                        <div className={ `color-box color-box--red ${selectedColor === "#ff0000" && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, "#ff0000") }>{ selectedColor === "#ff0000" && <i className="bi bi-check-lg"></i> }</div>
                        <div className={ `color-box color-box--blue ${selectedColor === "#4d94ff" && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, "#4d94ff") }>{ selectedColor === "#4d94ff" && <i className="bi bi-check-lg"></i> }</div>
                        <div className={ `color-box color-box--yellow ${selectedColor === "#e7e731" && "color-box--selected"}` } onClick={ () => switchState(selectedColor, setSelectedColor, "#e7e731") }>{ selectedColor === "#e7e731" && <i className="bi bi-check-lg"></i> }</div>
                    </div>

                </div>

                {/* the footer of the modal */ }
                <div className="myModal__footer">

                    {/* the add button */ }
                    <button type="submit" onClick={ (e) => modifyFolder(e) } className="primary-button">Modify</button>

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

                        <input type="text" name="note-name" placeholder="Note name..." value={ noteTitle } onChange={ (e) => setNoteTitle(e.target.value) } />

                        {/* the folder where the note has to be inserted.*/ }
                        <select name="folder-selection" value={ noteFolder } onChange={ (e) => setNoteFolder(e.target.value) }>
                            { folders.map((folder, i) => (

                                <option key={ folder.folderID } value={ folder.folderName }>{ folder.folderName }</option>

                            )) }


                        </select>

                </div>

                {/* the footer of the modal */ }
                <div className="myModal__footer">

                    {/* the add button */ }
                    <button type="submit" className="primary-button" onClick={ (e) => addNote(e) }>Add</button>

                </div>

            </div>


        </div>

    );
};

export default Modals;