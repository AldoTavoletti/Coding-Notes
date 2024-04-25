import { getLuminance } from 'polished';
import $ from "jquery";

// export const URL =  "https://codingnotesbackend.000webhostapp.com/api/index.php";
export const URL = "http://localhost/CodingNotesRepo/api/index.php";


export const folderColors = { black: { primary: "#202020", secondary: "#2b2a2a" }, green: { primary: "#03b703", secondary: "#5cad5c" }, red: { primary: "#ff0000", secondary: "#ff4b4b" }, blue: { primary: "#4d94ff", secondary: "#6ca7ff" }, yellow: { primary: "#e7e731", secondary:"#dfdf77"}};

/**
 * 
 * @param {*} state 
 * @param {Function} setMethod 
 * @param {*} value 
 */
export const switchState = (state, setMethod, value = !state) => {

    setMethod(value);

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
    return backgroundLuminance > threshold ? '#000' : '#fff';
};

/**
 * 
 * @param {Event} e 
 * @param {*} state 
 * @param {Function} setMethod 
 * @param {number} elementID 
 * @param {string} elementType 
 * @note it open the context menu
 */
export const openMenu = (e, setMethod, elementID, elementType, folderName=null, folderColor = null) => {
    
    e.preventDefault();
    e.stopPropagation();

    setMethod({ x: e.pageX + "px", y: e.pageY + "px", elementID: elementID, elementType: elementType, folderName: folderName, folderColor: folderColor });

};

export const simplePatchCall = (obj) => {
    console.log(obj);
    fetch(URL, {

        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(obj)

    }).then(res => {

        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();


    }).then(data => {

    }).catch(err => console.log(err));
    

}