<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$json = file_get_contents('php://input');
$data = json_decode($json);

// Generate a random password
$password = generateRandomPassword();

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                        //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'your_email@gmail.com';                 //SMTP username
    $mail->Password   = 'your_password';                        //SMTP password
    $mail->SMTPSecure = 'TLS';                                  //Enable TLS encryption
    $mail->Port       = 587;                                    //TCP port to connect to

    // Password reset link
    $passwordResetLink = "http://localhost:3000/reset-password?email=" . urlencode($data->email);

    // Recipients
    $mail->setFrom('your_email@gmail.com', 'Your Name');
    $mail->addAddress($data->email, $data->firstname);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Password Reset';
    $mail->Body    = 'Dear ' . $data->firstname . ',<br><br>'
                    . 'You have requested to reset your password. Please click on the following link to reset your password:<br>'
                    . $passwordResetLink . '<br><br>'
                    . 'If you did not request this, please ignore this email.<br><br>'
                    . 'Thank you,<br>'
                    . 'Your Landlord';

    // Send email
    $mail->send();
    echo json_encode(array("result" => "Password reset link sent successfully."));
} catch (Exception $e) {
    echo json_encode(array("result" => "Failed to send password reset link. Error: " . $mail->ErrorInfo));
}

// Function to generate a random password
function generateRandomPassword($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $password = '';
    for ($i = 0; $i < $length; $i++) {
        $password .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $password;
}
?>
