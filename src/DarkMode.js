import React, { useState } from "react";
import { setLightMode,setDarkMode, setUserTheme } from "./utils";
const DarkMode = () => {

    const [selectedTheme,setSelectedTheme] = useState(localStorage.getItem("selectedTheme"));

    const toggleTheme = (e)=>{
        if (e.target.checked) {
            setDarkMode()  
            setSelectedTheme("dark"); 
        }else{
         setLightMode();
         setSelectedTheme("light");
        }
    }

    setUserTheme();

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                defaultChecked={selectedTheme === "dark"}
                id='darkmode-toggle'
                onChange={(e)=>toggleTheme(e)}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                { selectedTheme === "dark" ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill"></i> }
                
            </label>
        </div>
    );
};

export default DarkMode;
