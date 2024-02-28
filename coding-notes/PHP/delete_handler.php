<?php




if ($_SERVER["REQUEST_METHOD"] === "DELETE") {

    $data = file_get_contents('php://input');

    // Decode the JSON data
    parse_str($data, $_DELETE);

    if (isset($_DELETE["elementID"])) {
        $elementID = $_DELETE["elementID"];
        
        if ($_DELETE["elementType"] === "note") {
        
             mysqli_query($conn,"DELETE FROM notes WHERE noteID = '$elementID'");
        
        }else if ($_DELETE["elementType"] === "folder") {
             mysqli_query($conn,"DELETE FROM folders WHERE folderID = '$elementID'");
        }


    }
}