import { useState } from "react";
import { URL } from "./utils";
import $ from "jquery";
import { useNavigate } from "react-router-dom";


const Login = ({setUserID}) => {

    const [wantsLogin, setWantsLogin] = useState(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [error, setError] = useState(null);

    const navigate = useNavigate();

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

        }else{

        $.ajax({
            url: URL,
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({ username: username, password: password, action:"signup" }),
            success: (res) => {

                console.log('done');
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

            setWantsLogin(false);
        } else {

            signUp();

        }

    };

    const handleLoginClick = () => {
        if (!wantsLogin) {
            setWantsLogin(true);
        } else {

logIn();

        }

    };

    return (

        <div className="login-page">

            <svg preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80" className="background-login">
                <path fill="#ffffff" className="out-top" d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z" />
                <path fill="#232323" className="in-top" d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z" />
                <path fill="#3e3d3d" className="out-bottom" d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z" />
                <path fill="#ffffffc9" className="in-bottom" d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z" />
            </svg>


            <div className="login-container">
                { wantsLogin ? <p>Login</p> : <p>Sign up</p> }
                <input type="text" name="username" placeholder="Username..." onChange={ (e) => setUsername(e.target.value) } />
                <input type="password" name="password" placeholder="Password..." onChange={ (e) => setPassword(e.target.value) } />
                { !wantsLogin && <input type="password" name="password-confirm" placeholder="Confirm Password..." onChange={ (e) => setPassword2(e.target.value) } /> }
                { error && <p className="login-container__error">{ error }</p> }

                <div className="login-container__buttons">
                    <button onClick={ (e) => handleSignUpClick(e) } type= "button">Sign Up</button>
                    <button onClick={ (e) => handleLoginClick(e) } type= "button">Login</button>
                </div>
            </div>

        </div>

    );
};

export default Login;