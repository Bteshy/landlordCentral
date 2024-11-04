<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}

$selectedRentOf = $_GET['rent_of'] ?? ''; // Get the selected rent of value from the request, adjust as needed

// Adjusted SQL query to calculate total amount paid and latest outstanding balance
$sql = "SELECT 
p.rent_of,
t.first_name,
t.last_name,
COALESCE(SUM(p.Amount_paid), 0) AS total_amount_paid,
u.Unit_id,
MAX(p.Date_paid) AS latest_payment_date,
CASE 
    WHEN (u.Rent_amount - COALESCE(SUM(p.Amount_paid), 0)) <= 0 THEN 'cleared'
    ELSE (u.Rent_amount - COALESCE(SUM(p.Amount_paid), 0))
END AS latest_outstanding_balance
FROM 
tenants AS t
INNER JOIN 
unit AS u ON t.Unit_id = u.Unit_id
INNER JOIN 
building AS b ON u.Building_id = b.Building_id
LEFT JOIN 
payment AS p ON p.tenant_id = t.tenant_id
            AND p.rent_of = ?
            AND p.Date_paid >= '2024-01-01' -- Start date for January
            AND p.Date_paid <= LAST_DAY(NOW()) -- End date for March
            AND p.is_archived = 0
GROUP BY 
t.tenant_id";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $selectedRentOf); // "s" for string parameter
$stmt->execute();
$result = $stmt->get_result();

// Fetch all rows from the result set
$rows = $result->fetch_all(MYSQLI_ASSOC);

// Encode the rows as JSON and return
echo json_encode($rows);

$stmt->close();
$conn->close();
?>
