import NoteList from "./NoteList";

import $ from "jquery";
import { URL } from "./utils";

const Menu = ({ menuStatus, setMenuStatus, currentNote, setCurrentNote, setModalShowing, noteTitle, setNoteTitle, setIsLoggedIn }) => {

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
                    setIsLoggedIn(false);

                }



            },
            error: (err) => {
                // console.log(err);

            }
        });
    }

    const collapseFolders = ()=>{

         const accordionCollapseDivs = document.querySelectorAll(".show");
         const accordionButtons = document.querySelectorAll("button.accordion-button");
        console.log(accordionCollapseDivs);
        console.log(accordionButtons);
         const n = accordionCollapseDivs.length;
         if (n > 0) {
            
             for (let i = 0; i < n; i++) {
                
                 accordionCollapseDivs[i].classList.remove("show");
                 accordionButtons[i].classList.add("collapsed");

                
             }
            
         }
        


     }

    const expandFolders = () => {

        const accordionCollapseDivs = document.querySelectorAll(".collapse:not(.show)");
        const accordionButtons = document.querySelectorAll("button.accordion-button.collapsed");
        console.log(accordionCollapseDivs);
        console.log(accordionButtons);
        const n = accordionButtons.length;
        if (n > 0) {

        for (let i = 0; i < n; i++) {

            accordionCollapseDivs[i].classList.add("show");
            accordionButtons[i].classList.remove("collapsed");
        }
        }

    }

    return (
        
        <div className={ `${"menu"} ${menuStatus === "expanded" ? "menu--expanded" : menuStatus === "hidden" && "menu--hidden"}` }>
           
            


                {/*//? if the menu is in the normal state, show the expand button */}
                { menuStatus === "normal" && 
                (
                    
                    <div className="menu__functionalities">
                    <div className="subheader subheader--normal">

                <button className="text-button" onClick={ () => setMenuStatus("expanded") }>expand</button> 
                <button className="arrow left" onClick={ () => setMenuStatus("hidden") }></button> 
                </div>
                </div>

                )}

                {/*//? if the menu isn't hidden and show a left arrow, otherwise a right arrow */}
                { menuStatus === "hidden" &&(
                <div className="menu__functionalities">
                    <div className="subheader--small" onClick={ () => setMenuStatus("normal") }>

                    <button className="arrow right"></button>
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
                                        <button className="primary-button" onClick={ () => setModalShowing("folder") }>Add a folder +</button>
                                        <button className="primary-button" onClick={ () => setModalShowing("note") }>Add a note +</button>
                            <div className="vert-line"></div>

                            <button className="secondary-button" onClick={ () => expandFolders() }>Expand All</button>
                            <button className="secondary-button" onClick={ () => collapseFolders() }>Collapse All</button>


                        </div>
                        <button className="arrow left" onClick={ () => setMenuStatus("normal") }></button> 

                    </div>

                </div>

                )
                
                }

            {/* the noteList is always mounted, even if the menu is hidden, so that open folders stay open even if the menu is closed and then reopened */}
            <NoteList noteTitle={noteTitle} setNoteTitle={setNoteTitle} currentNote={ currentNote } setCurrentNote={ setCurrentNote } menuStatus={ menuStatus } setMenuStatus={ setMenuStatus } setModalShowing={ setModalShowing } />

        </div>

    );
};

export default Menu;