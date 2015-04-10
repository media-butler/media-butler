<?php
$USER = "ae7289f6e5fad70a927d9b8c2898666e";
$PASS = "0126d645d433f27a233a6d872451c7d0";
$BASE_URL = "https://www.tunefind.com/api/v1";

$context = stream_context_create(array(
	'http' => array(
		'header'  => "Authorization: Basic " . base64_encode("$USER:$PASS")
	)
));


if($_GET['type'] == "episode"){
	$shows = json_decode(file_get_contents("https://www.tunefind.com/api/v1/show", false, $context))->shows;
	
	$_GET['show'] = str_replace('.', '', $_GET['show']);
	
	foreach($shows as $show){
		if($show->name == $_GET['show']) $show_url = $show->tunefind_api_url;
		if($show->name == $_GET['show'].' ('.$_GET['year'].')') $show_url = $show->tunefind_api_url;
	}
	
	
	
	if(!$show_url) die('NO SHOW FOUND WITH NAME '.$_GET['show']);
	
	$season_url = $show_url.'/season-'.$_GET['season'];
	
	$episodes = json_decode(file_get_contents($season_url, false, $context))->episodes;
	
	if(!$episodes) die('SEASON '.$_GET['season'].' NOT FOUND');
	
	foreach($episodes as $episode){
		if($episode->number == $_GET['episode']) $return = $episode->tunefind_api_url;
	}
}
else{
	$movies = json_decode(file_get_contents("https://www.tunefind.com/api/v1/movie", false, $context))->movies;

	foreach($movies as $movie){
		if($movie->name == $_GET['movie']) $return = $movie->tunefind_api_url;
		if($movie->name == $_GET['movie'].' ('.$_GET['year'].')') $return = $movie->tunefind_api_url;
	}
}

if(!$return) die ('EPISODE / MOVIE NOT FOUND');

$file = file_get_contents($return, false, $context);

foreach($http_response_header as $header){
	header($header);
}

echo $file;