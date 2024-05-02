import React from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import { setLightMode,setDarkMode, setUserTheme } from "./utils";
const DarkMode = () => {

    const selectedTheme = localStorage.getItem("selectedTheme");

    const toggleTheme = (e)=>{

        e.target.checked ? setDarkMode() : setLightMode();

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
            <label className='dark_mode_label' for='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkMode;
