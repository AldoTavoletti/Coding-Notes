import { useEffect, useRef, useState } from "react";
import { URL } from "./utils";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ isLoggedIn, setIsLoggedIn, setCurrentNote, currentNote, noteTitle, setNoteTitle }) => {

    // it's true if the login page is being showed, false if it's the sign up page
    const [wantsLogin, setWantsLogin] = useState(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    // an eventual error is showed using this variable
    const [error, setError] = useState(null);

    // check if the password is long enough
    const [isLongEnough, setIsLongEnough] = useState(null);

    // false if the password is hidden, true if's shown
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const navigate = useNavigate();

    //? I need useEffect, otherwise an error is called
    useEffect(()=>{

        // reset these state variables
        isLoggedIn && setIsLoggedIn(false);
        currentNote && setCurrentNote(null);
        noteTitle !== "" && setNoteTitle("");

    });

   

    /**
     * @note classic login
     */
    const logIn = () => {


        if (username === "") /* if the username hasn't been set */ {

            setError("Insert a username");

        } else if (password === "") /* if the password hasn't been set */ {

            setError("insert a password");

        } else  /* if it's all good*/ {


            fetch(URL, {

                method: "POST",
                credentials: "include",
                body: JSON.stringify({ username: username, password: password, action: "login" }),

            }).then(res => {

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                //?res.text() to see php error
                return res.json();


            }).then(data => {
                console.log(data);
                if (data["code"] === 200) {
                    // log in
                    setIsLoggedIn(true);
                    navigate("/");

                } else {

                    setError(data["message"]);

                }


            }).catch(err => console.log(err));

        }

    };

    /**
     * @note classic sign in
     */
    const signUp = () => {

        if (username === "") /* if the username hasn't been set */ {

            setError("Insert a username");

        } else if (/\s/g.test(username)) {

            setError("The username can't contain white spaces") 
            
        }else if (password === "") /* if the password hasn't been set */ {

            setError("insert a password");


        } else if (password2 !== password) /* if the 2 passwords are not the same */ {

            setError("the passwords are not the same");

        } else if (isLongEnough !== true) /* if the password isn't long enough */ {

            setError("The password should be at least 8 characters long");

        } else {
            fetch(URL, {

                method: "POST",
                credentials: "include",
                body: JSON.stringify({ username: username, password: password, action: "signup" })

            }).then(res => {

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();


            }).then(data => {

                if (data["code"] === 200) {

                    // log in
                    setIsLoggedIn(true);
                    navigate("/");

                } else {

                    setError(data["message"]);

                }


            }).catch(err => console.log(err));

        }
    };

    /**
     * @note sign up button click
     */
    const handleSignUpClick = () => {

        if (wantsLogin) /* if the user wants to switch from login to signup */ {

            // animation
            titleRef.current.style.opacity = 0;
            setTimeout(() => {

                titleRef.current.style.opacity = 1;

                // the user wants to sign up
                setWantsLogin(false);

                // delete error if there was one
                error && setError(null);


            }, 200);

        } else /* if the user wants to sign up */ {

            signUp();

        }

    };

    /**
     * @note login button click
     */
    const handleLoginClick = () => {
        if (!wantsLogin) /* if the user wants to switch from signup to login */ {

            //animation
            titleRef.current.style.opacity = 0;

            setTimeout(() => {

                titleRef.current.style.opacity = 1;

                // the user wants to login
                setWantsLogin(true);

                // delete error if there was one
                setError(null);


            }, 200);
        } else /* if the user wants to log in */ {

            logIn();

        }

    };

    // ref used for animation
    const titleRef = useRef();

    // ref used for animation
    const confirmPasswordRef = useRef();

    /**
     * @note google login
     */
    const googleLogin = useGoogleLogin({
        // without this line, the codeResponse is different
        flow: "auth-code",

        /**
         * 
         * @param {object} codeResponse 
         */
        onSuccess: (codeResponse) => {

            fetch(URL, {

                method: "POST",
                credentials: "include",
                body: JSON.stringify({ code: codeResponse.code }),
                headers: {'Content-Type': 'application/json'}

            }).then(res => {

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();


            }).then(data => {
                console.log(data);
                if (data["code"] === 200) {

                    // log in
                    setIsLoggedIn(true);
                    navigate("/");

                } else {

                    setError(data["message"]);

                }


            }).catch(err => console.log(err));


        },

        onError: (error) => console.log('Login Failed:', error)
    });

    /**
     * 
     * @param {Event} e 
     * @param {Function} set 
     * @note used only for the first password, but it's built to be reusable
     */
    const handlePasswordInput = (e, set) => {

        // set the password state variable to be the content of the password input
        set(e.target.value);

        if (e.target.value.length >= 8 && isLongEnough !== true) /* if the password is at least 8 char long and the state variable is not true, set it to be */ {
        
            setIsLongEnough(true);
        
        } else if (e.target.value.length < 8 && isLongEnough !== false) /* if the password isn't at least 8 char long and the state variable is not false, set it to be */ {

            setIsLongEnough(false);

        } else if (e.target.value.length === 0) /* if the password is 0 char long, set the state variable to null (it's useless to check if it already was null since it can't be) */ {
        
            setIsLongEnough(null);
        
        }

    };

    /**
     * 
     * @param {Function} set 
     * @param {Boolean} state 
     * @note it's used to toggle the visibility of the passwords, when the input's eye is clicked
     */
    const togglePassword = (set, state) => {
        
        set(!state);

    };
    return (

        <div className="login-page">

            {/* the background */}
            <svg preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80" className="background-login">
                <path fill="#ffffff" className="out-top" d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z" />
                <path fill="#232323" className="in-top" d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z" />
                <path fill="#3e3d3d" className="out-bottom" d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z" />
                <path fill="#ffffffc9" className="in-bottom" d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z" />
            </svg>


            <div className="login-container">

                <p ref={ titleRef }>{ wantsLogin ? "Login" : "Sign up" }</p>

                <input type="text" name="username" placeholder="Username..." onChange={ (e) => setUsername(e.target.value) } />

                {/* password 1 container */}
                <div className="password-container" style={ { marginTop: "calc(15.2px + 8px)" } }> {/* 15.2px is the height of password-condition show in devtools */ }

                    <input 
                    type={ showPassword1 ? "text" : "password" }  // using showPassword1 you can toggle the visiblity of the passowrd
                    placeholder="Password..." 
                    onChange={ (e) => handlePasswordInput(e, setPassword) } 
                    />

                    {/* the eye */}
                    <span 
                    className="password-toggle-icon" 
                    onClick={ () => togglePassword(setShowPassword1, showPassword1) }
                    >{ showPassword1 ? <FaEyeSlash /> : <FaEye /> }</span>

                    {/* the condition (8 char long) */}
                    { !wantsLogin && 
                    <span 
                    className={ `password-condition ${isLongEnough === true ? "password-condition--green" : isLongEnough === false && "password-condition--red"}` } // switch the color based on the length of the password
                    >At least 8 characters long { isLongEnough === true ? "✓" : isLongEnough === false && "✕" }</span> }
              
                </div>

                {/* password 2 container */ }
                <div className="password-container">

                    {/*the confirm password input gets shown/hidden using an animation, that's why it's always mounted */ }
                    <input 
                    ref={ confirmPasswordRef } 
                    className={ wantsLogin && "input-disappear" } 
                    type={ showPassword2 ? "text" : "password" } 
                    placeholder="Confirm Password..." 
                    onChange={ (e) => setPassword2(e.target.value) } />

                    {/* the eye */}
                    { !wantsLogin && 
                    <span 
                    className="password-toggle-icon" 
                    onClick={ () => togglePassword(setShowPassword2, showPassword2) }
                    >{ showPassword2 ? <FaEyeSlash /> : <FaEye /> }</span> }
                
                </div>

                {/* if an error is fired, it's shown here */}
                { error && <p className="login-container__error">{ error }</p> }


                <div className="login-container__buttons">
                    <button onClick={ (e) => handleSignUpClick(e) } type="button" className={ !wantsLogin ? "active" : "" }>Sign Up</button>
                    <button onClick={ (e) => handleLoginClick(e) } type="button" className={ wantsLogin ? "active" : "" }>Login</button>
                </div>

                {/* google button */}
                <button className="gsi-material-button" onClick={ () => googleLogin() }>
                    <div className="gsi-material-button-state"></div>
                    <div className="gsi-material-button-content-wrapper">
                        <div className="gsi-material-button-icon">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={ { display: "block" } }>
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                        </div>
                        <span style={ { display: "none" } }>Sign in with Google</span>
                    </div>
                </button>


            </div>
        </div>

    );
};

export default Login;