<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}

// Get the current month and year
$year = date('Y');
$month = date('m');

// SQL query to count payments of the current month
$sql = "SELECT COUNT(*) AS paymentCount FROM payment WHERE YEAR(Date_paid) = ? AND MONTH(Date_paid) = ? AND is_archived=0";

// Prepare and bind parameters
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $year, $month);

// Execute the query
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

// Close connections
$stmt->close();
$conn->close();

// Return the result
echo json_encode($row);
?>
