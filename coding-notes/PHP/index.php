<?php

require_once "db_connection.php";

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":

        include "get_handler.php";
        break;

    case "POST":

        include "post_handler.php";
        break;

    case "PATCH":

        include "patch_handler.php";
        break;

    case "DELETE":

        include "delete_handler.php";
        break;
    
    default:
        # code...
        break;
}
