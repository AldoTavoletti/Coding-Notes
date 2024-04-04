<?php
session_start();

//get the json data sent (we have to retrieve it this way since it's sent with ajax and not with a regular form, so $_POST[] doesn't work)
$json_data = file_get_contents("php://input");

// decode the json data into an associative array
$arr = json_decode($json_data, true);


if (isset($arr["color"], $arr["name"])) /* if a folder is being added */ {

    //prepare the statement
    $stmt = $conn->prepare("INSERT INTO folders (folderName, color, userID) VALUES (?,?,?)");

    // bind the parameters
    $stmt->bind_param("ssi", $arr["name"], $arr["color"],$_SESSION["userID"]);

    // execute the query
    $stmt->execute();

} else if (isset($arr["title"], $arr["folder"])) /* if a note is being added */ {

    // get the folderName to get the folderID
    $folderName = $arr["folder"];

    //prepare the statement
    $stmt = $conn->prepare("SELECT folderID FROM folders WHERE folderName =? AND userID=?");

    // bind the parameters
    $stmt->bind_param("si", $folderName, $_SESSION["userID"]);

    // execute the query
    $stmt->execute();

    $folderID = $stmt->get_result()->fetch_assoc()["folderID"];

    // get the title
    $title = $arr["title"];

    //prepare the statement
    $stmt = $conn->prepare("INSERT INTO notes (title, folderID) VALUES (?,?)");

    // bind the parameters
    $stmt->bind_param("si", $title, $folderID);

    // execute the query
    $stmt->execute();
} else if (isset($arr["username"], $arr["password"]) && $arr["action"] === "signup") {

    $stmt = $conn->prepare("SELECT username FROM users WHERE username=?");
    $stmt->bind_param("s", $arr["username"]);
    $stmt->execute();
    $result = $stmt->get_result();
    if (count($result->fetch_all(MYSQLI_ASSOC)) > 0) {

        die(json_encode(array('message' => 'This username is already in use', 'code' => 0)));

    }else{

        $passwordHash = password_hash($arr["password"], PASSWORD_DEFAULT); 

        $stmt = $conn->prepare("INSERT INTO users(userID,username,password) VALUES(NULL,?,?)");
        $stmt->bind_param("ss", $arr["username"], $passwordHash);
        $stmt->execute();

        $stmt = $conn->prepare("SELECT userID FROM users WHERE username=?");
        $stmt->bind_param("s", $arr["username"]);
        $stmt->execute();
        $userID = $stmt->get_result()->fetch_assoc()["userID"];

        

        //prepare the statement
        $stmt = $conn->prepare("INSERT INTO folders (folderName, color, userID) VALUES ('General','#383737',?)");

        // bind the parameters
        $stmt->bind_param("i", $userID);

        // execute the query
        $stmt->execute();


        $_SESSION["userID"] = $userID;
        echo json_encode(array("message" => "Signed up!", "userID" => $_SESSION["userID"],'$passwordHash'=>$passwordHash));


    }

} else if (isset($arr["username"], $arr["password"]) && $arr["action"] === "login") {

    $stmt = $conn->prepare("SELECT userID, password FROM users WHERE username=?");
    $stmt->bind_param("s", $arr["username"]);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    if ($result) {
        $userID =$result["userID"]; 

        
        if (password_verify($arr["password"], $result["password"])) {

            $_SESSION["userID"] = $userID;
            echo json_encode(array("message"=> "Access granted!","code"=>200));
            
        } else{

            die(json_encode(array('message' => 'Wrong password', 'code' => 401)));
            
            
        }
        
    } else {
        
        die(json_encode(array('message' => 'Not existing username', 'code' => 401)));
        
        
    }
    
}else if (isset($arr["googleID"])) {

$stmt = $conn->prepare("SELECT userID FROM users WHERE googleID=?");
$stmt->bind_param("s",$arr["googleID"]);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

 if (!$result) {

        $stmt = $conn->prepare("INSERT INTO users(googleID) VALUES(?)");
        $stmt->bind_param("s", $arr["googleID"]);
        $stmt->execute();

        $stmt = $conn->prepare("SELECT userID FROM users WHERE googleID=?");
        $stmt->bind_param("s", $arr["googleID"]);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();

        //prepare the statement
        $stmt = $conn->prepare("INSERT INTO folders (folderName, color, userID) VALUES ('General','#383737',?)");

        // bind the parameters
        $stmt->bind_param("i", $result["userID"]);

        // execute the query
        $stmt->execute();
    }

$_SESSION["userID"] = $result["userID"];

    echo json_encode(array("message" => "Access granted!", "code" => 200));

}
