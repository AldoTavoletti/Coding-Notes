import { useState } from "react";
import { URL, switchNote } from "../utils/utils";
import { useSWRConfig } from "swr";


const SearchBar = ({ setCurrentNote, setNoteTitle, setMenuStatus}) => {
    
    const [result,setResult] = useState([]);

    const getResult = (string)=>{
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
            

        }).catch(err => {

            console.log(err);

        });

    }
    const handleOnChange = (e)=>{

        getResult(e.target.value);

    }

    const handleItemClick = (item)=>{

        switchNote
            (
                { noteID: item.noteID, folderName: item.folderName, folderID: item.folderID },
                item.title,
                setCurrentNote,
                setNoteTitle,
                setMenuStatus
            );


    }

    return ( 
        <div className="search-container">
        <input onChange={(e)=>handleOnChange(e)} type="text" className="searchbar" placeholder="Search..." />
        
        <div className="search-result-container">

            {result.map((item)=>(
                <button onClick={()=>handleItemClick(item)} className="search-result-item">{ item.title } &nbsp;&gt; &nbsp;{item.folderName}</button>
            ))}

        </div>
        
        </div>

     );
}
 
export default SearchBar;