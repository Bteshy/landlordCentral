<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}

$user_id = $_GET['user_id'] ?? ''; 
error_log("Received user_id: " . $user_id);

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
    p.is_archived= 0
    AND
    t.user_id = ? ";

// Create a prepared statement
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id); // Assuming user_id is an integer, use "i" for integer parameter
$stmt->execute();

// Get the result set
$result = $stmt->get_result();

// Fetch all rows from the result set
$rows = $result->fetch_all(MYSQLI_ASSOC);

// Encode the rows as JSON and return
echo json_encode($rows);

// Close the statement and connection
$stmt->close();
$conn->close();
?>
