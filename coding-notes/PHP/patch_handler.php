<?php
//get the json data sent (we have to retrieve it this way since it's sent with ajax and not with a regular form)
$json_data = file_get_contents("php://input");

// decode the json data into an associative array
$arr = json_decode($json_data, true);

if (isset($arr["content"])) /* if the content of the note has to be patched */ {

    //prepare the statement
    $stmt = $conn->prepare("UPDATE notes SET content=? WHERE noteID=?");

    // bind the parameters
    $stmt->bind_param("si", $arr["content"], $arr["noteID"]);

    // execute the query
    $stmt->execute();

    echo json_encode(array("message" => "Content updated!", "code" => 200));


} elseif (isset($arr["title"])) /* if the title of the note has to be patched */ {

    //prepare the statement
    $stmt = $conn->prepare("UPDATE notes SET title=? WHERE noteID=?");

    // bind the parameters
    $stmt->bind_param("si", $arr["title"], $arr["noteID"]);

    // execute the query
    $stmt->execute();

    echo json_encode(array("message" => "Title updated!", "code" => 200));


} else if (isset($arr["name"], $arr["color"], $arr["folderID"])) /* if a folder has to be patched */ {

    //prepare the statement
    $stmt = $conn->prepare("UPDATE folders SET folderName=?, color=? WHERE folderID=?");

    // bind the parameters
    $stmt->bind_param("ssi", $arr["name"], $arr["color"], $arr["folderID"]);

    // execute the query
    $stmt->execute();

    echo json_encode(array("message" => "Folder updated!", "code" => 200));

}
