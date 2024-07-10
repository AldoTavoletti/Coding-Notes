import { useRef, useState } from "react";
import { URL, saveLastNoteTitle, switchNote } from "../utils/utils";
import { useSWRConfig } from "swr";


const SearchBar = ({ lastNote, setCurrentNote, setNoteTitle, setMenuStatus, noteTitle, folders }) => {

    const [result, setResult] = useState([]);
    const [inputContent, setInputContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const searchInput = useRef(null);
    const { mutate } = useSWRConfig();


    const getResult = (string) => {
        setIsLoading(true);
        fetch(URL + "?search=" + string, {

            method: "GET",
            credentials: "include",

        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();

        }).then((data) => {

            setResult(data);
            setIsLoading(false);


        }).catch(err => {

            console.log(err);

        });

    };
    const handleOnChange = (value) => {

        getResult(value);
        setInputContent(value);
    };

    const handleItemClick = (item) => {


       saveLastNoteTitle(lastNote.current, folders, noteTitle);

        switchNote
            (
                { noteID: item.noteID, folderName: item.folderName, folderID: item.folderID },
                item.title,
                setCurrentNote,
                setNoteTitle,
                setMenuStatus
            );

        // mutate(URL + "?retrieve=all");

    };

    const handleOnFocus = () => {

        setIsFocused(true);

        if (inputContent !== "") {
            getResult(inputContent);
        }

    };

    const handleOnBlur = () => {

        setIsFocused(false);

    };

    const focusSearch = () => {

        searchInput.current.focus();

    };

    return (
        <div className="search-container">
            <div class="input-group">
                <input ref={ searchInput } onChange={ (e) => handleOnChange(e.target.value) } onBlur={ handleOnBlur } onFocus={ handleOnFocus } type="text" className="searchbar" placeholder="Search..." aria-describedby="btnGroupAddon" />
                <button class="input-group-text" id="btnGroupAddon" onClick={ focusSearch } ><i class="bi bi-search"></i></button>
            </div>

            <div className={ `search-result-container${isFocused ? " show" : ""}` }>

                { inputContent.length > 0 ?

                    isLoading ?

                        <div className="search-result-default-page">

                            <div class="spinner-grow" role="status"></div>

                        </div>

                        :

                        result.length > 0 ?
                            result.map((item) => (
                                <button
                                    onClick={ () => handleItemClick(item) }
                                    className="search-result-item">
                                    <div className="search-result-item__title">{ item.title }</div>
                                    &nbsp;| &nbsp;
                                    <div className="search-result-item__foldername">{ item.folderName }</div>
                                </button>
                            ))
                            :

                            <div className="search-result-default-page">

                                <i class="bi bi-emoji-frown-fill"></i>
                                <p>No notes found.</p>

                            </div>

                    :

                    <div className="search-result-default-page">

                        <i class="bi bi-search"></i>
                        <p>Search for a note!</p>

                    </div>

                }

            </div>

        </div>

    );
};

export default SearchBar;