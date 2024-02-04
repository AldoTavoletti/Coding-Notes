import { switchState } from "./utils";
import useSWR from "swr";
import $ from "jquery";
import { useState } from "react";

const Modals = ({ modalShowing, setModalShowing }) => {
    const URL = "http://localhost/www/folders_api.php";
    const URL_POST = "http://localhost/www/post_api.php";
    const URL_PATCH = "http://localhost/www/patch_api.php";


    const [folderName, setFolderName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#383737");

    const [noteTitle, setNoteTitle] = useState("");
    const [noteFolder, setNoteFolder] = useState("General");


    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data: folders, isValidating, error, mutate } = useSWR(URL, fetcher);

    // Handles error and loading state. Without these useSWR doesn't work
    if (error) return (<div></div>);
    if (isValidating) return (<div></div>);

    const addFolder = async (e) => {

        e.preventDefault();

        const newFolder = { name: folderName, color: selectedColor };
        $.ajax({
            url: URL_POST,
            type: 'POST',
            data: newFolder,
            success: () => {
                
                //? if it is positioned outside of this function, it doesn't work all the time 
                mutate(URL);
                resetStatesFolder();

            }
        });

        switchState(modalShowing, setModalShowing, "none");

    };

    const modifyFolder = async (e) => {

        e.preventDefault();

        const folder = { name: folderName, color: selectedColor, folderID: modalShowing };
        $.ajax({
            url: URL_PATCH,
            type: 'PATCH',
            data: folder,
            success: (res) => {
                console.log(res);

                //? if it is positioned outside of this function, it doesn't work all the time 
                mutate(URL);
                resetStatesFolder();

            },
            error: (error)=>{

                console.log(error);
            }
        });

        switchState(modalShowing, setModalShowing, "none");

    };

    const addNote = (e) => {

        e.preventDefault();

        const newNote = { title: noteTitle, folder: noteFolder };

        $.ajax({
            url: URL_POST,
            type: 'POST',
            data: newNote,
            success: () => {

                //? if it is positioned outside of this function, it doesn't work all the time 
                mutate(URL);
                resetStatesNote();

            }
        });

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

        // dim layer
        <div
            // if the modal is showing, make the dim layer visible
            className={ `${"dim-layer"} ${modalShowing !== "none" ? "dim-layer--visible" : "dim-layer--hidden"}` }
            // if the dim layer is pressed, close the modal and hide the dim layer
            onClick={ () => switchState(modalShowing, setModalShowing, "none") }
        >

            {/* folder modal */ }
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
                    <form method="post" className="myModal__body__form" >

                        <input type="text" name="folder-name" placeholder="Folder name..." value={ folderName } onChange={ (e) => setFolderName(e.target.value) } />

                    </form>

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

            {/* folder modal */ }
            <div
                className={ `${"myModal"} ${!isNaN(modalShowing)  ? "myModal--visible" : "myModal--hidden"}` }
                // when the modal is clicked, don't make the dim layer onClick get triggered
                onClick={ (e) => e.stopPropagation() }
            >

                {/* the title of the modal */ }
                <div className="myModal__title">FOLDER</div>

                {/* the body of the modal */ }
                <div className="myModal__body">

                    {/* the name of the folder */ }
                    <form method="post" className="myModal__body__form" >

                        <input type="text" name="folder-name" placeholder="Folder name..." value={ folderName } onChange={ (e) => setFolderName(e.target.value) } />

                    </form>

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
                    <form method="post" className="myModal__body__form">

                        <input type="text" name="note-name" placeholder="Note name..." value={ noteTitle } onChange={ (e) => setNoteTitle(e.target.value) } />

                        {/* the folder where the note has to be inserted.*/ }
                        <select name="folder-selection" value={ noteFolder } onChange={ (e) => setNoteFolder(e.target.value) }>
                            { folders.map((folder, i) => (

                                <option key={ folder.folderID } value={ folder.folderName }>{ folder.folderName }</option>

                            )) }


                        </select>

                    </form>
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