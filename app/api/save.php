<?php
// /api/save.php

// -------------- Ajustes --------------
$DATA_DIR = __DIR__ . '/../data';                 // carpeta de datos
$JSONL     = $DATA_DIR . '/encuestas.jsonl';      // global
$CSV_AHORRO = $DATA_DIR . '/encuestas_ahorro.csv';
$CSV_DEUDA  = $DATA_DIR . '/encuestas_deuda.csv';
// -------------------------------------

// Health check opcional (permite GET ?health=1)
if (isset($_GET['health'])) {
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok' => true, 'msg' => 'encuestas api ok (php)']);
  exit;
}

// Solo POST y JSON
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  echo 'Method Not Allowed';
  exit;
}

$raw = file_get_contents('php://input');
if (!$raw) {
  http_response_code(400);
  echo 'Empty body';
  exit;
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
  http_response_code(400);
  echo 'Invalid JSON';
  exit;
}

// Normaliza/valida campos
$clase = strtolower(trim($payload['clase'] ?? ''));
if ($clase !== 'ahorro' && $clase !== 'deuda') {
  $clase = 'desconocida';
}

$record = [
  'ts'          => time() * 1000,
  'ts_iso'      => gmdate('c'),
  'clase'       => $clase,
  'encuesta_id' => (string)($payload['id'] ?? ''),
  'tipo'        => (string)($payload['mode'] ?? ''),
  'pregunta'    => (string)($payload['question'] ?? ''),
  'respuesta'   => $payload['value'] ?? null,
  'user'        => $payload['user'] ?? null,
  'meta'        => $payload['meta'] ?? null,
];

// Asegura carpeta data
if (!is_dir($DATA_DIR)) {
  @mkdir($DATA_DIR, 0775, true);
}

// --- Guardar JSONL (una línea por respuesta) ---
$line = json_encode($record, JSON_UNESCAPED_UNICODE) . "\n";
$ok = file_put_append_lock($JSONL, $line);
if (!$ok) {
  http_response_code(500);
  echo 'Failed to write JSONL';
  exit;
}

// --- (Opcional) Guardar CSV por clase ---
if ($clase === 'ahorro' || $clase === 'deuda') {
  $csvPath = ($clase === 'ahorro') ? $CSV_AHORRO : $CSV_DEUDA;

  // Añade BOM UTF-8 si el archivo no existe (para que Excel lo interprete bien)
  if (!file_exists($csvPath)) {
      $bom = "\xEF\xBB\xBF";
      file_put_append_lock($csvPath, $bom);
  }


  if (!file_exists($csvPath)) {
    $header = "ts_iso,clase,encuesta_id,tipo,pregunta,respuesta,user\n";
    file_put_append_lock($csvPath, $header);
  }

  $safe = function($v) {
    if ($v === null) return '""';
    $s = (string)$v;
    $s = str_replace('"', '""', $s);
    return '"' . $s . '"';
  };

  $userCol = '';
  if (!empty($record['user'])) {
    $u = $record['user'];
    $userCol = $u['id'] ?? ($u['name'] ?? ($u['email'] ?? ''));
  }

  $csvLine = implode(',', [
    $safe($record['ts_iso']),
    $safe($record['clase']),
    $safe($record['encuesta_id']),
    $safe($record['tipo']),
    $safe($record['pregunta']),
    $safe(is_scalar($record['respuesta']) ? $record['respuesta'] : json_encode($record['respuesta'], JSON_UNESCAPED_UNICODE)),
    $safe($userCol),
  ]) . "\n";

  file_put_append_lock($csvPath, $csvLine);
}

// Respuesta OK
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['ok' => true]);

// --------- helpers ----------
function file_put_append_lock($path, $data) {
  $fp = @fopen($path, 'ab');
  if (!$fp) return false;
  $ok = false;
  if (flock($fp, LOCK_EX)) {
    $ok = (fwrite($fp, $data) !== false);
    fflush($fp);
    flock($fp, LOCK_UN);
  }
  fclose($fp);
  return $ok;
}
