// the menu on the side
import NoteList from "./NoteList";

const Menu = () => {
    return (

        <div className="menu">
            <div className="menu__functionalities">

                <button className="text-button">expand</button>
                <button className="arrow left"></button>

            </div>
            <NoteList />

        </div>

    );
};

export default Menu;