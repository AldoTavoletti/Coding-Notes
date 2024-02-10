import { getLuminance } from 'polished';

export const URL_GET_FOLDERS = "http://localhost/CodingNotesRepo/coding-notes/PHP/folders_api.php";
export const URL_POST = "http://localhost/CodingNotesRepo/coding-notes/PHP/post_api.php";
export const URL_PATCH = "http://localhost/CodingNotesRepo/coding-notes/PHP/patch_api.php";
export const URL_DELETE = "http://localhost/CodingNotesRepo/coding-notes/PHP/delete_api.php";


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
export const openMenu = (e, state, setMethod, elementID = null, elementType = null) => {
    
    e.preventDefault();
    e.stopPropagation();

    switchState(state, setMethod, { x: e.pageX + "px", y: e.pageY + "px", elementID: elementID, elementType: elementType });

};