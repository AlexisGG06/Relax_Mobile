<?php
declare(strict_types=1);
require __DIR__.'/bootstrap.php';
require __DIR__.'/catalogos.php';
require __DIR__.'/viajes.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
$origin=$_SERVER['HTTP_ORIGIN']??'';
$allowed=['http://localhost','http://127.0.0.1','http://localhost:8081','http://localhost:8082','http://localhost:8083','http://localhost:8084'];
if(is_file(__DIR__.'/config.local.php')) { $config=require __DIR__.'/config.local.php'; $allowed=array_merge($allowed,$config['allowed_origins']??[]); }
if($origin && !in_array($origin,$allowed,true)) fail('Origen no permitido.',403);
if($origin) { header('Access-Control-Allow-Origin: '.$origin); header('Vary: Origin'); header('Access-Control-Allow-Credentials: true'); }
if($_SERVER['REQUEST_METHOD']==='OPTIONS') { header('Access-Control-Allow-Headers: Content-Type, Authorization'); header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); http_response_code(204); exit; }
try {
    $action=$_GET['accion']??''; $method=$_SERVER['REQUEST_METHOD'];
    if($method==='GET') {
        if($action==='salud') { query('SELECT 1'); respond(['ok'=>true,'database'=>'relax']); }
        if($action==='catalogos') respond(catalogos());
        if($action==='sesion') respond(['usuario'=>currentUser()]);
        $u=requireUser(); $uid=(int)$u['id'];
        if($action==='viaje') respond(tripState($uid));
        if($action==='metodos') respond(['metodos'=>paymentMethods($uid)]);
        if($action==='pedidos') respond(['pedidos'=>query('SELECT id,viaje_id,total,moneda,estado,metodo_tipo_snapshot,creado_en FROM pedidos WHERE usuario_id=? ORDER BY id DESC LIMIT 50',[$uid])->fetchAll()]);
        if($action==='mensajes') respond(['mensajes'=>query('SELECT m.id,m.autor,m.contenido AS texto FROM mensajes m JOIN conversaciones c ON c.id=m.conversacion_id WHERE c.usuario_id=? ORDER BY m.id DESC LIMIT 100',[$uid])->fetchAll()]);
        fail('Recurso no encontrado.',404);
    }
    if($method!=='POST') fail('Método no permitido.',405);
    $b=body();
    if($action==='registro') {
        if(isset($b['rol']) && $b['rol']!=='cliente') fail('Solo el administrador puede dar de alta cuentas de empresa.',403);
        [$name,$email,$password,$tel]=credentials($b);
        if(query('SELECT 1 FROM usuarios WHERE correo=?',[$email])->fetchColumn()) fail('El correo ya está registrado.',409);
        query('INSERT INTO usuarios(rol_id,nombre,correo,contrasena_hash,telefono,estado) VALUES(2,?,?,?,?,"activo")',[$name,$email,password_hash($password,PASSWORD_DEFAULT),$tel]);
        respond(['ok'=>true,'mensaje'=>'Cuenta creada exitosamente'],201);
    }
    if($action==='login') {
        $ip=hash('sha256',$_SERVER['REMOTE_ADDR']??'local');
        if((int)query('SELECT COUNT(*) FROM intentos_acceso WHERE origen_hash=? AND creado_en>DATE_SUB(NOW(),INTERVAL 15 MINUTE)',[$ip])->fetchColumn()>=10) fail('Demasiados intentos. Espera 15 minutos.',429);
        $email=strtolower(trim((string)($b['correo']??''))); $pw=(string)($b['contrasena']??'');
        $user=query('SELECT u.*,r.nombre AS rol FROM usuarios u JOIN roles r ON r.id=u.rol_id WHERE correo=?',[$email])->fetch();
        $valid=password_verify($pw,$user['contrasena_hash']??'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
        if(!$user || !$valid || $user['estado']!=='activo') { query('INSERT INTO intentos_acceso(origen_hash) VALUES(?)',[$ip]); fail('Correo o contraseña incorrectos.',401); }
        query('DELETE FROM intentos_acceso WHERE origen_hash=?',[$ip]);
        if(password_needs_rehash($user['contrasena_hash'],PASSWORD_DEFAULT)) query('UPDATE usuarios SET contrasena_hash=? WHERE id=?',[password_hash($pw,PASSWORD_DEFAULT),$user['id']]);
        $token=bin2hex(random_bytes(32));
        query('INSERT INTO sesiones(usuario_id,token_hash,expira_en) VALUES(?,?,DATE_ADD(NOW(),INTERVAL 7 DAY))',[$user['id'],hash('sha256',$token)]);
        setcookie('relax_session',$token,['expires'=>time()+604800,'path'=>'/RELAX-Mobile/api','httponly'=>true,'secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=='off','samesite'=>'Lax']);
        respond(['usuario'=>currentUserFromId((int)$user['id']),'token'=>$token]);
    }
    $u=requireUser(); $uid=(int)$u['id'];
    if($action==='logout') {
        $token=$_COOKIE['relax_session']??'';
        if(preg_match('/^Bearer ([a-f0-9]{64})$/',$_SERVER['HTTP_AUTHORIZATION']??'',$m)) $token=$m[1];
        query('UPDATE sesiones SET revocada_en=NOW() WHERE token_hash=?',[hash('sha256',$token)]);
        setcookie('relax_session','',['expires'=>1,'path'=>'/RELAX-Mobile/api','httponly'=>true,'samesite'=>'Lax']);
        respond(['ok'=>true]);
    }
    if($action==='crear_empresa') {
        requireUser('administrador');
        [$name,$email,$password,$tel]=credentials($b);
        $business=trim((string)($b['negocio']??''));
        if(mb_strlen($business)<2 || mb_strlen($business)>150) fail('Indica el nombre del negocio.');
        if(query('SELECT 1 FROM usuarios WHERE correo=?',[$email])->fetchColumn()) fail('El correo ya está registrado.',409);
        $id=atomic(function() use($name,$email,$password,$tel,$business) {
            query('INSERT INTO usuarios(rol_id,nombre,correo,contrasena_hash,telefono,estado) VALUES(3,?,?,?,?,"activo")',[$name,$email,password_hash($password,PASSWORD_DEFAULT),$tel]);
            $id=(int)db()->lastInsertId();
            query('INSERT INTO negocios(propietario_id,nombre,telefono,correo_contacto,estado) VALUES(?,?,?,?,"aprobado")',[$id,$business,$tel,$email]);
            return $id;
        });
        respond(['usuario'=>currentUserFromId($id)],201);
    }
    requireUser('cliente');
    if($action==='viaje') respond(mutateTrip($uid,$b));
    if($action==='metodos') {
        $type=$b['tipo']??''; $name=trim((string)($b['titular']??'')); $last=(string)($b['ultimos4']??'');
        if(!in_array($type,['credito','debito','efectivo','transferencia','oxxo'],true)) fail('Método no válido.');
        $card=in_array($type,['credito','debito'],true);
        if($card && (!$name || mb_strlen($name)>120 || !preg_match('/^[0-9]{4}$/',$last))) fail('Revisa el titular y la terminación de la tarjeta.');
        // Solo metadatos de prueba: ninguna ruta recibe o almacena PAN ni CVV.
        $name=$card?$name:null; $last=$card?$last:null;
        $old=query('SELECT id FROM metodos_pago WHERE usuario_id=? AND tipo=? AND titular<=>? AND ultimos4<=>? AND activo=1',[$uid,$type,$name,$last])->fetchColumn();
        if(!$old) { query('INSERT INTO metodos_pago(usuario_id,tipo,titular,ultimos4) VALUES(?,?,?,?)',[$uid,$type,$name,$last]); $old=db()->lastInsertId(); }
        respond(['metodo'=>['id'=>(string)$old,'tipo'=>$type,'titular'=>$name,'ultimos4'=>$last],'metodos'=>paymentMethods($uid)],201);
    }
    if($action==='mensajes') {
        $question=trim((string)($b['pregunta']??'')); $answer=trim((string)($b['respuesta']??''));
        if(!$question || !$answer || mb_strlen($question)>500 || mb_strlen($answer)>6000) fail('Mensaje inválido.');
        atomic(function() use($uid,$question,$answer) {
            query('SELECT id FROM usuarios WHERE id=? FOR UPDATE',[$uid]);
            $trip=activeTrip($uid); $tid=$trip['id']??null;
            $cid=query('SELECT id FROM conversaciones WHERE usuario_id=? AND viaje_id<=>? ORDER BY id DESC LIMIT 1',[$uid,$tid])->fetchColumn();
            if(!$cid) { query('INSERT INTO conversaciones(usuario_id,viaje_id) VALUES(?,?)',[$uid,$tid]); $cid=db()->lastInsertId(); }
            query('INSERT INTO mensajes(conversacion_id,autor,contenido) VALUES(?,"usuario",?),(?,"asistente",?)',[$cid,$question,$cid,$answer]);
        }); respond(['ok'=>true]);
    }
    fail('Recurso no encontrado.',404);
} catch(JsonException $e) { fail('JSON inválido.'); }
catch(PDOException $e) { error_log($e->getMessage()); if(db()->inTransaction()) db()->rollBack(); fail('No se pudo guardar la operación. Revisa los datos o intenta de nuevo.',409); }
catch(Throwable $e) { error_log($e->getMessage()); fail('No se pudo completar la operación.',500); }

function currentUserFromId(int $id): array {
    return query('SELECT u.id,u.nombre,u.correo,u.telefono,r.nombre AS rol FROM usuarios u JOIN roles r ON r.id=u.rol_id WHERE u.id=?',[$id])->fetch();
}
function paymentMethods(int $uid): array {
    return array_map(function($m) { $m['id']=(string)$m['id']; return $m; },query('SELECT id,tipo,titular,ultimos4 FROM metodos_pago WHERE usuario_id=? AND activo=1 ORDER BY id',[$uid])->fetchAll());
}
