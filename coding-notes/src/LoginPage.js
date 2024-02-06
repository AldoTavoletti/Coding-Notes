const LoginPage = () => {
    return ( 
        
        <div className="login-page">

            <div
                className={ "myModal myModal--visible" }
            >
                {/* the title of the modal */ }
                <div className="myModal__title">LOGIN</div>

                {/* the body of the modal */ }
                <div className="myModal__body">

                    {/* the title of the note */ }
                    <form className="myModal__body__form">

                        <input type="text" name="username" placeholder="Username" />
                        <input type="password" name="password" placeholder="Password" />

                    </form>
                </div>

                {/* the footer of the modal */ }
                <div className="myModal__footer">

                    {/* the add button */ }
                    <button type="submit" className="primary-button">Log in</button>

                </div>

            </div>

        </div>

    );
}
 
export default LoginPage;