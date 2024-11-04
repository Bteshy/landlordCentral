<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle POST requests for inserting new units
    $eData = file_get_contents("php://input");
    $dData = json_decode($eData, true);

    $unitid = $dData['unitid'];
    $unittype = $dData['unittype'];
    $rentamount = $dData['rentamount'];
    $description = $dData['description'];
    $buildingid = $dData['buildingid'];

    $result = "";

    $checkBuildingQuery = "SELECT * FROM building WHERE Building_id = ?";
    $stmt = $conn->prepare($checkBuildingQuery);
    $stmt->bind_param("s", $buildingid);
    $stmt->execute();
    $buildingResult = $stmt->get_result();
 
    if ($buildingResult->num_rows === 0) {
        $result = "Building ID does not exist";
    } else {

    if ($unitid != "" && $unittype != "" && $rentamount != "" && $description != "") {
        $sql = "INSERT INTO unit(Unit_id, Unit_type, Rent_amount, description, Building_id) VALUES('$unitid', '$unittype', '$rentamount', '$description','$buildingid')";
        $res = mysqli_query($conn, $sql);
        if ($res) {
            $result = "Added successfully";
        } else {
            $result = "Failed to add unit";
        }
    } else {
        $result = "All fields are required";
    }
}

    $conn->close();
    $response[] = array("result" => $result);
    echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
 
    if (isset($_GET['count']) && $_GET['count'] == 'true') {
        // Return the count of units
        $sql = "SELECT COUNT(*) AS unitCount FROM unit";
        $result = mysqli_query($conn, $sql);
        if ($result) {
            $row = mysqli_fetch_assoc($result);
            $count = $row['unitCount'];
            echo json_encode(['unitCount' => $count]);
        } else {
            echo json_encode(['error' => 'Failed to fetch the count of units']);
        }
    } 
   
    
 elseif (isset($_GET['vacantCount']) && $_GET['vacantCount'] == 'true') {
     // Query to count vacant units
     $sql = "SELECT COUNT(*) AS vacantCount 
     FROM unit 
     WHERE Unit_id NOT IN (
         SELECT Unit_id 
         FROM tenants 
         WHERE is_archived = 0
     )
     ";
     $result = mysqli_query($conn, $sql);
 
     if ($result) {
         $row = mysqli_fetch_assoc($result);
         $count = $row['vacantCount'];
         
         echo json_encode(['vacantCount' => $count]);
     } else {
         echo json_encode(['error' => 'Failed to fetch vacant unit count']);
     }
 }

 else {
     // Handle GET requests for fetching units
     $sql = "SELECT Unit_id, Unit_type, Rent_amount, description, Building_id FROM unit";
     
     $result = mysqli_query($conn, $sql);
 
     $units = [];
     if ($result) {
         while ($row = mysqli_fetch_assoc($result)) {
             $units[] = $row;
         }
         echo json_encode($units);
     }
 }
 

    $conn->close();
    

    
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Handle DELETE requests for deleting units
    parse_str(file_get_contents("php://input"), $_DELETE);
    $unitid = $_GET['id'] ?? '';

    if ($unitid) {
        $stmt = $conn->prepare("DELETE FROM unit WHERE Unit_id = ?");
        $stmt->bind_param("s", $unitid);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Unit deleted successfully'];
        } else {
            $response = ['status' => 0, 'message' => 'Error deleting unit'];
        }
        $stmt->close();
    } else {
        $response = ['status' => 0, 'message' => 'Unit ID is required'];
    }
    echo json_encode($response);

    
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Handle PUT requests for updating units
    $putData = json_decode(file_get_contents("php://input"), true);

    $unitid = $putData['unitid'] ?? null;
    $unittype = $putData['unittype'] ?? null;
    $rentamount = $putData['rentamount'] ?? null;
    $description = $putData['description'] ?? null;
    $buildingid = $putData['buildingid'] ?? null;

    if ($unitid && $unittype && $rentamount && $description && $buildingid) {
        $sql = "UPDATE unit SET Unit_type = ?, Rent_amount = ?, description = ?, Building_id = ? WHERE Unit_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssis", $unittype, $rentamount, $description, $buildingid, $unitid); // Assuming Unit_id is an integer

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Unit updated successfully', 'updatedUnit' => [
                'Unit_id' => $unitid,
                'Unit_type' => $unittype,
                'Rent_amount' => $rentamount,
                'description' => $description,
                'Building_id' => $buildingid
            ]];
        } else {
            $response = ['status' => 0, 'message' => 'Error updating unit'];
        }
        
        $stmt->close();
    } else {
        $response = ['status' => 0, 'message' => 'All fields are required for update'];
    }
    echo json_encode($response);
}

?>
