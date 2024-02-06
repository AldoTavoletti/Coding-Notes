import { switchState } from "./utils";
const Header = ({ modalShowing, setModalShowing, isLoggedIn, setIsLoggedIn }) => {

    return (

        <div className="header">
            {/* the title */ }
            <p>Coding Notes</p>

            {/* the buttons in the header */ }



            <div className="header__buttons-div">

                { isLoggedIn ? <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "folder") }>Add a folder +</button> : <button className="primary-button" >Register</button> }

                { isLoggedIn && <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "note") }>Add a note +</button>}
            </div>
        </div>

    );
};

export default Header;