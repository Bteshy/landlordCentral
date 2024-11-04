<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $payment_id = $_GET['id'] ?? '';

    if ($payment_id) {
        $stmt = $conn->prepare("UPDATE payment SET is_archived = TRUE WHERE payment_id = ?");
        $stmt->bind_param("i", $payment_id);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Payment deleted successfully'];
        } else {
            $response = ['status' => 0, 'message' => 'Error deleting payment'];
        }
        $stmt->close();
    } else {
        $response = ['status' => 0, 'message' => 'Payment ID is required'];
    }
    echo json_encode($response);
    exit(); // Make sure to exit here so the script does not continue executing below code when deleting
}elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Handle PUT requests for updating payments
    $putData = json_decode(file_get_contents("php://input"), true);

    $paymentId = $putData['payment_id'] ?? null;
    $amountPaid = $putData['Amount_paid'] ?? null;
    $datePaid = $putData['Date_paid'] ?? null;
    $rentOf = $putData['rent_of'] ?? null; // Include rent_of field

    if ($paymentId && $amountPaid && $datePaid && $rentOf) {
        $sql = "UPDATE payment SET Amount_paid = ?, Date_paid = ?, rent_of = ? WHERE payment_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $amountPaid, $datePaid, $rentOf, $paymentId); // Assuming payment_id is an integer

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

// Adjusted SQL query to include the total amount paid for the selected month
$sql = "SELECT 
    p.payment_id,
    p.Date_paid,
    p.Amount_paid,
    t.first_name,
    t.last_name,
    t.email,
    t.phone_number,
    t.Unit_id,
    p.rent_of,
    (u.Rent_amount - 
        SUM(p.Amount_paid) OVER (PARTITION BY t.tenant_id, p.rent_of ORDER BY p.Date_paid ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
    ) AS Outstanding_balance
FROM 
    payment AS p
INNER JOIN 
    tenants AS t ON p.tenant_id = t.tenant_id
INNER JOIN 
    unit AS u ON t.Unit_id = u.Unit_id
    WHERE 
    p.is_archived=0";

$result = $conn->query($sql);

$processedRows = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $processedRows[] = $row;
    }
}

// Encode the processed rows as JSON and send it back to the client
echo json_encode($processedRows);

$conn->close();
?>
