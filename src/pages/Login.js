import { useEffect, useRef, useState } from "react";
import { URL, setDarkMode } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ setIsLoggedIn }) => {

    // it's true if the login page is being showed, false if it's the sign up page
    const [wantsLogin, setWantsLogin] = useState(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const rememberMe = useRef();

    // an eventual error is showed using this variable
    const [error, setError] = useState(null);

    // true while waiting for server's response
    const [isLoading, setIsLoading] = useState(false);

    // password conditions
    const [isLongEnough, setIsLongEnough] = useState(null);
    const [hasCapital, setHasCapital] = useState(null);
    const [hasSymbol, setHasSymbol] = useState(null);

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    // refs used for animation
    const titleRef = useRef();
    const confirmPasswordRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {

        // reset this variable in case the user was logged in but decided to access the login page from the url
        setIsLoggedIn(false);

        // I want the login page to always be in dark mode
        if (localStorage.getItem("light-theme")) {

            localStorage.removeItem("light-theme");
            setDarkMode();
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * @note classic login
     */
    const logIn = () => {


        if (username === "") return setError("Insert a username");

        if (password === "") return setError("insert a password");


        setIsLoading(true);

        fetch(URL, {

            method: "POST",
            credentials: "include",
            body: JSON.stringify({ username: username, password: password, remember: rememberMe.current.checked, action: "login" }),

        }).then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            return res.json();


        }).then(data => {

            if (data["code"] === 200) {

                setIsLoggedIn(data["username"]);
                navigate("/");

            } else setError(data["message"]);



            setIsLoading(false);

        }).catch(err => {

            console.log(err);

            setIsLoading(false);

        });



    };

    /**
     * @note classic sign in
     */
    const signUp = () => {

        if (username === "") return setError("Insert a username");

        if (password === "") return setError("insert a password");

        if (!isLongEnough || !hasCapital || !hasSymbol) return setError("Check the password conditions");

        if (password2 !== password) return setError("the passwords are not the same");

        if (/\s/g.test(username)) return setError("The username can't contain white spaces");


        setIsLoading(true);

        fetch(URL, {

            method: "POST",
            credentials: "include",
            body: JSON.stringify({ username: username, password: password, remember: rememberMe.current.checked, action: "signup" })

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

            } else setError(data["message"]);


            setIsLoading(false);


        }).catch(err => {

            console.log(err);
            setIsLoading(false);


        });


    };

    const animateTitle = () => {

        // animation
        titleRef.current.style.opacity = 0;

        setTimeout(() => {

            titleRef.current.style.opacity = 1;

            setWantsLogin(!wantsLogin);

            setError(null);


        }, 200);

    };

    /**
     * @note sign up button click
     */
    const handleSignUpClick = () => {

        /* if wantsLogin is true, it means that the user pressed the signUp button to switch to the signUp form */
        wantsLogin ? animateTitle() : signUp();



    };

    /**
     * @note login button click
     */
    const handleLoginClick = () => {

        /* if wantsLogin is false, it means that the user pressed the logIn button to switch to the logIn form */
        !wantsLogin ? animateTitle() : logIn();

    };

    

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

            setIsLoading(true);

            fetch(URL, {

                method: "POST",
                credentials: "include",
                body: JSON.stringify({ code: codeResponse.code, remember: rememberMe.current.checked }),
                headers: { 'Content-Type': 'application/json' }

            }).then(res => {

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();


            }).then(data => {

                if (data["code"] === 200) {

                    setIsLoggedIn(data["username"]);
                    navigate("/");

                } else setError(data["message"]);

                setIsLoading(false);

            }).catch(err => console.log(err));


        },

        onError: (error) => {

            console.log('Login Failed:', error);
            setIsLoading(false);

        }
    });

    const checkLength = (length) => {

        /*
        ? I don't know if adding conditions like "isLongEnough !== false" could be useful,
        ? since as far as I know, react should re-render the state variable if it gets set to its current value.
        */

        /* if the password is 0 char long, set the state variable to null (it's useless to check if it already was null since it can't be (this function wouldn't have been called) */
        if (length === 0) return setIsLongEnough(null);

        /* if the password is at least 8 char long and the state variable is not true, set it to be */
        if (length >= 8 && isLongEnough !== true) return setIsLongEnough(true);

        /* if the password isn't at least 8 char long and the state variable is not false, set it to be */
        if (length < 8 && isLongEnough !== false) return setIsLongEnough(false);


    };

    const checkCapital = (string) => {
        if (string.length === 0) return setHasCapital(null);
            
        
        /[A-Z]/.test(string) ? 
    
        hasCapital !== true && setHasCapital(true) 
        : 
        hasCapital !== false && setHasCapital(false);

    };

    /**
     * 
     * @param {String} string 
     * @returns 
     */
    const checkSymbol = (string) => {

        if (string.length === 0) return setHasSymbol(null);
            

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

        if (e.key !== "Enter") return;
        
        wantsLogin ? logIn() : signUp();

    };

    return (

        <div className="login-page">

            <div className="login-container">
                { isLoading ?

                    <div class="spinner-grow" role="status"></div>
                    :
                    <p ref={ titleRef }>{ wantsLogin ? "Log in" : "Sign up" }</p>

                }

                <input type="text" name="username" placeholder="Username..." onChange={ (e) => setUsername(e.target.value) } maxLength="255" />

                {/* password 1 container */ }
                <div className="password-container" style={ { marginTop: "24.85px" } }> {/* 15.2px is the height of password-condition show in devtools */ }

                    <input
                        type={ showPassword1 ? "text" : "password" }  // using showPassword1 you can toggle the visiblity of the passowrd
                        placeholder="Password..."
                        onChange={ (e) => handlePasswordInput(e, setPassword) }
                        maxLength="255"
                    />

                    {/* the eye */ }
                    <span
                        className="password-toggle-icon"
                        onClick={ () => togglePassword(setShowPassword1, showPassword1) }
                    >{ showPassword1 ? <FaEyeSlash /> : <FaEye /> }</span>
                </div>
                <div className={ `conditions-container ${wantsLogin && "disappear"}` }>
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
                <div className={ `password-container ${wantsLogin && "disappear"}` }>

                    {/*the confirm password input gets shown/hidden using an animation, that's why it's always mounted */ }
                    <input
                        ref={ confirmPasswordRef }
                        type={ showPassword2 ? "text" : "password" }
                        placeholder="Confirm Password..."
                        onChange={ (e) => setPassword2(e.target.value) }
                        maxLength="255"
                    />


                    {/* the eye */ }
                    { !wantsLogin &&
                        <span
                            className="password-toggle-icon"
                            onClick={ () => togglePassword(setShowPassword2, showPassword2) }
                        >{ showPassword2 ? <FaEyeSlash /> : <FaEye /> }</span> }

                </div>

                <div className="checkbox-container">
                    <input type="checkbox" id="rememberme" ref={ rememberMe } />
                    <label htmlFor="rememberme">Remember me</label>
                </div>

                {/* if an error is fired, it's shown here */ }
                { error && <><br></br><p className="login-container__error">{ error }</p></> }


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

                        <button onClick={ () => handleSignUpClick() } type="button" className={ !wantsLogin ? "active secondary-button" : "secondary-button" }>Sign Up</button>
                        <button onClick={ () => handleLoginClick() } type="button" className={ wantsLogin ? "active secondary-button" : "secondary-button" }>Log in</button>

                    </div>


                </div>



            </div>

            {/* background */ }
            <div className="ripple-background">

                <div className="circle xxlarge shade1"></div>
                <div className="circle xlarge shade2"></div>
                <div className="circle large shade3"></div>
                <div className="circle medium shade4"></div>

                <p className="sponsor"><span className="sponsor--purple">Coding Notes</span><br></br>what you really need.</p>


            </div>
        </div>

    );
};

export default Login;
