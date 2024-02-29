<?php


if ($_GET["retrieve"] === "all") {

    //prepare the statement
    $stmt = $conn->prepare("SELECT * FROM folders");

    // execute the query
    $stmt->execute();

    // get the result
    $result = $stmt->get_result();

    // fetch the whole result into an associative array
    $folders = $result->fetch_all(MYSQLI_ASSOC);


    for ($i = 0; $i < count($folders); $i++) {

        //prepare the statement
        $stmt = $conn->prepare("SELECT * FROM notes WHERE folderID=?");

        // bind the parameters
        $stmt->bind_param("i", $folders[$i]["folderID"]);

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


} elseif ($_GET["retrieve"] === "single") {

    //prepare the statement
    $stmt = $conn->prepare("SELECT * FROM notes WHERE noteID =?");

    $stmt->bind_param("i", $_GET["note"]);

    // execute the query
    $stmt->execute();

    // bind the parameters
    $result = $stmt->get_result();

    // fetch the single row as an associative array
    $note = $result->fetch_assoc();

    // echo the encoded note
    echo json_encode($note);


}
