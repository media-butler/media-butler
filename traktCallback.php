<?php

function rest_helper($url, $params = null, $verb = 'GET', $format = 'json')
{
  $cparams = array(
    'http' => array(
      'method' => $verb,
      'ignore_errors' => true
    )
  );
  if ($params !== null) {
    $params = http_build_query($params);
    if ($verb == 'POST') {
      $cparams['http']['content'] = $params;
    } else {
      $url .= '?' . $params;
    }
  }

  $context = stream_context_create($cparams);
  $fp = fopen($url, 'rb', false, $context);
  if (!$fp) {
    $res = false;
  } else {
    // If you're trying to troubleshoot problems, try uncommenting the
    // next two lines; it will show you the HTTP response headers across
    // all the redirects:
    // $meta = stream_get_meta_data($fp);
    // var_dump($meta['wrapper_data']);
    $res = stream_get_contents($fp);
  }

  if ($res === false) {
    throw new Exception("$verb $url failed: $php_errormsg");
  }

  switch ($format) {
    case 'json':
      $r = json_decode($res);
      if ($r === null) {
        throw new Exception("failed to decode $res as json");
      }
      return $r;

    case 'xml':
      $r = simplexml_load_string($res);
      if ($r === null) {
        throw new Exception("failed to decode $res as xml");
      }
      return $r;
  }
  return $res;
}







$CLIENT_ID = "15cb6120f9349dc948f5a02d6e3697f2464d03d530c6cc84cc8653e75f831043";
$CLIENT_SECRET = "7da9bfa2e3f7c826479a9a7f7dbc3c12f827a96ba9a53019416f0b7e4afb4a63";
$REDIRECT_URI = "http://media-butler.appspot.com/traktCallback.php";
if($_SERVER["SERVER_NAME"] == "localhost")
	$REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob"; // LOCAL DEBUGGING

if(!isset($_GET['code'])) die('AUTHORISATION FAILED!');

$response = rest_helper(
    "https://api-v2launch.trakt.tv/oauth/token",
    array(
        "code" => $_GET['code'],
        "client_id" => $CLIENT_ID,
        "client_secret" => $CLIENT_SECRET,
        "redirect_uri" => $REDIRECT_URI,
        "grant_type" => "authorization_code"
    ),
    "POST"
);

//print_r($response);

if(isset($response->error)){
    die('ERROR WITH TRAKT API: '.$response->error_description);
}

$token = $response->access_token;
//echo $token;

?>
<!doctype html>
<html>
    <body>
        You can now close this window.
        <!-- <?php print_r($response); ?> -->
        
        <script>
            localStorage.setItem('trakt.access_token', '<?=$token?>');
			window.close();
        </script>
    </body>
</html>