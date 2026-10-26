<?php
declare(strict_types=1);
date_default_timezone_set('America/Mexico_City');

function db(): PDO {
    static $pdo;
    if ($pdo) return $pdo;
    $path = __DIR__ . '/config.local.php';
    if (!is_file($path)) throw new RuntimeException('La base de datos no está configurada.');
    $c = require $path;
    $pdo = new PDO("mysql:host={$c['host']};port={$c['port']};dbname={$c['database']};charset=utf8mb4", $c['user'], $c['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
function query(string $sql, array $args = []): PDOStatement {
    $s = db()->prepare($sql); $s->execute($args); return $s;
}
function respond($data, int $status = 200): void {
    http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR); exit;
}
function fail(string $message, int $status = 422): void { respond(['error' => $message], $status); }
function body(): array {
    if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) fail('Se requiere JSON.', 415);
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) fail('Solicitud demasiado grande.', 413);
    $value = json_decode(file_get_contents('php://input'), true, 32, JSON_THROW_ON_ERROR);
    if (!is_array($value)) fail('Solicitud inválida.');
    return $value;
}
function currentUser(): ?array {
    $token = $_COOKIE['relax_session'] ?? '';
    if (preg_match('/^Bearer ([a-f0-9]{64})$/', $_SERVER['HTTP_AUTHORIZATION'] ?? '', $m)) $token = $m[1];
    if (!preg_match('/^[a-f0-9]{64}$/', $token)) return null;
    $u = query('SELECT u.id,u.nombre,u.correo,u.telefono,r.nombre AS rol FROM sesiones s JOIN usuarios u ON u.id=s.usuario_id JOIN roles r ON r.id=u.rol_id WHERE s.token_hash=? AND s.revocada_en IS NULL AND s.expira_en>NOW() AND u.estado="activo"', [hash('sha256', $token)])->fetch();
    return $u ?: null;
}
function requireUser(?string $rol = null): array {
    $u = currentUser();
    if (!$u) fail('Inicia sesión para guardar tus datos.', 401);
    if ($rol && $u['rol'] !== $rol) fail('No tienes permiso para esta operación.', 403);
    return $u;
}
function credentials(array $b): array {
    $nombre = trim((string)($b['nombre'] ?? ''));
    $email = strtolower(trim((string)($b['correo'] ?? '')));
    $password = (string)($b['contrasena'] ?? '');
    $tel = trim((string)($b['telefono'] ?? ''));
    if (mb_strlen($nombre) < 2 || mb_strlen($nombre) > 120) fail('Revisa tu nombre.');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 191) fail('Correo inválido.');
    if (strlen($password) < 8 || strlen($password) > 72) fail('La contraseña debe tener entre 8 y 72 bytes.');
    if ($tel && !preg_match('/^\+?[0-9\s()-]{7,20}$/', $tel)) fail('Teléfono inválido.');
    return [$nombre, $email, $password, $tel ?: null];
}
function isoDate(string $date): string {
    $d = DateTimeImmutable::createFromFormat('!d/m/Y', $date);
    if (!$d || $d->format('d/m/Y') !== $date) fail('Fecha inválida.');
    return $d->format('Y-m-d');
}
function displayDate(string $date): string { return (new DateTimeImmutable($date))->format('d/m/Y'); }
function atomic(callable $fn) {
    db()->beginTransaction();
    try { $value = $fn(); db()->commit(); return $value; }
    catch (Throwable $e) { if (db()->inTransaction()) db()->rollBack(); throw $e; }
}
