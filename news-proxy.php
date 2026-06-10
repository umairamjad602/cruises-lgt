<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Forward all query params to letsgotours.com API
$params = $_GET;
$queryString = http_build_query($params);

$apiUrl = 'https://api.letsgotours.com/api/pages/open?' . $queryString;

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'https://letsgotours.com';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Origin: ' . $origin,
    'Referer: https://letsgotours.com/',
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Proxy request failed: ' . $error]);
    exit;
}

http_response_code($httpCode);
echo $response;
