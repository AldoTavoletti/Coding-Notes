import $ from "jquery";

/**
  * 
  * @param {event} e 
  * @param {Function} setState 
  */
export const handleChange = (e, setState) => {

    setState(state => ({

        ...state,
        [e.target.name]: e.target.value

    }));

};

/**
 * 
 * @param {event} e 
 * @param {object} data 
 * @param {string} url 
 */
export const handleSubmit = (e, data, url) => {

    e.preventDefault();

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success(data) {
            // write what happens if the submit has success
        },
    });

};