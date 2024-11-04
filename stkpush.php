<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,POST");
header("Access-Control-Allow-Headers: content-Type");

date_default_timezone_set('Africa/Nairobi');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Log the request payload
    $requestPayload = file_get_contents('php://input');
    file_put_contents('request_payload.log', $requestPayload);

    $consumerKey = 'UjwGZguCMnD8YZJf8TGGdSyripyqDAPSaNwoJV7qc4rAw2Ce'; // Fill with your app Consumer Key
    $consumerSecret = 'Y8frxmxmnLzNn31p1eJQxXRrk8cMIB2sJU07qZDzAYjRYtA6GZ3lnJWwOi1H5ilO'; // Fill with your app Secret
    $BusinessShortCode = '174379';
    $Passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    $CallBackURL = 'https://b08f-41-212-28-23.ngrok-free.app/php/callback.php';

    $eData = file_get_contents("php://input");
    $dData = json_decode($eData, true);

    $phone = $dData['contact'];
    $amount = $dData['amount'];
    $PartyA = $phone;
    $AccountReference = 'Neema';
    $TransactionDesc = 'Test Payment';
    $Timestamp = date('YmdHis');
    $Password = base64_encode($BusinessShortCode . $Passkey . $Timestamp);
    $access_token_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    $initiate_url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    $headers = ['Content-Type:application/json; charset=utf8'];

    $curl = curl_init($access_token_url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($curl, CURLOPT_HEADER, FALSE);
    curl_setopt($curl, CURLOPT_USERPWD, $consumerKey . ':' . $consumerSecret);

    $result = curl_exec($curl);

    if ($result === false) {
        echo 'Curl error: ' . curl_error($curl);
        exit();
    }

    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $result = json_decode($result);
    $access_token = $result->access_token;

    curl_close($curl);

    $stkheader = ['Content-Type:application/json', 'Authorization:Bearer ' . $access_token];

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $initiate_url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $stkheader);

    $curl_post_data = array(
        'BusinessShortCode' => $BusinessShortCode,
        'Password' => $Password,
        'Timestamp' => $Timestamp,
        'TransactionType' => 'CustomerPayBillOnline',
        'Amount' => $amount,
        'PartyA' => $PartyA,
        'PartyB' => $BusinessShortCode,
        'PhoneNumber' => $PartyA,
        'CallBackURL' => $CallBackURL,
        'AccountReference' => $AccountReference,
        'TransactionDesc' => $TransactionDesc
    );

    $data_string = json_encode($curl_post_data);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);

    $curl_response = curl_exec($curl);

    if ($curl_response === false) {
        echo 'Curl error: ' . curl_error($curl);
        exit();
    }

    // Log the response
    file_put_contents('response.log', $curl_response);

    print_r($curl_response);
}
?>
