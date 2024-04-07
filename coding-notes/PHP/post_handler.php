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

} else if (isset($arr["title"], $arr["folderID"])) /* if a note is being added */ {

    //prepare the statement
    $stmt = $conn->prepare("INSERT INTO notes (title, folderID) VALUES (?,?)");

    // bind the parameters
    $stmt->bind_param("si", $arr["title"], $arr["folderID"]);

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

        $stmt = $conn->prepare("INSERT INTO users(username,password) VALUES(?,?)");
        $stmt->bind_param("ss", $arr["username"], $passwordHash);
        $stmt->execute();

        $stmt = $conn->prepare("SELECT userID FROM users WHERE username=?");
        $stmt->bind_param("s", $arr["username"]);
        $stmt->execute();
        $userID = $stmt->get_result()->fetch_assoc()["userID"];

        

        //prepare the statement
        $stmt = $conn->prepare("INSERT INTO folders (folderName, color, userID) VALUES ('General','black',?)");

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
    
}else if (isset($arr["code"])) {

    $code = $arr['code'];
    $client_id = '225902902685-nfk9t53m1894vf4rmi4jj3fpp3o913cp.apps.googleusercontent.com';
    $client_secret = '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';
    $redirect_uri = 'http://localhost:3000';
    $grant_type = 'authorization_code';

    // Build request body data
    $data = http_build_query(
        array(
            'code' => $code,
            'client_id' => $client_id,
            'client_secret' => $client_secret,
            'redirect_uri' => $redirect_uri,
            'grant_type' => $grant_type
        )
    );
    // echo json_encode($data);
    // Set headers
    $headers = array(
        'Content-Type: application/x-www-form-urlencoded',
    );

    // Initialize cURL session
    $ch = curl_init();

    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, 'https://oauth2.googleapis.com/token');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Execute cURL request
    $response = curl_exec($ch);

    // Check for cURL errors
    if (curl_errno($ch)) {
        // Handle cURL errors
        $error_message = curl_error($ch);
        echo json_encode(['error' => 'cURL Error: ' . $error_message]);
    }

    // Close cURL session
    curl_close($ch);


    // decode response
    $responseDecoded =  json_decode($response);


    // Google OAuth 2.0 tokeninfo endpoint URL
    $tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($responseDecoded->id_token);

    // Make a GET request to the tokeninfo endpoint
    $response = file_get_contents($tokenInfoUrl);

    // Check if request was successful
    if ($response === FALSE) {
        // Handle error
        return $response;
    }

    // Decode the JSON response
    $tokenInfo = json_decode($response);

    $stmt = $conn->prepare("SELECT userID FROM users WHERE sub=?");
    $stmt->bind_param("s", $tokenInfo->sub);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result) {

        $stmt = $conn->prepare("INSERT INTO users (sub) VALUES (?)");
        $stmt->bind_param("s", $tokenInfo->sub);
        $stmt->execute();

        $stmt = $conn->prepare("SELECT userID FROM users WHERE sub=?");
        $stmt->bind_param("s", $tokenInfo->sub);
        $stmt->execute();
        $userID = $stmt->get_result()->fetch_assoc()["userID"];

        //prepare the statement
        $stmt = $conn->prepare("INSERT INTO folders (folderName, color, userID) VALUES ('General','black',?)");

        // bind the parameters
        $stmt->bind_param("i", $userID);

        // execute the query
        $stmt->execute();

    }else{

        $userID = $result["userID"];

    }
    



    $_SESSION["userID"] = $userID;

    echo json_encode(array("message" => "Access granted!", "code" => 200));

}
