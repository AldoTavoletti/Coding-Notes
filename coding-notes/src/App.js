/*
a website that gives the user the possibility to save coding notes. 
It should give the opportunity to write code in it. All the notes have to be saved in a DB created with XAMPP 
and connected to a PHP script. The react framework is used.
*/

import Header from "./Header";
import Menu from "./Menu";
import NoteDisplay from "./NoteDisplay";

function App() {

  return (
    <div className="App">

      <Header />

      <div className="content">
        <Menu />
        <NoteDisplay />
      </div>
    </div>
  );
}

export default App;
