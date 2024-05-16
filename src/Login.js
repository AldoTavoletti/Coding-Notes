import { useEffect, useRef, useState } from "react";
import { URL } from "./utils";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ isLoggedIn, setIsLoggedIn }) => {

    // it's true if the login page is being showed, false if it's the sign up page
    const [wantsLogin, setWantsLogin] = useState(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const rememberMe = useRef();

    // an eventual error is showed using this variable
    const [error, setError] = useState(null);

    // conditions
    const [isLongEnough, setIsLongEnough] = useState(null);

    const [hasCapital, setHasCapital] = useState(null);

    const [hasSymbol, setHasSymbol] = useState(null);

    // false if the password is hidden, true if it's shown
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const navigate = useNavigate();

    //? I need useEffect, otherwise an error is called
    useEffect(() => {

        // reset this variable in case the user was logged in but decided to access the login page from the url
        isLoggedIn && setIsLoggedIn(false);


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
                body: JSON.stringify({ username: username, password: password, remember:rememberMe.current.checked,action: "login" }),

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
                    setIsLoggedIn(data["username"]);
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

            setError("The username can't contain white spaces");

        } else if (password === "") /* if the password hasn't been set */ {

            setError("insert a password");


        } else if (isLongEnough !== true) /* if the password isn't long enough */ {

            setError("The password should be at least 8 characters long");

        } else if (hasCapital !== true) {

            setError("The password should contain at least 1 capital letter");

        } else if (hasSymbol !== true) {

            setError("The password should contain at least 1 symbol");
            
        } else if (password2 !== password) /* if the 2 passwords are not the same */ {

            setError("the passwords are not the same");


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
                    setIsLoggedIn(data["username"]);
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
                body: JSON.stringify({ code: codeResponse.code, remember: rememberMe.current.checked}),
                headers: { 'Content-Type': 'application/json' }

            }).then(res => {

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();


            }).then(data => {
                console.log(data);
                if (data["code"] === 200) {

                    // log in
                    setIsLoggedIn(data["username"]);
                    navigate("/");

                } else {

                    setError(data["message"]);

                }


            }).catch(err => console.log(err));


        },

        onError: (error) => console.log('Login Failed:', error)
    });

    const checkLength = (length) => {

        if (length === 0) /* if the password is 0 char long, set the state variable to null (it's useless to check if it already was null since it can't be (this function wouldn't have been called)) */ {

            setIsLongEnough(null);

        } else if (length >= 8 && isLongEnough !== true) /* if the password is at least 8 char long and the state variable is not true, set it to be */ {

            setIsLongEnough(true);

        } else if (length < 8 && isLongEnough !== false) /* if the password isn't at least 8 char long and the state variable is not false, set it to be */ {

            setIsLongEnough(false);

        }

    };

    const checkCapital = (string) => {
        if (string.length === 0) {
            setHasCapital(null);
            return;
        }
        /[A-Z]/.test(string) ? hasCapital !== true && setHasCapital(true) : hasCapital !== false && setHasCapital(false);

    };

    const checkSymbol = (string) => {
        if (string.length === 0) {
            setHasSymbol(null);
            return;
        }
        /[\W_]/.test(string) ? 
        hasSymbol !== true && setHasSymbol(true) 
        : 
        hasSymbol !== false && setHasSymbol(false);



    };

    /**
     * 
     * @param {Event} e 
     * @param {Function} set 
     * @note used only for the first password, but it's built to be reusable
     */
    const handlePasswordInput = (e, set) => {

        const passwordValue = e.target.value;

        // set the password state variable to be the content of the password input
        set(passwordValue);

        checkLength(passwordValue.length);

        checkCapital(passwordValue);

        checkSymbol(passwordValue);

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

    // to login/signup pressing "Enter"
    window.onkeyup = (e) => {

        if (e.key !== "Enter") {
            return;
        }

        wantsLogin ? handleLoginClick() : handleSignUpClick();

    };

    return (

        <div className="login-page">

            <div className="login-container">

                <p ref={ titleRef }>{ wantsLogin ? "Login" : "Sign up" }</p>

                <input type="text" name="username" placeholder="Username..." onChange={ (e) => setUsername(e.target.value) } />

                {/* password 1 container */ }
                <div className="password-container" style={ { marginTop: "24.85px" } }> {/* 15.2px is the height of password-condition show in devtools */ }

                    <input
                        type={ showPassword1 ? "text" : "password" }  // using showPassword1 you can toggle the visiblity of the passowrd
                        placeholder="Password..."
                        onChange={ (e) => handlePasswordInput(e, setPassword) }
                    />

                    {/* the eye */ }
                    <span
                        className="password-toggle-icon"
                        onClick={ () => togglePassword(setShowPassword1, showPassword1) }
                    >{ showPassword1 ? <FaEyeSlash /> : <FaEye /> }</span>
                    </div>
        <div className={`conditions-container ${wantsLogin && "disappear" }`}>
                    {/* the condition (8 char long) */ }
                        <span
                            className={ `password-condition ${isLongEnough === true ? "password-condition--green" : isLongEnough === false && "password-condition--red"}` } // switch the color based on the length of the password
                        >• 8 characters long { isLongEnough === true ? "✓" : isLongEnough === false && "✕" }</span>

                        <span
                            className={ `password-condition ${hasCapital === true ? "password-condition--green" : hasCapital === false && "password-condition--red"}` } // switch the color based on the length of the password
                        >• 1 capital letter { hasCapital === true ? "✓" : hasCapital === false && "✕" }</span> 

                        <span
                            className={ `password-condition ${hasSymbol === true ? "password-condition--green" : hasSymbol === false && "password-condition--red"}` } // switch the color based on the length of the password
                        >• 1 symbol { hasSymbol === true ? "✓" : hasSymbol === false && "✕" }</span>

                </div>
                {/* password 2 container */ }
                <div className={`password-container ${ wantsLogin && "disappear" }`}>

                    {/*the confirm password input gets shown/hidden using an animation, that's why it's always mounted */ }
                    <input
                        ref={ confirmPasswordRef }
                        type={ showPassword2 ? "text" : "password" }
                        placeholder="Confirm Password..."
                        onChange={ (e) => setPassword2(e.target.value) } />

                    {/* the eye */ }
                    { !wantsLogin &&
                        <span
                            className="password-toggle-icon"
                            onClick={ () => togglePassword(setShowPassword2, showPassword2) }
                        >{ showPassword2 ? <FaEyeSlash /> : <FaEye /> }</span> }

                </div>

                <div className="checkbox-container">
                <input type="checkbox" id="rememberme" ref={rememberMe}/>
                <label htmlFor="rememberme">Remember me</label>
                </div>

                {/* if an error is fired, it's shown here */ }
                { error && <p className="login-container__error">{ error }</p> }




                <div className="login-container__buttons">

                    <div>

                        {/* google button */ }
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
                                <span className="gsi-material-button-contents">Continue with Google</span>
                                <span style={ { display: "none" } }>Continue with Google</span>
                            </div>
                        </button>

                    </div>

                    <div>

                        <button onClick={ () => handleSignUpClick() } type="button" className={ !wantsLogin ? "active" : "" }>Sign Up</button>
                        <button onClick={ () => handleLoginClick() } type="button" className={ wantsLogin ? "active" : "" }>Login</button>

                    </div>

                 
                </div>

                

            </div>
            <div className="ripple-background">

                <div className="circle xxlarge shade1"></div>
                <div className="circle xlarge shade2"></div>

                <div className="circle large shade3"></div>
                <div className="circle medium shade4"></div>
                <div className="circle small shade5"></div>

                <p className="sponsor"><span className="sponsor--purple">Coding Notes</span><br></br>what you really need.</p>


            </div>
        </div>

    );
};

export default Login;