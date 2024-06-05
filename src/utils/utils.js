import { getLuminance } from 'polished';

/*
 this is the main endpoint to the backend. Index.php has a switch statement that
 redirects different requests based on the HTTP method. So every HTTP method has its own
 handler. EX: if I make a POST request to index.php, this will be elaborated by the post_handler.php file
 */
export const URL = "https://coding-notes-backend.onrender.com/index.php";

/* 
these are the colors used for folders and their notes. 
This approach makes it possible to change the hex-code of the colors without causing any problem,
since only the name of the color is saved in the DB. That means if I change the hex-code of black, all black folders 
will be different, and I can do it all just by changing this object.
*/
export const folderColors = {
    black: { primary: "#202020", secondary: "#2b2a2a" },
    green: { primary: "#03b703", secondary: "#6fc36f" },
    red: { primary: "#c21a1a", secondary: "#ff4b4b" },
    blue: { primary: "#4d94ff", secondary: "#83b5ff" },
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
            
            setState(value); // it's the isLoggedIn state. I gotta use a parameterized function if i want logout to be in utils.js


        }


    }).catch(err => console.log(err));


};


/**
 * 
 * @param {string} backgroundColor 
 * @returns {string} the color to use for the text
 */
export const getContrastColor = (backgroundColor) => {
    const threshold = 0.5; // Adjust this threshold as needed

    // Calculate the lightness of the background color
    const backgroundLuminance = getLuminance(backgroundColor);

    // Determine whether to use light or dark text based on the threshold
    return backgroundLuminance > threshold ? "#000000" : "#ffffff";
};

/**
 * 
 * @param {Event} e 
 * @param {*} state 
 * @param {Function} setMethod 
 * @param {number} elementID 
 * @param {string} elementType 
 * @note it opens the context menu. Since it's used for both notes and folders, folderName and folderColor will always be there, but they're default value is null.
 */
export const openMenu = (e, setMethod, elementID, elementType, folderName = null, folderColor = null) => {

    // prevent the default browser's context menu to appear
    e.preventDefault();

    // make sure that when opening a note's context menu, the folder in which it is contained does not get opened
    e.stopPropagation();

    /* 
    x: the x of the mouse click.
    y: the y of the mouse click.
    elementID: the id of the element for which the context menu was opened.
    elementType: the type of element ("note","folder").
    folderName (could be null): the name of the folder, that has to be set as default when opening the modify modal.
    folderColor (could be null): the color of the folder, that has to be set as default when opening the modify modal.
    */
    setMethod({ x: e.pageX + "px", y: e.pageY + "px", elementID: elementID, elementType: elementType, folderName: folderName, folderColor: folderColor });

};

/**
 * 
 * @param {Object} obj
 * @note used to make patch calls 
 * @firedby (ex: when changing the content of a note)
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

    // remove the light-theme attribute of the body, so that css style changes
    document.body.removeAttribute("light-theme");

    // remove the item from localStorage
    localStorage.removeItem("light-theme");

};

/**
 * @note set the light mode
 */
export const setLightMode = () => {

    // set the light-theme attribute of the body to true, so that css style changes
    document.body.setAttribute("light-theme", "true");

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