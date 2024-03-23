import { getLuminance } from 'polished';
import $ from "jquery";

export const URL = "http://localhost/CodingNotesRepo/coding-notes/PHP/index.php";


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
export const openMenu = (e, state, setMethod, elementID = null, elementType = null, folderName=null, folderColor = null) => {
    
    e.preventDefault();
    e.stopPropagation();

    switchState(state, setMethod, { x: e.pageX + "px", y: e.pageY + "px", elementID: elementID, elementType: elementType, folderName:folderName, folderColor:folderColor });

};

export const patchAjaxCall = (obj) => {
    console.log(obj);
    $.ajax({
        url: URL,
        type: 'PATCH',
        data: JSON.stringify(obj),
        success: (res) => {
            console.log('done');
            console.log(obj);
            

        },
        error: (err) => {
            console.log(err);

        }
    });

}