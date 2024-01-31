// the menu on the side
import NoteList from "./NoteList";
import { switchState } from "./utils";

const Menu = ({ menuStatus, setMenuStatus, currentNote, setCurrentNote }) => {

    

    return (
        
        <div className={ `${"menu"} ${menuStatus === "expanded" ? "menu--expanded" : menuStatus === "hidden" && "menu--hidden"}` }>
           
            {/* the buttons of the menu */}
            <div className="menu__functionalities">
                {/* if the menu is in the normal state, show the expand button */}
                { menuStatus === "normal" && <button className="text-button" onClick={ () => switchState(menuStatus, setMenuStatus, "expanded") }>expand</button> }

                {/* if the menu isn't hidden and show a left arrow, otherwise a right arrow */}
                { menuStatus !== "hidden" ?
                    <button className="arrow left" onClick={ () => switchState(menuStatus, setMenuStatus, menuStatus === "expanded" ? "normal" : "hidden") }></button> :
                    <button className="arrow right" onClick={ () => switchState(menuStatus, setMenuStatus, "normal") }></button>
                }

            </div>

            { menuStatus !== "hidden" && <NoteList currentNote={ currentNote } setCurrentNote={ setCurrentNote } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } />}

        </div>

    );
};

export default Menu;