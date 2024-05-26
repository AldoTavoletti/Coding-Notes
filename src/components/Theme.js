import React, { useState } from "react";
import { setLightMode, setDarkMode } from "../utils/utils";

const Theme = () => {

    // get the selectedTheme, saved in the localStorage
    const [isLightTheme, setIsLightTheme] = useState(localStorage.getItem("light-theme"));

    /**
     * 
     * @param {Event} e 
     */
    const toggleTheme = (e) => {
        if (e.target.checked) /* if the theme has to be switched to dark */ {

            setDarkMode();
            setIsLightTheme(null);

        } else  /* if the theme has to be switched to light */ {

            setLightMode();
            setIsLightTheme(true);

        }
    };

    // setUserTheme();

    return (
        <div className='theme-div'>
            <input
                className='theme-div__input'
                type='checkbox'
                defaultChecked={ !isLightTheme } // if it's dark or if it's null, make it checked
                id='theme-toggle'
                onChange={ (e) => toggleTheme(e) }
            />
            <label className='theme-div__label' htmlFor='theme-toggle'>
                { isLightTheme ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i> }
            </label>
        </div>
    );
};

export default Theme;
