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

// Get user_id from the request body
$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id)) {
    $user_id = $data->user_id;
    error_log('Received user_id from frontend: ' . $user_id);

    // Query to check if the user already has a unit assigned
    $query = "SELECT Unit_id FROM tenants WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if ($result) {
        // User already has a unit assigned
        $unit_id = $result['Unit_id'];

        // Fetch tenant information based on the user ID
        $tenant_query = "SELECT tenant_id FROM tenants WHERE user_id = ?";
        $tenant_stmt = $conn->prepare($tenant_query);
        $tenant_stmt->bind_param("i", $user_id);
        $tenant_stmt->execute();
        $tenant_result = $tenant_stmt->get_result()->fetch_assoc();

        if ($tenant_result) {
            $tenant_id = $tenant_result['tenant_id'];
            
            // Tenant information fetched successfully
            echo json_encode(["hasUnit" => true, "unitid" => $unit_id, "tenant" => $tenant_result]);
        } else {
            // Unable to fetch tenant information
            echo json_encode(["error" => "Unable to fetch tenant information"]);
        }
        $tenant_stmt->close();
    } else {
        // User does not have a unit assigned
        echo json_encode(["hasUnit" => false]);
    }
} else {
    // Invalid request
    echo json_encode(["error" => "Invalid request"]);
}

// Close database connection
$stmt->close();
$conn->close();
?>
