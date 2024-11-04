<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}

// Handle GET request to retrieve maintenance requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM maintenance WHERE is_fixed = 0";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        $maintenanceRequests = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $maintenanceRequests[] = $row;
        }
        echo json_encode($maintenanceRequests);
    } else {
        echo "No maintenance requests found";
    }
}

// Handle DELETE request to mark maintenance request as fixed
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $maintenance_id = $_GET['id'] ?? '';

    if ($maintenance_id) {
        $stmt = $conn->prepare("UPDATE maintenance SET is_fixed = TRUE WHERE maintenance_id = ?");
        $stmt->bind_param("i", $maintenance_id);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Maintenance request marked as fixed successfully'];
        } else {
            $response = ['status' => 0, 'message' => 'Error marking maintenance request as fixed'];
        }
        $stmt->close();
    } else {
        $response = ['status' => 0, 'message' => 'Maintenance ID is required'];
    }
    echo json_encode($response);
}

mysqli_close($conn);
?>
