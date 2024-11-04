<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

// Better to use environment variables or a configuration file for database credentials
$conn = new mysqli("localhost", "specific_user", "user_password", "project");

if (mysqli_connect_error()) {
    echo json_encode(["message" => "Database connection failed: " . mysqli_connect_error()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $eData = file_get_contents("php://input");
    $dData = json_decode($eData, true);

    $tenantId = $dData['tenant_id'];
    $amountPaid = $dData['Amount_paid'];
    $datePaid = $dData['Date_paid'];
    $rentOf = $dData['rent_of']; // Ensure this matches the front-end and is properly formatted for your database

    $insertPaymentQuery = "INSERT INTO payment (Amount_paid, tenant_id, Date_paid, rent_of) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($insertPaymentQuery);
    // Adjust parameter types according to your actual data types in the database
    // For example, using 's' for strings, 'i' for integers, and 'd' for doubles
    $stmt->bind_param("diss", $amountPaid, $tenantId, $datePaid, $rentOf); // Corrected to include $rentOf

    if ($stmt->execute()) {
        $result = "Payment processed successfully";
    } else {
        $result = "Failed to process payment: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
    echo json_encode(["message" => $result]);
}
?>
