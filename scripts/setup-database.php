<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(403); exit; }
$root = dirname(__DIR__);
$pdo = new PDO('mysql:host=127.0.0.1;port=3307;charset=utf8mb4', getenv('RELAX_DB_ADMIN_USER') ?: 'root', getenv('RELAX_DB_ADMIN_PASSWORD') ?: '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$pdo->exec('CREATE DATABASE IF NOT EXISTS relax CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
$pdo->exec('USE relax');
$count = (int)$pdo->query('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema="relax"')->fetchColumn();
if ($count === 0) {
    $pdo->exec(file_get_contents($root . '/database/schema.sql'));
    echo "Esquema creado.\n";
} else {
    echo "Base existente conservada; no se reimporta el esquema.\n";
}
$pdo->exec('CREATE TABLE IF NOT EXISTS intentos_acceso (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, origen_hash CHAR(64) NOT NULL, creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_intentos(origen_hash,creado_en)) ENGINE=InnoDB');
$pdo->exec('CREATE TABLE IF NOT EXISTS catalogo_importacion (id TINYINT PRIMARY KEY, completada_en DATETIME NOT NULL) ENGINE=InnoDB');
if (!is_file($root . '/api/config.local.php')) {
    $secret = bin2hex(random_bytes(24));
    $pdo->exec("CREATE USER IF NOT EXISTS 'relax_app'@'127.0.0.1' IDENTIFIED BY '$secret'");
    $pdo->exec("ALTER USER 'relax_app'@'127.0.0.1' IDENTIFIED BY '$secret'");
    $pdo->exec("GRANT SELECT, INSERT, UPDATE, DELETE ON relax.* TO 'relax_app'@'127.0.0.1'");
    file_put_contents($root . '/api/config.local.php', '<?php return ' . var_export(['host'=>'127.0.0.1','port'=>3307,'database'=>'relax','user'=>'relax_app','password'=>$secret], true) . ';');
}
if (!(int)$pdo->query('SELECT COUNT(*) FROM usuarios WHERE rol_id=1')->fetchColumn()) {
    $password = bin2hex(random_bytes(10)) . '!aA';
    $s = $pdo->prepare('INSERT INTO usuarios(rol_id,nombre,correo,contrasena_hash,estado) VALUES(1,?,?,?,"activo")');
    $s->execute(['Administrador RELAX', 'administrador@relax.local', password_hash($password, PASSWORD_DEFAULT)]);
    file_put_contents($root . '/api/admin-inicial.local.txt', "Correo: administrador@relax.local\nContraseña inicial: $password\nCambia esta contraseña antes de compartir o publicar la aplicación.\n");
    echo "Administrador inicial creado. Acceso en api/admin-inicial.local.txt (archivo privado).\n";
}
echo "Conexión preparada.\n";
