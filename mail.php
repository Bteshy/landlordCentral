<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'vendor/autoload.php';

$conn = new mysqli("localhost", "root", "", "project");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
}

$json = file_get_contents('php://input');
$data = json_decode($json);
//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
                 //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'brendachepngetich123@gmail.com';                     //SMTP username
    $mail->Password   = 'qfkz hstt yeuk rtfi';                               //SMTP password
    $mail->SMTPSecure = 'TLS';            //Enable implicit TLS encryption
    $mail->Port       = 587;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    // $mail->setFrom($data->email);
    $mail->addAddress('brendachepngetich123@gmail.com');    //Add a recipient
    // $mail->addAddress('ellen@example.com');               //Name is optional
  
    $mail->addReplyTo($data->email);
    // $mail->addCC('cc@example.com');
    // $mail->addBCC('bcc@example.com');

    //Attachments
    // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'New Maintenance Request';
    $mail->Body    = "You have a new maintenance request.<br><b>Unitid:</b> {$data->unitid}<br><b>Description:</b> {$data->description}<br><b>Priority:</b> {$data->priority}";
    $mail->AltBody = "Unitid: {$data->unitid}\nDescription: {$data->description}\nPriority: {$data->priority}";


    $mail->send();
    echo 'Message has been sent';
    
    $sql = "INSERT INTO maintenance (email, Unit_id, Description, Priority) 
    VALUES ('{$data->email}', '{$data->unitid}', '{$data->description}', '{$data->priority}')";

if ($conn->query($sql) === TRUE) {
echo "Record inserted successfully";
} else {
echo "Error inserting record: " . $conn->error;
}
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}