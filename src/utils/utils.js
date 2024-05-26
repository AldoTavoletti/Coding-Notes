import { getLuminance } from 'polished';

/*
 this is the main endpoint to the backend. Index.php has a switch statement that
 redirects different requests based on the HTTP method. So every HTTP method has its own
 handler. EX: if I make a POST request to index.php, this will be elaborated to the post_handler.php file
 */
export const URL = "https://coding-notes-backend.onrender.com/index.php";

/* 
these are the colors used for folders and their notes. 
This approach makes it possible to change the hex-code of the colors without causing any problem,
since in the DB only the name of the color is saved. That means if I change the hex-code of black, all black folders 
will be different, and I can do it all just by changing this object.
*/
export const folderColors = {
    black: { primary: "#202020", secondary: "#2b2a2a" },
    green: { primary: "#03b703", secondary: "#5cad5c" },
    red: { primary: "#c21a1a", secondary: "#ff4b4b" },
    blue: { primary: "#4d94ff", secondary: "#6ca7ff" },
    yellow: { primary: "#e7e731", secondary: "#dfdf77" }
};
/**
 * 
 * @param {Function} setState it's the isLoggedIn setState function
 * @param {*} value it's the value that the isLoggedIn state will be set to 
 */
export const logout = (setState, value) => {

    fetch(URL + "?logout=true", {

        method: "GET",
        credentials: "include",


    }).then(res => {

        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();


    }).then(data => {
        if (data["code"] === 200) {
            
            setDarkMode();
            setState(value); // it's the isLoggedIn state. I gotta use a parameterized function if i want logout to be in utils.js


        }


    }).catch(err => console.log(err));


};


/**
 * 
 * @param {string} backgroundColor 
 * @returns the color to use for the text
 */
export const getContrastColor = (backgroundColor) => {
    const threshold = 0.5; // Adjust this threshold as needed

    // Calculate the lightness of the background color
    const backgroundLuminance = getLuminance(backgroundColor);

    // Determine whether to use light or dark text based on the threshold
    return backgroundLuminance > threshold ? '#000000' : '#ffffff';
};

/**
 * 
 * @param {Event} e 
 * @param {*} state 
 * @param {Function} setMethod 
 * @param {number} elementID 
 * @param {string} elementType 
 * @note it opens the context menu
 */
export const openMenu = (e, setMethod, elementID, elementType, folderName = null, folderColor = null) => {

    e.preventDefault();
    e.stopPropagation();

    setMethod({ x: e.pageX + "px", y: e.pageY + "px", elementID: elementID, elementType: elementType, folderName: folderName, folderColor: folderColor });

};

/**
 * 
 * @param {Object} obj
 * @note used to make patch calls 
 */
export const simplePatchCall = (obj) => {

    fetch(URL, {

        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(obj)

    }).then(res => {

        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();


    }).catch(err => console.log(err));


};

/**
 * @note set the dark mode
 */
export const setDarkMode = () => {

    // set the data-theme attribute of the body to dark, so that css style changes
    document.body.setAttribute("data-theme", "dark");

    localStorage.removeItem("light-theme");

};

/**
 * @note set the light mode
 */
export const setLightMode = () => {

    // set the data-theme attribute of the body to light, so that css style changes
    document.body.setAttribute("data-theme", "light");

    // save the selectedTheme in localStorage
    localStorage.setItem("light-theme", true);

};

/**
 * @note set the chosen theme
 */
export const setUserTheme = () => {

    // get the value previously chosen
    const isLightTheme = localStorage.getItem("light-theme");

    // since dark mode is the default one, I just gotta check if it's light, otherwise just keep the dark-mode (even if the isLightTheme is null)
    if (isLightTheme) {

        setLightMode();

    }
};