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
    // Handle POST requests for inserting new buildings
    $eData = file_get_contents("php://input");
    $dData = json_decode($eData, true);

    $buildingid = $dData['buildingid'];
    $buildingname = $dData['buildingname'];
    $location = $dData['location'];

    $result = "";

    if ($buildingid != "" and $buildingname != "" and $location != "") {
        $sql = "INSERT INTO building(Building_id, Building_name, Location) VALUES('$buildingid', '$buildingname', '$location');";
        $res = mysqli_query($conn, $sql);
        if ($res) {
            $result = "Added successfully";
        } else {
            $result = "";
        }
    } else {
        $result = "";
    }

    $conn->close();
    $response[] = array("result" => $result);
    echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET requests for fetching buildings
    $sql = "SELECT Building_id, Building_name, Location FROM building";
    $result = mysqli_query($conn, $sql);

    $buildings = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $buildings[] = $row;
        }
    }

    $conn->close();
    echo json_encode($buildings);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $Building_id = $_GET['id'] ?? ''; // Adjusted to use $_GET for simplicity

    if ($Building_id) {
        $stmt = $conn->prepare("DELETE FROM building WHERE Building_id = ?");
        $stmt->bind_param("s", $Building_id);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Building deleted successfully'];
        } else {
            $response = ['status' => 0, 'message' => 'Error deleting building'];
        }
        $stmt->close();
    } else {
        $response = ['status' => 0, 'message' => 'Building ID is required'];
    }
    echo json_encode($response);
}

elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $putData = json_decode(file_get_contents("php://input"), true);

    $buildingid = $putData['buildingid'] ?? null;
    $buildingname = $putData['buildingname'] ?? null;
    $location = $putData['location'] ?? null;

    if ($buildingid && $buildingname && $location) {
        $sql = "UPDATE building SET Building_name = ?, Location = ? WHERE Building_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $buildingname, $location, $buildingid);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Updated successfully', 'updatedBuilding' => [
                'Building_id' => $buildingid,
                'Building_name' => $buildingname,
                'Location' => $location
            ]];
        } else {
            $response = ['status' => 0, 'message' => 'Error updating building'];
        }
        
        $stmt->close();
    } else {
        $response = ['status' => 0, 'message' => 'All fields are required for update'];
    }
    echo json_encode($response);
}







?>
