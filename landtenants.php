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
    $eData = file_get_contents("php://input");
    $dData = json_decode($eData, true);

    // Retrieve data from the request
    $tenantid =$dData['tenantid'];
    $firstname = $dData['firstname'];
    $lastname = $dData['lastname'];
    $phonenumber = $dData['phonenumber'];
    $email = $dData['email'];
    $unitid = $dData['unitid'];
    $occupationdate = $dData['occupationdate']; 
    

   

    if($tenantid != "" && $firstname != "" && $lastname != ""  && $phonenumber != "" && $email!= "" && $unitid != "" && $occupationdate!= "" ){
    $sql = "INSERT INTO tenants (tenant_id,first_name, last_name, phone_number, email, Unit_id, occupation_date, user_id)
            VALUES ('$tenantid','$firstname','$lastname','$phonenumber','$email','$unitid','$occupationdate','$userid')";
    $res = mysqli_query($conn, $sql);
    if ($res) {
        $result = "Added successfully";
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

?>
