import { switchState } from "./utils";
const Header = ({modalShowing, setModalShowing}) => {

    

    return ( 

        <div className="header">

            <p>Coding Notes</p>
            <div className="header__buttons-div">
            <button className="primary-button" onClick={()=>switchState(modalShowing,setModalShowing,"folder")}>Add a folder +</button>
                <button className="primary-button" onClick={ () => switchState(modalShowing,setModalShowing,"note") }>Add a note +</button>
            </div>
        </div>

     );
}
 
export default Header;