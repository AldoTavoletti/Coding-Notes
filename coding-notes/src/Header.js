import { switchState } from "./utils";
const Header = ({ modalShowing, setModalShowing }) => {

    return (

        <div className="header">
            {/* the title */ }
            <p>Coding Notes</p>

            {/* the buttons in the header */ }
            <div className="header__buttons-div">
                
                {/* add a folder */}
                <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "folder") }>Add a folder +</button>
                
                {/* add a note */}
                <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "note") }>Add a note +</button>
           
            </div>
        </div>

    );
};

export default Header;