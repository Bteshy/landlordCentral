<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $eData = file_get_contents("php://input");
    $dData = json_decode($eData, true);
    error_log(print_r($dData, true));
    // Retrieve data from the

    $tenantid =$dData['tenantid'];
    $firstname = $dData['firstname'];
    $lastname = $dData['lastname'];
    $contact = $dData['contact'];
    $email = $dData['email'];
    $unitid = $dData['unitid'];
    $occupationdate = $dData['occupationdate']; 
    $userid = $dData['user_id'];

    $result = "";
    $checkUnitQuery = "SELECT * FROM unit WHERE Unit_id = ?";
    $stmt = $conn->prepare($checkUnitQuery);
    $stmt->bind_param("s", $unitid); 
    $stmt->execute();
    $unitResult = $stmt->get_result();

    $checkUserQuery = "SELECT * FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($checkUserQuery);
    $stmt->bind_param("i", $userid); 
    $stmt->execute();
    $userResult = $stmt->get_result();

    if ($unitResult->num_rows === 0) {
        $result = "Unit ID does not exist";
    } elseif ($userResult->num_rows === 0) {
        $result = "User ID does not exist";
    } else {

    if($tenantid != "" && $firstname != "" && $lastname != ""  && $contact != "" && $email!= "" && $unitid != "" && $occupationdate!= "" &&$userid != ""){
    $sql = "INSERT INTO tenants (tenant_id,first_name, last_name, phone_number, email, Unit_id, occupation_date, user_id)
            VALUES ('$tenantid','$firstname','$lastname','$contact','$email','$unitid','$occupationdate','$userid')";
    $res = mysqli_query($conn, $sql);
    if ($res) {
        $result = "Tenant added successfully";
    } else {
        $result = "";
    }
} else {
    $result = "";
}
    }
    

$conn->close();
$response[] = array("result" => $result);
echo json_encode($response);}

elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['count']) && $_GET['count'] === 'true') {
        // Return the count of tenants
        $sql = "SELECT COUNT(*) AS tenantCount FROM tenants WHERE is_archived=0";
        $result = mysqli_query($conn, $sql);
        if ($result) {
            $row = mysqli_fetch_assoc($result);
            echo json_encode(['tenantCount' => $row['tenantCount']]);
        } else {
            echo json_encode(['error' => 'Failed to fetch the count of tenants']);
        }
    } else{
    // Handle GET requests for fetching buildings
    $sql = "SELECT tenant_id, first_name, last_name, phone_number, email, Unit_id, occupation_date FROM tenants WHERE is_archived = 0";
        $result = mysqli_query($conn, $sql);
    $result = mysqli_query($conn, $sql);

    $tenant= [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $tenant[] = $row;
        }
    }
    echo json_encode($tenant);
}
    $conn->close();
}


?>






