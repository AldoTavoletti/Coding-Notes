import { switchState } from "./utils";

const Header = ({ modalShowing, setModalShowing }) => {

    return (

        <div className="header">
            
            <p>Coding Notes</p>

            <div className="header__buttons-div">

                {/* // // { isLoggedIn ? <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "folder") }>Add a folder +</button> : <button className="primary-button" >Register</button> } */}
                {/* // //{ isLoggedIn && <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "note") }>Add a note +</button> } */}
                
                <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "folder") }>Add a folder +</button>
                <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "note") }>Add a note +</button>

            </div>
        </div>

    );
};

export default Header;