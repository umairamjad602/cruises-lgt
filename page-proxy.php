<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$lang = isset($_GET['lang']) ? preg_replace('/[^a-z]/', '', $_GET['lang']) : 'en';
$slug = isset($_GET['slug']) ? preg_replace('/[^a-zA-Z0-9\-_]/', '', $_GET['slug']) : '';

if (!$slug) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing slug parameter']);
    exit;
}

$apiUrl = "https://api.letsgotours.com/api/pages/{$lang}/{$slug}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Origin: https://letsgotours.com',
    'Referer: https://letsgotours.com/',
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Proxy request failed: ' . $error]);
    exit;
}

http_response_code($httpCode);
echo $response;
