<?php

require_once "db_connection.php"; 
    $noteID = $_GET["note"];
    
    $note = $conn->query("SELECT * FROM notes WHERE noteID = '$noteID'")->fetch_assoc();

    header('Content-Type: application/json');

    echo json_encode($note);
?>