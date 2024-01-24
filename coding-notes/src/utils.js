import { getLuminance } from 'polished';

export const switchState = (state, setMethod, value = !state) => {

    setMethod(value);

};


export const getContrastColor = (backgroundColor) => {
    const threshold = 0.5; // Adjust this threshold as needed

    // Calculate the lightness of the background color
    const backgroundLuminance = getLuminance(backgroundColor);

    // Determine whether to use light or dark text based on the threshold
    return backgroundLuminance > threshold ? '#000' : '#fff';
};