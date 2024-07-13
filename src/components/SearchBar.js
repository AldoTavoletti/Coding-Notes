import { useRef, useState } from "react";
import { URL } from "../utils/utils";


const SearchBar = ({ handleNoteClick }) => {

    // will contain an array of notes
    const [result, setResult] = useState([]);

    //the content of the searchbar
    const [inputContent, setInputContent] = useState("");


    //? the itemIndex contains the index of the note in the search result, NOT in the folder. The other properties are the ones that are returned by the AJAX call in the getResult function.
    const [selectedNote, setSelectedNote] = useState({ noteID: null, title: null, folderID: null, folderName: null, itemIndex: null });

    // used for animations
    const [isHovering, setIsHovering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // used to focus and blur the searchbar with shortcuts, and to get its height
    const searchInput = useRef(null);

    /**
     * 
     * @param {String} string what the user wrote in the searchbar 
     */
    const getResult = async (string) => {

        try {

            const response = await fetch(URL + "?search=" + string, {

                method: "GET",
                credentials: "include",

            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            return data;

        } catch (e) {

            console.log(e);

        }
    };

    /**
    * 
    * @param {String} value the searchbar content 
    */
    const fetchResult = async (value) => {

        if (value === "") return setResult([]);

        setIsLoading(true);

        const currentResult = await getResult(value);

        setResult(currentResult);

        setSelectedNote({ ...currentResult[0], itemIndex: 0 });

        /*
        if you are hovering on an item, than update the research, and in the point where you left the pointer there is no element anymore, the isHovering would still be true even if no item is being hovered.
        that's why it's a better choice to set isHovering to false everytime the result changes 
        */
        setIsHovering(false);

        setIsLoading(false);
    };

    /**
     * 
     * @param {String} value the searchbar content 
     */
    const handleOnChange = (value) => {

        setInputContent(value);
        fetchResult(value);

    };

    const handleOnFocus = () => {

        setIsFocused(true);
        fetchResult(inputContent);


    };

    const handleOnBlur = () => { setIsFocused(false); };

    const focusSearch = () => { searchInput.current.focus(); };

    const blurSearch = () => { searchInput.current.blur(); };

    const handleOnMouseLeave = () => { setIsHovering(false); };

    const handleOnMouseEnter = (item, itemIndex) => {

        setSelectedNote({ ...item, itemIndex: itemIndex });
        setIsHovering(true);

    };

    //? the "arrow up" and "arrow down" keys are used to scroll the notes in the search bar result, but they also fire this event, which changes the position of the cursor back and forth. That's why they need to be prevented.
    const preventKeys = (e) => {

        if (e.key === "ArrowDown" || e.key === "ArrowUp") e.preventDefault();

    };

    const handleOnKeyDown = (e) => {

        switch (e.key) {

            case "Escape":

                blurSearch();

                break;

            case "Enter":

                handleNoteClick(selectedNote);

                break;

            case "ArrowDown":

                selectedNote.itemIndex !== result.length - 1 && !isHovering && setSelectedNote(selectedNote => {

                    return { ...result[++selectedNote.itemIndex], itemIndex: selectedNote.itemIndex++ };

                });

                break;

            case "ArrowUp":

                selectedNote.itemIndex !== 0 && !isHovering && setSelectedNote(selectedNote => {

                    return { ...result[--selectedNote.itemIndex], itemIndex: selectedNote.itemIndex-- };

                });

                break;

            default:
                break;
        }

    };

    window.onkeydown = (e) => {

        // shortcut Ctrl + p to open the searchbar
        if (e.ctrlKey && e.key === "p") {
            e.preventDefault();
            if (searchInput.current) focusSearch();

        }

    };

    return (
        <div className="search-container" onKeyDown={ handleOnKeyDown }>
            <div className="input-group">
                <input ref={ searchInput } onKeyDown={ preventKeys } onChange={ (e) => handleOnChange(e.target.value) } onBlur={ handleOnBlur } onFocus={ handleOnFocus } type="text" className="searchbar" placeholder="Search..." aria-describedby="btnGroupAddon" />
                <button className="input-group-text" id="btnGroupAddon" onClick={ focusSearch } ><i className={ `spinner-grow${!isLoading ? " hidden" : ""}` } role="status"></i><i className={ `bi bi-search${isLoading ? " hidden" : ""}` }></i></button>
            </div>

            <div className={ `search-result-container${isFocused ? " show" : ""}` } style={ result.length !== 0 ? { "--height": result.length * searchInput.current.offsetHeight + "px" } : {} }>

                {

                    inputContent.length === 0 ?
                        <div className="search-result-default-page">

                            <i className="bi bi-search"></i>
                            <p>Search for a note!</p>

                        </div>

                        :

                        result.length > 0 ?

                            result.map((item, itemIndex) => (
                                <button
                                    key={ item.noteID }
                                    onClick={ () => handleNoteClick(item) }
                                    onMouseDown={ (e) => e.preventDefault() }
                                    onTouchStart={ () => handleOnMouseEnter(item, itemIndex) }
                                    onMouseEnter={ () => handleOnMouseEnter(item, itemIndex) }
                                    onMouseLeave={ handleOnMouseLeave }
                                    className={ `search-result-item${selectedNote.itemIndex === itemIndex ? " selected" : ""}` }>
                                    <div className="search-result-item__title">{ item.title }</div>
                                    &nbsp;| &nbsp;
                                    <div className="search-result-item__foldername">{ item.folderName }</div>
                                </button>
                            ))

                            :

                            <div className="search-result-default-page">

                                { !isLoading &&
                                    <>
                                        <i className="bi bi-emoji-frown-fill"></i>
                                        <p>No notes found.</p>
                                    </>
                                }

                            </div>

                }

            </div>

        </div >

    );
};

export default SearchBar;