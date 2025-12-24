<?php

	$name 		= $_POST['myName'];
	$email	 	= $_POST['myEmail'];
	$message 		= $_POST['myMessage'];

	$to 			= "batool@liverpool.ac.uk";
	$subject 		= "Email from my website";
	$body 			= "Information Submitted:";

	$body .= "\r\n Name: " . $name;
	$body .= "\r\n Email: " . $email;
	$body .= "\r\n Message: " . $message;

	mail($to, $subject, $body);
?>
