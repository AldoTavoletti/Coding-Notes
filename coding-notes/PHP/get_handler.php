<?php
session_start();

if (isset($_GET["retrieve"]) && $_GET["retrieve"] === "all") {
    //prepare the statement
    $stmt = $conn->prepare("SELECT * FROM folders WHERE userID=?");
    $stmt->bind_param("i", $_SESSION["userID"]);
    // execute the query
    $stmt->execute();

    // get the result
    $result = $stmt->get_result();

    // fetch the whole result into an associative array
    $folders = $result->fetch_all(MYSQLI_ASSOC);

    //prepare the statement
    $stmt = $conn->prepare("SELECT * FROM notes WHERE folderID=?");

    // bind the parameters
    $stmt->bind_param("i", $folderID);

    for ($i = 0; $i < count($folders); $i++) {

        $folderID = $folders[$i]["folderID"];
        
        // execute the query
        $stmt->execute();

        // get the result
        $result = $stmt->get_result();

        // fetch the whole result into an associative array
        $notes = $result->fetch_all(MYSQLI_ASSOC);

        // insert the notes associative array in a field related to the parent folder
        $folders[$i]["notes"] = $notes;

    }

    // echo the encoded folders (also containing the notes)  
    echo json_encode($folders);


} elseif (isset($_GET["retrieve"]) && $_GET["retrieve"] === "single") {

    //prepare the statement
    $stmt = $conn->prepare("SELECT * FROM notes WHERE noteID =?");

    // bind the parameters
    $stmt->bind_param("i", $_GET["note"]);

    // execute the query
    $stmt->execute();

    // get the result
    $result = $stmt->get_result();

    // fetch the single row as an associative array
    $note = $result->fetch_assoc();

    $_SESSION["sessionid"] = session_id();

    // echo the encoded note
    echo json_encode($note);


}else if (isset($_GET["check"]) && $_GET["check"] === "login") {

    if (isset($_SESSION["userID"])) {
    
        echo json_encode(array("message"=>"The user is logged in!", "code"=>200));
    
    }else{

        die(json_encode(array("message"=>"The user is not logged in!", "code"=>403)));

    }

}else if (isset($_GET["logout"]) && $_GET["logout"] === "true") {

unset($_SESSION["userID"]);

    echo json_encode(array("message" => "The user has logged out!", "code" => 200));

}

