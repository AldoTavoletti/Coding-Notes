// the menu on the side
import NoteList from "./NoteList";
import { switchState } from "./utils";

const Menu = ({ menuStatus, setMenuStatus }) => {




    return (

        <div className={ `${"menu"} ${menuStatus === "expanded" ? "menu--expanded" : menuStatus === "hidden" && "menu--hidden"}` }>
            <div className="menu__functionalities">

                { menuStatus === "normal" && <button className="text-button" onClick={ () => switchState(menuStatus, setMenuStatus, "expanded") }>expand</button> }
                
                { menuStatus !== "hidden" ?
                    <button className="arrow left" onClick={ () => switchState(menuStatus, setMenuStatus, menuStatus === "expanded" ? "normal" : "hidden") }></button> :
                    <button className="arrow right" onClick={ () => switchState(menuStatus, setMenuStatus, "normal") }></button>
                }

            </div>
            <NoteList />

        </div>

    );
};

export default Menu;