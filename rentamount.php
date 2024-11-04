<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}

$tenantId = $_GET['tenantId'];

$sql = "SELECT u.Rent_amount 
        FROM tenants AS t
        INNER JOIN unit AS u ON u.Unit_id = t.Unit_id
        WHERE tenant_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $tenantId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $rentAmount = $row["Rent_amount"];
    echo json_encode(array("Rent_amount" => $rentAmount));
} else {
    echo json_encode(array("error" => "No rent amount found for the given tenant name"));
}

$stmt->close();
$conn->close();
?>
