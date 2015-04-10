<?php

$BASE_URL = "https://api-v2launch.trakt.tv";
$URL = $BASE_URL . $_GET['url'];
$CLIENT_ID = "15cb6120f9349dc948f5a02d6e3697f2464d03d530c6cc84cc8653e75f831043";
$METHOD = $_GET['method'];
$ACCESS_TOKEN = $_GET['access_token'];


$context_config = array(
	'http' => array(
		'method' => $METHOD,
		'ignore_errors' => true,
		'header' =>  "Content-type: application/json\r\n".
			"trakt-api-key: ".$CLIENT_ID."\r\n".
			"trakt-api-version: 2\r\n".
			"Authorization: Bearer ".$ACCESS_TOKEN."\r\n"
	),
	"ssl" => array(
		"verify_peer" => false
	)
);

if($_GET['method'] == 'POST'){
	$context_config['http']['content'] = http_build_query($_POST);
}

$context = stream_context_create($context_config);


$file = file_get_contents($URL, false, $context);

if($file === false){
	die('OPENING FILE FAILED! '.error_get_last()["message"]);
}

foreach($http_response_header as $header){
	header($header);
}

echo $file;