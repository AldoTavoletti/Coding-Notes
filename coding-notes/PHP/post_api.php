<?php

require_once "db_connection.php";   

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["color"],$_POST["name"])) {
        
    $folderName = str_replace("'","''",$_POST["name"]);
    $folderColor = str_replace("'","''",$_POST["color"]);
    
    mysqli_query($conn,"INSERT INTO folders VALUES (NULL,'$folderName','$folderColor')");

}else if(isset($_POST["title"],$_POST["folder"])){
    
    $folderName = str_replace("'","''",$_POST["folder"]);
    $folderID = $conn->query("SELECT folderID FROM folders WHERE folderName = '$folderName' LIMIT 1")->fetch_assoc()["folderID"];
    
    $title =str_replace("'","''",$_POST["title"]);
    
    mysqli_query($conn,"INSERT INTO notes VALUES (NULL,'$title',NULL,'$folderID')");

}
}

?>