<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}
$currentMonth = date('m');
$currentYear = date('Y');

$sql = "SELECT 
            p.payment_id,
            p.Date_paid,
            p.Amount_paid,
            t.first_name,
            t.last_name
        FROM 
            payment AS p
        INNER JOIN 
            tenants AS t ON p.tenant_id = t.tenant_id
        WHERE 
            MONTH(p.Date_paid) = ? AND YEAR(p.Date_paid) = ? AND p.is_archived = 0";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $currentMonth, $currentYear);
$stmt->execute();
$result = $stmt->get_result();

// Fetch all rows from the result set
$rows = $result->fetch_all(MYSQLI_ASSOC);

// Encode the rows as JSON and return
echo json_encode($rows);

$stmt->close();
$conn->close();
?>
