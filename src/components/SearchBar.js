import { useState } from "react";
import { URL, switchNote } from "../utils/utils";


const SearchBar = ({ setCurrentNote, setNoteTitle, setMenuStatus }) => {

    const [result, setResult] = useState([]);
    const [inputContent, setInputContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

        switchNote
            (
                { noteID: item.noteID, folderName: item.folderName, folderID: item.folderID },
                item.title,
                setCurrentNote,
                setNoteTitle,
                setMenuStatus
            );


    };

    return (
        <div className="search-container">
            <input onChange={ (e) => handleOnChange(e.target.value) } type="text" className="searchbar" placeholder="Search..." />

            <div className="search-result-container">

                { inputContent.length > 0 ?

                    isLoading ?

                        <div className="search-result-default-page">

                            <div class="spinner-grow" role="status"></div>

                        </div>

                        :

                        result.length > 0 ?
                            result.map((item) => (
                                <button onClick={ () => handleItemClick(item) } className="search-result-item">{ item.title } &nbsp;&gt; &nbsp;{ item.folderName }</button>
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