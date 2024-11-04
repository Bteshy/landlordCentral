<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

// Establish database connection
$conn = new mysqli("localhost", "root", "", "project");

// Check for database connection errors
if ($conn->connect_error) {
    echo "Connection failed: " . $conn->connect_error;
    exit();
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Assuming you're sending the data as JSON
    $data = json_decode(file_get_contents("php://input"));

    $email = $data->email;
    $firstname = $data->firstname;
    $lastname = $data->lastname;
    $contact = $data->contact;

    // Validate the input
    if (!empty($email) && !empty($firstname) && !empty($lastname) && !empty($contact)) {
        // Update query
        $query = "UPDATE users SET first_name = ?, last_name = ?, contact = ? WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssss", $firstname, $lastname, $contact, $email);

        if ($stmt->execute()) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            echo json_encode(["message" => "User update failed"]);
        }
    } else {
        echo json_encode(["message" => "Invalid input"]);
    }
} else {
    // Handle incorrect request method
    header("HTTP/1.1 405 Method Not Allowed");
    exit;
}
?>