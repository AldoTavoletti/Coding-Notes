//import $ from "jquery";

export const switchState = (state, setMethod, value = !state) => {

    setMethod(value);

};