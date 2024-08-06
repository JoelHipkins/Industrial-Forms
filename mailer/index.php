<?php
header('Content-Type: application/json', true);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'vendor/autoload.php';

$jsonRequest = file_get_contents('php://input');
$jsonRequest = json_decode($jsonRequest, true);

$title = "Get quote form";

if ($jsonRequest['type'] == "contact") {
    $title = "Contact form";
}

$name = $jsonRequest['name'];
$email = $jsonRequest['email'];
$message = $jsonRequest['message'];
$company = "";
$contact = "";
$files = "";

if (isset($jsonRequest['company'])) {
    $company = $jsonRequest['company'];
}

if (isset($jsonRequest['contact'])) {
    $contact = $jsonRequest['contact'];
}

if (isset($jsonRequest['files'])) {
    $temp = $jsonRequest['files'];
    foreach ($temp as $item) {
        $item["name"] = str_replace("-","",$item["name"]);
        $item["name"] = str_replace("#","",$item["name"]);
        $files.="<a href='http://industrialforms.co.uk/fileupload/uploads/".$item["name"]."' target='_blank'>".$item["name"]."</a><br/>";
    }
}

$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->isSMTP();
	$mail->CharSet = 'UTF-8';
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'robert.plauszewski@industrialforms.co.uk';
    $mail->Password = 'BMW435D123';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    //Recipients
    $mail->setFrom($email);
    $mail->addAddress('enquiries@industrialforms.co.uk');
    $mail->addReplyTo($email);

    $body = "From: ".$name."<br/><br/>Email: ".$email."<br/><br/>Message: <br/>".$message;

    if ($jsonRequest['type'] == "quote") {
        $body = "Name: ".$name."<br/><br/>Company: ".$company."<br/><br/>Email: ".$email."<br/><br/>Contact: ".$contact."<br/><br/>Message: <br/>".$message."<br/><br/>Files: <br/><br/>".$files;
    }

    $mail->Subject = $title;
    $mail->Body    = $body;
    $mail->AltBody = $body;

    $mail->send();
    
    echo json_encode([
        'result' => 1,
        'message' => "Message has been sent."
    ]);
} catch (Exception $e) {
    echo json_encode([
        'result' => 0,
        'message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo
    ]);
}
