<?php
 
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");
 
    $conn = new mysqli("localhost", "root", "", "project");
    if(mysqli_connect_error()){
        echo mysqli_connect_error();
        exit();
    }

    $sql = "SELECT 
   Unit_id, 
    Unit_type, 
    Rent_amount, 
    description, 
    Building_id
FROM unit
WHERE Unit_id NOT IN (
         SELECT Unit_id 
         FROM tenants 
         WHERE is_archived = 0)";

$result = mysqli_query($conn, $sql);

if ($result) {
$vacantUnits = [];
while ($row = mysqli_fetch_assoc($result)) {
    $vacantUnits[] = $row;
}
echo json_encode($vacantUnits);
} else {
echo json_encode(['error' => 'Failed to fetch vacant units']);
}


    ?>