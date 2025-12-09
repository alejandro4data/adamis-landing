<?php
// /api/save_reflexion.php  — guarda respuestas de "Cuadro de reflexión"

// ----- rutas de salida -----
$DATA_DIR        = __DIR__ . '/../data';
$JSONL_PATH      = $DATA_DIR . '/reflexiones.jsonl';          // global
$CSV_AHORRO_PATH = $DATA_DIR . '/reflexiones_ahorro.csv';     // por clase
$CSV_DEUDA_PATH  = $DATA_DIR . '/reflexiones_deuda.csv';

// Health check: GET ?health=1
if (isset($_GET['health'])) {
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok'=>true,'msg'=>'reflexion api ok (php)']);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  echo 'Method Not Allowed';
  exit;
}

$raw = file_get_contents('php://input');
if (!$raw) { http_response_code(400); echo 'Empty body'; exit; }

$payload = json_decode($raw, true);
if (!is_array($payload)) { http_response_code(400); echo 'Invalid JSON'; exit; }

// Normaliza
$clase = strtolower(trim($payload['clase'] ?? ''));
if ($clase !== 'ahorro' && $clase !== 'deuda') $clase = 'desconocida';

$record = [
  'ts'       => time()*1000,
  'ts_iso'   => gmdate('c'),
  'clase'    => $clase,
  'id'       => (string)($payload['id'] ?? ''),         // id de la reflexión (slide)
  'pregunta' => (string)($payload['question'] ?? ''),
  'respuesta'=> $payload['answer'] ?? ($payload['value'] ?? null),
  'user'     => $payload['user'] ?? null,
  'meta'     => $payload['meta'] ?? null,
  'result'   => $payload['result'] ?? null              // feedback si lo mandas
];

// Asegura carpeta
if (!is_dir($DATA_DIR)) { @mkdir($DATA_DIR, 0775, true); }

// =========== JSONL ===========
$line = json_encode($record, JSON_UNESCAPED_UNICODE) . "\n";
if (!file_put_append_lock($JSONL_PATH, $line)) {
  http_response_code(500); echo 'Failed to write JSONL'; exit;
}

// =========== CSV por clase (con BOM UTF-8 para Excel) ===========
if ($clase === 'ahorro' || $clase === 'deuda') {
  $csvPath = ($clase === 'ahorro') ? $CSV_AHORRO_PATH : $CSV_DEUDA_PATH;

  // Si no existe: escribe BOM + cabecera
  if (!file_exists($csvPath)) {
    file_put_append_lock($csvPath, "\xEF\xBB\xBF"); // BOM
    $header = "ts_iso,clase,reflexion_id,pregunta,respuesta,user\n";
    file_put_append_lock($csvPath, $header);
  }

  $safe = function($v){
    if ($v === null) return '""';
    $s = is_scalar($v) ? (string)$v : json_encode($v, JSON_UNESCAPED_UNICODE);
    $s = str_replace('"','""',$s);
    return "\"$s\"";
  };

  $userCol = '';
  if (!empty($record['user'])) {
    $u = $record['user'];
    $userCol = $u['id'] ?? ($u['name'] ?? ($u['email'] ?? ''));
  }

  $csv = implode(',', [
    $safe($record['ts_iso']),
    $safe($record['clase']),
    $safe($record['id']),
    $safe($record['pregunta']),
    $safe($record['respuesta']),
    $safe($userCol)
  ]) . "\n";

  file_put_append_lock($csvPath, $csv);
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode(['ok'=>true]);

// ------- helper con lock --------
function file_put_append_lock($path, $data){
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
