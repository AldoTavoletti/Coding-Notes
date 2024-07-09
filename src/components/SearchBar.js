import { useState } from "react";
import { URL } from "../utils/utils";
import { useSWRConfig } from "swr";

const SearchBar = ({ setCurrentNote, setNoteTitle}) => {
    
    const [result,setResult] = useState([]);
    const { mutate } = useSWRConfig();



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
console.log("ciao");
        // set the currentNote to be the one that was just created
        setCurrentNote({ noteID: item.noteID, folderName: item.folderName, folderID: item.folderID });

        //change the noteTitle
        setNoteTitle(item.title);

        // refetch
        mutate();

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