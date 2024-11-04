<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,POST");
header("Access-Control-Allow-Headers: content-Type");


$conn = new mysqli("localhost","root","","project");

if (mysqli_connect_error()){
    echo mysqli_connect_error();
    exit();
}
else {
    $eData = file_get_contents("php://input");
    $dData = json_decode($eData, true);

    $email = $dData ['email'];
    $password = $dData ['password'];

    $result = "";

    if ($email != "" and $password != ""){
        $sql = "SELECT * FROM users WHERE email='$email'";

        $res = mysqli_query($conn, $sql);

        if(mysqli_num_rows($res) != 0){
            $row = mysqli_fetch_array($res);
            if($password !=$row['password']){
                $result = "Invalid password";
            }
            else{
                $role = $row['role'];
                $result= "Login succefull redirecting to dashboard...";
                $response[] = array("result" => (string)$result, "role" => $role);
            }
        }
        else
        {$result = "Invalid email";
            $response[] = array("result" => (string)$result);}
    }
        else{
            $result ="";
            $response[] = array("result" => (string)$result);
        }

   
    $response[]= array("result"=> (String)$result);
    echo json_encode($response);
    }





?>