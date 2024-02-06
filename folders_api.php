<?php

require_once "db_connection.php";

// SQL query to retrieve data
$sql = "SELECT * FROM folders";  // Replace with your actual table name

$result = $conn->query($sql);

$folders = array();  // Initialize an array to store the data

if ($result->num_rows > 0) {
    // Fetch data and store in the array
    while ($row = $result->fetch_assoc()) {
        $folders[] = $row;
    }
}

for ($i=0; $i < count($folders); $i++) { 
    
    $sql = "SELECT * FROM notes WHERE folderID = ". $folders[$i]["folderID"];  // Replace with your actual table name
    
    $result = $conn->query($sql);
    
    $notes = array();  // Initialize an array to store the data
    
    if ($result->num_rows > 0) {
        // Fetch data and store in the array
        while ($row = $result->fetch_assoc()) {
            $notes[] = $row;
        }
    }
    
    
    $folders[$i]["notes"] = $notes;
    
}

// Close connection
// $conn->close();

// Convert the array to JSON and return
header('Content-Type: application/json');
echo json_encode($folders);

?>