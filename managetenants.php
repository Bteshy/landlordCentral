<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $tenant_id = $_GET['id'] ?? '';

    if ($tenant_id) {
        $stmt = $conn->prepare("UPDATE tenants SET is_archived = TRUE WHERE tenant_id = ?");
        $stmt->bind_param("i", $tenant_id);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Tenant archived successfully'];
        } else {
            $response = ['status' => 0, 'message' => 'Error archiving tenant'];
        }
        $stmt->close();
    } else {
        $response = ['status' => 0, 'message' => 'Tenant ID is required'];
    }
    echo json_encode($response);
    // Make sure to exit here so the script does not continue executing below code when archiving
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') { // Changed from else to elseif
    // Handle PUT requests for updating tenants
    $putData = json_decode(file_get_contents("php://input"), true);

    $tenantid = $putData['tenantid'] ?? null;
    $firstname = $putData['firstname'] ?? null;
    $lastname = $putData['lastname'] ?? null;
    $contact = $putData['contact'] ?? null;
    $email = $putData['email'] ?? null;
    $unitid = $putData['unitid'] ?? null;
    $occupationdate = $putData['occupationdate'] ?? null;

    if ($tenantid && $firstname && $lastname && $contact && $email && $unitid && $occupationdate) {
        $sql = "UPDATE tenants SET first_name = ?, last_name = ?, phone_number = ?, email = ?, Unit_id = ?, occupation_date = ? WHERE tenant_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssss", $firstname, $lastname, $contact, $email, $unitid, $occupationdate, $tenantid); // Assuming tenant_id is an integer

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Payment updated successfully', 'updatedPayment' => [
                'payment_id' => $paymentId,
                'Amount_paid' => $amountPaid,
                'Date_paid' => $datePaid,
                'rent_of' => $rentOf
            ]];
        } else {
            $response = ['status' => 0, 'message' => 'Error updating payment'];
        }

        $stmt->close();
    } else {
        $response = ['status' => 0, 'message' => 'All fields are required for update'];
    }

    echo json_encode($response);
}

?>
