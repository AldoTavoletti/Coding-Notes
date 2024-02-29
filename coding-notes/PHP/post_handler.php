<?php

//get the json data sent (we have to retrieve it this way since it's sent with ajax and not with a regular form)
$json_data = file_get_contents("php://input");

// decode the json data into an associative array
$arr = json_decode($json_data, true);


if (isset($arr["color"], $arr["name"])) /* if a folder is being added */ {

    //prepare the statement
    $stmt = $conn->prepare("INSERT INTO folders (folderName, color) VALUES (?,?)");

    // bind the parameters
    $stmt->bind_param("ss", $arr["name"], $arr["color"]);

    // execute the query
    $stmt->execute();

} else if (isset($arr["title"], $arr["folder"])) /* if a note is being added */ {

    // get the folderName to get the folderID
    $folderName = $arr["folder"];

    // get the folderID. I don't use a prepared statement because I don't think I need it (I'll see if this has to be changed).
    $folderID = $conn->query("SELECT folderID FROM folders WHERE folderName = '$folderName' LIMIT 1")->fetch_assoc()["folderID"];

    // get the title
    $title =  $arr["title"];

    //prepare the statement
    $stmt = $conn->prepare("INSERT INTO notes (title, folderID) VALUES (?,?)");

    // bind the parameters
    $stmt->bind_param("si", $title, $folderID);

    // execute the query
    $stmt->execute();
}

