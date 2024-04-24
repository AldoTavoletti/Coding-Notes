<?php
session_start();

function get_all_folders_and_notes($conn){

    $folderID = null;

    // get the user's folders
    $stmt = $conn->prepare("SELECT * FROM folders WHERE userID=?");
    $stmt->bind_param("i", $_SESSION["userID"]);
    $stmt->execute();

    // get the result
    $result = $stmt->get_result();

    // fetch the whole result into an associative array
    $folders = $result->fetch_all(MYSQLI_ASSOC);

    // get all the notes of the user's folders. The statement is prepared only once.
    $stmt = $conn->prepare("SELECT * FROM notes WHERE folderID=?");

    // $folderID doesn't have a value now, but it gets assigned a value in the for loop. When the statement gets executed, the compiler looks for the binded parameters and uses the current value it is assigned to.
    $stmt->bind_param("i", $folderID);

    for ($i = 0; $i < count($folders); $i++) {

        // assign the current folder's ID to $folderID
        $folderID = $folders[$i]["folderID"];

        $stmt->execute();
        $result = $stmt->get_result();

        // fetch the whole result into an associative array
        $notes = $result->fetch_all(MYSQLI_ASSOC);

        // insert the notes associative array in a field related to the parent folder
        $folders[$i]["notes"] = $notes;

    }

    return $folders;

}

function get_single_note($conn){

    // get the requested note
    $stmt = $conn->prepare("SELECT * FROM notes WHERE noteID =?");

    $stmt->bind_param("i", $_GET["note"]);

    $stmt->execute();
    $result = $stmt->get_result();

    // fetch the single row as an associative array
    $note = $result->fetch_assoc();

    return $note;

}

function check_logged_in(){

    if (isset($_SESSION["userID"])) /* if the session variable is set, it means the user is still logged in */ {

        echo json_encode(array("message" => "The user is logged in!", "code" => 200, "userID" => $_SESSION["userID"]));

    } else {

        die(json_encode(array("message" => "The user is not logged in!", "code" => 403)));

    }

}

function logout(){

    // destroy the userID session variable
    unset($_SESSION["userID"]);

    echo json_encode(array("message" => "The user has logged out!", "code" => 200));

}


if (isset($_GET["retrieve"]) && $_GET["retrieve"] === "all") {

    $folders_and_notes = get_all_folders_and_notes($conn);

    echo json_encode($folders_and_notes);


} elseif (isset($_GET["retrieve"]) && $_GET["retrieve"] === "single") {

    $note = get_single_note($conn);

    echo json_encode($note);


} else if (isset($_GET["check"]) && $_GET["check"] === "login") {

    check_logged_in();

} else if (isset($_GET["logout"]) && $_GET["logout"] === "true") {

    logout();

}
