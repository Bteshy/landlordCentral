<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
} else {
    $eData = file_get_contents("php://input");
    $dData = json_decode($eData, true);

    $firstname = $dData['firstname'];
    $lastname = $dData['lastname'];
    $email = $dData['email'];
    $contact = $dData['contact'];
    $password = $dData['password'];

    $result = "";
    $user_id = null;

    if ($firstname != "" && $email != "" && $contact != "" && $password != "" && $lastname != "") {
        $sql = "INSERT INTO users(first_name, password, email, contact, last_name) VALUES ('$firstname', '$password', '$email','$contact', '$lastname')";
        $res = mysqli_query($conn, $sql);
        if ($res) {
            // Get the auto-generated user_id
            $user_id = mysqli_insert_id($conn);
            $result = "You have registered successfully!";
            // error_log("User ID: " . $user_id);
        } else {
            $result = "Failed to register. Please try again.";
        }
    } else {
        $result = "";
    }

    $conn->close();
    $response = array(
        "result" => $result,
        "user_id" => $user_id
    );
   // Include user_id in the response
    echo json_encode($response);
}
?>
