
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,POST");
header("Access-Control-Allow-Headers: content-Type");


$conn = new mysqli("localhost","root","","project");

// $tenantid = $_POST['tenant_id'];

$PaystackCallbackResponse = file_get_contents('php://input');
$logFile = "mpesastkresponse.json";
$log = fopen($logFile, "a");
fwrite($log, $PaystackCallbackResponse);
fclose($log);
$data = json_decode($PaystackCallbackResponse, true);


$statusReference=$data['data']['reference'];
$paidAt=$data['data']['paid_at'];
$createdAt=$data['data']['created_at'];
$channel=$data['data']['channel'];
$referrer=$data['data']['metadata']['referrer'];
$lastTwoDigits=substr($referrer,-2);
$email=$data['data']['customer']['email'];
$amount=$data['data']['amount']/ 100;


$sql="INSERT INTO transactions(status_reference,paid_at,created_at,channel,referrer,email,amount)
VALUES('$statusReference','$paidAt','$createdAt','$channel','$lastTwoDigits','$email','$amount')";

if(mysqli_query($conn,$sql)){
    echo "Record inserted successfully";

}else{
    echo"Error: ",mysqli_error($conn);
}

mysqli_close($conn);