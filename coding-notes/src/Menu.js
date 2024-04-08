import NoteList from "./NoteList";

import { switchState } from "./utils";
import $ from "jquery";
import { URL } from "./utils";

const Menu = ({ menuStatus, setMenuStatus, currentNote, setCurrentNote, modalShowing, setModalShowing, noteTitle, setNoteTitle, userID, setUserID, isLoggedIn, setIsLoggedIn }) => {

    //|| the status of the menu ("normal","expanded","hidden") is controlled with the menuStatus state variable.
    const logout = () => {



        $.ajax({
            url: URL + "?logout=true",
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: (res) => {
                console.log(res);
                const resParsed = JSON.parse(res);
                if (resParsed["code"] === 200) {
                    switchState(isLoggedIn, setIsLoggedIn);

                }



            },
            error: (err) => {
                // console.log(err);

            }
        });
    }
    return (
        
        <div className={ `${"menu"} ${menuStatus === "expanded" ? "menu--expanded" : menuStatus === "hidden" && "menu--hidden"}` }>
           
            


                {/*//? if the menu is in the normal state, show the expand button */}
                { menuStatus === "normal" && 
                (
                    
                    <div className="menu__functionalities">
                    <div className="subheader subheader--normal">

                <button className="text-button" onClick={ () => switchState(menuStatus, setMenuStatus, "expanded") }>expand</button> 
                <button className="arrow left" onClick={ () => switchState(menuStatus, setMenuStatus, "hidden") }></button> 
                </div>
                </div>

                )}

                {/*//? if the menu isn't hidden and show a left arrow, otherwise a right arrow */}
                { menuStatus === "hidden" &&(
                <div className="menu__functionalities">
                    <div className="subheader--small">

                    <button className="arrow right" onClick={ () => switchState(menuStatus, setMenuStatus, "normal") }></button>
                </div>
                </div>

                )
                }

                {menuStatus === "expanded" &&
                
                (
                <div className="menu__functionalities">

                    <div className="subheader--expanded">

                        <div className="header__buttons-div">
                                        <button className="text-button" onClick={ () => logout() }>logout</button>
                                        <div className="vert-line"></div>
                                        <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "folder") }>Add a folder +</button>
                                        <button className="primary-button" onClick={ () => switchState(modalShowing, setModalShowing, "note") }>Add a note +</button>

                        </div>
                        <button className="arrow left" onClick={ () => switchState(menuStatus, setMenuStatus, "normal") }></button> 

                    </div>

                </div>

                )
                
                }

            { menuStatus !== "hidden" && <NoteList userID={ userID } setUserID={ setUserID } noteTitle={noteTitle} setNoteTitle={setNoteTitle} currentNote={ currentNote } setCurrentNote={ setCurrentNote } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } modalShowing={ modalShowing } setModalShowing={ setModalShowing } />}

        </div>

    );
};

export default Menu;