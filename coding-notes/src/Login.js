import { useEffect, useRef, useState } from "react";
import { URL } from "./utils";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

const Login = ({isLoggedIn, setIsLoggedIn, setCurrentNote, currentNote, noteTitle, setNoteTitle}) => {

    const [wantsLogin, setWantsLogin] = useState(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [error, setError] = useState(null);

    const [isLongEnough, setIsLongEnough] = useState(null);

    const navigate = useNavigate();

    useEffect(()=>{

        isLoggedIn && setIsLoggedIn(false);
        currentNote && setCurrentNote(null);
        noteTitle && setNoteTitle("");

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const logIn = () => {

        if (username === "") {
            setError("Insert a username");
        } else if (password === "") {

            setError("insert a password");

        }else{

            $.ajax({
                url: URL,
                type: 'POST',
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify({ username: username, password: password, action: "login" }),
            
                success: (res) => {
                    const resParsed = JSON.parse(res); 
                    if (resParsed["code"] === 200) {
                        setIsLoggedIn(true);
                        navigate("/");

                    }else{

                        setError(resParsed["message"]);

                    }

                    console.log(res);


                },
                error: (err) => {
                    // console.log(err);

                }
            });

        }

    };

    const signUp = () => {

        if (username === "") {
            setError("Insert a username");
        } else if ( password === "") {
            
        setError("insert a password");


        } else if (password2 !== password) {
            setError("the passwords are not the same");

        }else if (isLongEnough !== true) {
            setError("The password should be at least 8 characters long");
        
        }else{

        $.ajax({
            url: URL,
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({ username: username, password: password, action:"signup" }),
            success: (res) => {
                console.log(res);

                setIsLoggedIn(true);

                navigate("/");
            },
            error: (err) => {
                console.log(err);

            }
        });
    }
    };

    const handleSignUpClick = () => {

        if (wantsLogin) {

            titleRef.current.style.opacity = 0;
            setTimeout(() => {
                
                titleRef.current.style.opacity = 1;
                setWantsLogin(false);  
                setError(null);
                
                
            }, 200);
        } else {

            signUp();

        }

    };

    const handleLoginClick = () => {
        if (!wantsLogin) {
            titleRef.current.style.opacity = 0;

            setTimeout(() => {
                
                titleRef.current.style.opacity = 1;
                setWantsLogin(true);
                setError(null);


            }, 200);
        } else {

logIn();

        }

    };

    const titleRef = useRef();

    const confirmPasswordRef = useRef();

    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {

            $.ajax({
                url: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
                type: 'GET',
                headers: {
                    Authorization: `Bearer ${codeResponse.access_token}`,
                    Accept: 'application/json'
                },
                success: (res) => {
                    console.log(res);

                    $.ajax({
                        url: URL,
                        type: 'POST',
                        xhrFields: {
                            withCredentials: true
                        },
                        data: JSON.stringify({ googleID:res.id }),

                        success: (res) => {
                            console.log(res);

                            const resParsed = JSON.parse(res);
                            if (resParsed["code"] === 200) {
                                setIsLoggedIn(true);
                                navigate("/");

                            } else {

                                setError(resParsed["message"]);

                            }



                        },
                        error: (err) => {
                            // console.log(err);

                        }
                    });
                },
                error: (err) => {
                    console.log(err);

                }
            });

        },
        onError: (error) => console.log('Login Failed:', error)
    });

const handlePasswordInput = (e, set)=>{

    set(e.target.value);

    if (e.target.value.length >= 8 && isLongEnough !== true) {
        setIsLongEnough(true);
    } else if (e.target.value.length < 8 && isLongEnough !== false){

        setIsLongEnough(false);
    } else if (e.target.value.length === 0) {
        setIsLongEnough(null);
    }

}

    return (

        <div className="login-page">

            <svg preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80" className="background-login">
                <path fill="#ffffff" className="out-top" d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z" />
                <path fill="#232323" className="in-top" d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z" />
                <path fill="#3e3d3d" className="out-bottom" d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z" />
                <path fill="#ffffffc9" className="in-bottom" d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z" />
            </svg>


            <div className="login-container">
                <p ref={titleRef}>{ wantsLogin ? "Login" : "Sign up" }</p>
                <input type="text" name="username" placeholder="Username..." onChange={ (e) => setUsername(e.target.value) } />
                <input type="password" name="password" placeholder="Password..." onChange={ (e) => handlePasswordInput(e, setPassword) } />
                <input ref={ confirmPasswordRef } className={ wantsLogin && "input-disappear" } type="password" name="passwordConfirm" placeholder="Confirm Password..." onChange={ (e) => setPassword2(e.target.value)  } />
                { !wantsLogin && <span className={ `password-condition ${isLongEnough === true ? "password-condition--green" : isLongEnough === false && "password-condition--red"}` }>At least 8 characters long { isLongEnough === true ? "✓" : isLongEnough === false && "✕" }</span>}
                { error && <p className="login-container__error">{ error }</p> }

                <div className="login-container__buttons">
                    <button onClick={ (e) => handleSignUpClick(e) } type= "button" className={!wantsLogin ? "active":""}>Sign Up</button>
                    <button onClick={ (e) => handleLoginClick(e) } type="button" className={ wantsLogin ? "active" : "" }>Login</button>
                </div>
               
                <button className="gsi-material-button" onClick={ () => googleLogin() }>
                    <div className="gsi-material-button-state"></div>
                    <div className="gsi-material-button-content-wrapper">
                        <div className="gsi-material-button-icon">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                        </div>
                        <span style={{display: "none"}}>Sign in with Google</span>
                    </div>
                </button>
            </div>
        </div>

    );
};

export default Login;