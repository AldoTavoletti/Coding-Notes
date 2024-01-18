import { switchState } from "./utils";

const Modals = ({ modalShowing, setModalShowing }) => {
    return (

        // dim layer
        <div
            // if the modal is showing, make the dim layer visible
            className={ `${"dim-layer"} ${modalShowing !== "none" ? "dim-layer--visible" : "dim-layer--hidden"}` }
            // if the dim layer is pressed, close the modal and hide the dim layer
            onClick={ () => switchState(modalShowing, setModalShowing, "none") }
        >

            {/* folder modal */ }
            <div
                className={ `${"myModal"} ${modalShowing === "folder" ? "myModal--visible" : "myModal--hidden"}` }
                // when the modal is clicked, don't make the dim layer onClick get triggered
                onClick={ (e) => e.stopPropagation() }
            >

                {/* the title of the modal */}
                <div className="myModal__title">ADD A FOLDER</div>

                {/* the body of the modal */}
                <div className="myModal__body">

                    {/* the name of the folder */}
                    <form method="post" className="myModal__body__form">

                        <input type="text" placeholder="Folder name..." />

                    </form>

                    {/* the color of the folder */}
                    <div className="flex-container">
                        <div className="color-box color-box--green"></div>
                        <div className="color-box color-box--orange"></div>
                        <div className="color-box color-box--red"></div>
                        <div className="color-box color-box--blue"></div>
                        <div className="color-box color-box--yellow"></div>
                    </div>

                </div>

                {/* the footer of the modal */}
                <div className="myModal__footer">

                    {/* the add button */}
                    <button className="primary-button">Add</button>

                </div>

            </div>

            {/* note modal */ }
            <div
                className={ `${"myModal"} ${modalShowing === "note" ? "myModal--visible" : "myModal--hidden"}` }
                // when the modal is clicked, don't make the dim layer onClick get triggered
                onClick={ (e) => e.stopPropagation() }
            >
                {/* the title of the modal */ }
                <div className="myModal__title">ADD A NOTE</div>

                {/* the body of the modal */ }
                <div className="myModal__body">

                    {/* the title of the note */}
                    <form method="post" className="myModal__body__form">

                        <input type="text" placeholder="Note name..." />

                        {/* the folder where the note has to be inserted. It's not a required field */}
                        <select name="" id="">

                            <option value="">react</option>
                            <option value="">JS</option>

                            {/* the notes, create a noteOptions component to show the options here */ }

                        </select>

                    </form>
                </div>

                {/* the footer of the modal */ }
                <div className="myModal__footer">

                    {/* the add button */ }
                    <button className="primary-button">Add</button>

                </div>

            </div>


        </div>


    );
};

export default Modals;