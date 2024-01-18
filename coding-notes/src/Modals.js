import { switchState } from "./utils";

const Modals = ({ modalShowing, setModalShowing }) => {
    return (

        // dim layer
        <div
            className={ `${"dim-layer"} ${modalShowing !== "none" ? "dim-layer--visible" : "dim-layer--hidden"}` }
            onClick={ () => switchState(modalShowing, setModalShowing, "none") }
        >

            {/* folder modal */ }
            <div
                className={ `${"myModal"} ${modalShowing === "folder" ? "myModal--visible" : "myModal--hidden"}` }
                onClick={ (e) => e.stopPropagation() }
            >

                <div className="myModal__title">ADD A FOLDER</div>
                <div className="myModal__body">
                    <form method="post" className="myModal__body__form">

                        <input type="text" placeholder="Folder name..." />


                    </form>

                    <div className="flex-container">
                        <div className="color-box color-box--green"></div>
                        <div className="color-box color-box--orange"></div>
                        <div className="color-box color-box--red"></div>
                        <div className="color-box color-box--blue"></div>
                        <div className="color-box color-box--yellow"></div>
                    </div>

                </div>
                <div className="myModal__footer">

                    <button className="primary-button">Add</button>

                </div>

            </div>

            {/* note modal */ }

            <div
                className={ `${"myModal"} ${modalShowing === "note" ? "myModal--visible" : "myModal--hidden"}` }
                onClick={ (e) => e.stopPropagation() }
            >

                <div className="myModal__title">ADD A NOTE</div>
                <div className="myModal__body">
                    <form method="post" className="myModal__body__form">

                        <input type="text" placeholder="Note name..." />
                        <select name="" id="">
                            <option value="">react</option>
                            <option value="">JS</option>

                            {/* the notes, create a noteOptions component to show the options here */ }

                        </select>


                    </form>

                </div>
                <div className="myModal__footer">

                    <button className="primary-button">Add</button>

                </div>

            </div>


        </div>


    );
};

export default Modals;