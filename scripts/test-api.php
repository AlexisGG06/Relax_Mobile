<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli') { http_response_code(403); exit; }
require dirname(__DIR__).'/api/bootstrap.php';
$tag=bin2hex(random_bytes(6)); $ids=[]; $checks=0;
function callApi(string $action, ?array $body=null, ?string $token=null, bool $cookie=false): array {
    $headers="Accept: application/json\r\n";
    if($body!==null) $headers.="Content-Type: application/json\r\n";
    if($token) $headers.=$cookie?"Cookie: relax_session=$token\r\n":"Authorization: Bearer $token\r\n";
    $opts=['http'=>['method'=>$body===null?'GET':'POST','header'=>$headers,'ignore_errors'=>true,'timeout'=>15]];
    if($body!==null) $opts['http']['content']=json_encode($body);
    $result=file_get_contents('http://localhost/RELAX-Mobile/api/index.php?accion='.$action,false,stream_context_create($opts));
    preg_match('/\s(\d{3})\s/',$http_response_header[0],$m);
    return [(int)$m[1],json_decode($result,true,512,JSON_THROW_ON_ERROR)];
}
function check(bool $condition,string $name): void { global $checks; if(!$condition) throw new RuntimeException($name); $checks++; echo "OK $name\n"; }
try {
    [$status,$catalog]=callApi('catalogos'); check($status===200 && count($catalog['hospedajes'])===12 && count($catalog['zonas'])===3,'Catálogos de MariaDB');
    [$status]=callApi('viaje'); check($status===401,'Viaje requiere sesión');
    $data=['nombre'=>'Prueba integración','correo'=>"test-$tag@relax.invalid",'contrasena'=>'Prueba123!'];
    [$status]=callApi('registro',$data+['rol'=>'empresario']); check($status===403,'Registro público rechaza empresa');
    [$status]=callApi('registro',$data+['rol'=>'administrador']); check($status===403,'Registro público rechaza administrador');
    [$status]=callApi('registro',$data); check($status===201,'Registro cliente');
    $uid=(int)query('SELECT id FROM usuarios WHERE correo=?',[$data['correo']])->fetchColumn(); $ids[]=$uid;
    $stored=query('SELECT rol_id,contrasena_hash FROM usuarios WHERE id=?',[$uid])->fetch();
    check((int)$stored['rol_id']===2 && $stored['contrasena_hash']!==$data['contrasena'] && password_verify($data['contrasena'],$stored['contrasena_hash']),'Rol cliente y contraseña hasheada');
    [$status]=callApi('registro',$data); check($status===409,'Correo duplicado rechazado');
    [$status]=callApi('login',['correo'=>$data['correo'],'contrasena'=>'incorrecta']); check($status===401,'Credenciales inválidas rechazadas');
    [$status,$login]=callApi('login',$data); $token=$login['token']??''; check($status===200 && $login['usuario']['rol']==='cliente','Login determina rol');
    [$status,$restored]=callApi('sesion',null,$token,true); check($status===200 && (int)$restored['usuario']['id']===$uid,'Sesión recuperada mediante cookie');
    [$status]=callApi('crear_empresa',$data+['negocio'=>'Prueba'],$token); check($status===403,'Cliente no puede crear empresa');
    [$status,$pay]=callApi('metodos',['tipo'=>'efectivo'],$token); $method=$pay['metodo']['id']; check($status===201,'Método persistido');
    [$status]=callApi('metodos',['tipo'=>'credito','titular'=>'Prueba','ultimos4'=>'abc1'],$token); check($status===422,'Tarjeta inválida rechazada');
    $hotel=$catalog['hospedajes'][0]; $zone=current(array_filter($catalog['zonas'],fn($z)=>$z['nombre']===$hotel['zona']));
    $start=(new DateTimeImmutable('+10 days'))->format('d/m/Y'); $end=(new DateTimeImmutable('+12 days'))->format('d/m/Y');
    $h=['id'=>$hotel['id'],'fechaLlegada'=>$start,'fechaSalida'=>$end,'huespedes'=>1,'precio'=>'0','metodoPagoId'=>$method];
    [$status,$state]=callApi('viaje',['operacion'=>'reservar','elemento'=>$h],$token); check($status===200 && $state['hospedaje']['id']===$hotel['id'],'Reserva persistida');
    $expected=2*(float)$hotel['precio'];
    [$status,$orders]=callApi('pedidos',null,$token); check($status===200 && abs((float)$orders['pedidos'][0]['total']-$expected)<0.01,'Precio recalculado por servidor');
    $activity=$zone['actividades'][0];
    [$status,$state]=callApi('viaje',['operacion'=>'agregar','tipo'=>'actividad','elemento'=>['nombre'=>$activity['nombre'],'fecha'=>$start,'personas'=>2,'precio'=>0]],$token);
    check($status===200 && count($state['actividades'])===1,'Actividad guardada');
    [$status,$orders]=callApi('pedidos',null,$token); check(abs((float)$orders['pedidos'][0]['total']-($expected+2*$activity['precio']))<0.01,'Pedido incluye actividades sin confiar en precio enviado');
    [$status,$state]=callApi('viaje',['operacion'=>'favorito','tipo'=>'actividad','nombre'=>$activity['nombre']],$token); check($status===200 && count($state['favoritosActividades'])===1,'Favoritos guardados');
    [$status,$state]=callApi('viaje',['operacion'=>'agregar','tipo'=>'restaurante','elemento'=>['nombre'=>$zone['restaurantes'][0]['nombre'],'fecha'=>$start]],$token); check($status===200 && count($state['restaurantes'])===1,'Restaurante guardado');
    [$status]=callApi('viaje',['operacion'=>'agregar','tipo'=>'actividad','elemento'=>['nombre'=>$activity['nombre'],'fecha'=>'01/01/2020','personas'=>1]],$token); check($status===422,'Itinerario fuera de estancia rechazado');
    [$status,$state]=callApi('viaje',null,$token); check(count($state['actividades'])===1 && $state['actividades'][0]['fecha']===$start,'Error no modifica viaje');
    [$status]=callApi('mensajes',['pregunta'=>'Prueba de historial','respuesta'=>'Respuesta local de prueba'],$token); check($status===200,'Historial guardado');
    [$status,$history]=callApi('mensajes',null,$token); check($status===200 && count($history['mensajes'])===2,'Historial recuperado');
    $data2=['nombre'=>'Segundo cliente','correo'=>"test2-$tag@relax.invalid",'contrasena'=>'Prueba123!'];
    callApi('registro',$data2); $uid2=(int)query('SELECT id FROM usuarios WHERE correo=?',[$data2['correo']])->fetchColumn(); $ids[]=$uid2;
    [, $second]=callApi('login',$data2); $token2=$second['token'];
    [$status,$other]=callApi('viaje',null,$token2); check($other['hospedaje']===null && !$other['favoritosActividades'],'Aislamiento de viajes y favoritos');
    [$status,$other]=callApi('metodos',null,$token2); check(!$other['metodos'],'Aislamiento de métodos');
    [$status]=callApi('viaje',['operacion'=>'reservar','elemento'=>$h],$token2); check($status===422,'No se puede usar el método de otro cliente');
    [$status,$other]=callApi('viaje',null,$token2); check($other['hospedaje']===null,'Reserva ajena rechazada sin escritura parcial');
    $adminText=file_get_contents(dirname(__DIR__).'/api/admin-inicial.local.txt');
    preg_match('/Correo: (.+)/',$adminText,$email); preg_match('/Contraseña inicial: (.+)/u',$adminText,$pw);
    [$status,$admin]=callApi('login',['correo'=>trim($email[1]),'contrasena'=>trim($pw[1])]); check($status===200,'Login administrador');
    $business=['nombre'=>'Empresa prueba','correo'=>"empresa-$tag@relax.invalid",'contrasena'=>'Prueba123!','negocio'=>'Negocio de integración'];
    [$status,$created]=callApi('crear_empresa',$business,$admin['token']); $ids[]=(int)($created['usuario']['id']??0); check($status===201 && $created['usuario']['rol']==='empresario','Solo administrador da de alta empresa');
    [$status,$company]=callApi('login',$business); check($status===200 && $company['usuario']['rol']==='empresario','Acceso empresario desde sus credenciales');
    [$status]=callApi('logout',[],$token); check($status===200,'Cerrar sesión');
    [$status]=callApi('viaje',null,$token); check($status===401,'Token revocado rechazado');
    [, $again]=callApi('login',$data);
    [$status,$saved]=callApi('viaje',null,$again['token']); check($status===200 && $saved['hospedaje']['id']===$hotel['id'] && count($saved['actividades'])===1,'Viaje recuperado después de cerrar sesión');
    foreach(['api/config.local.php','api/admin-inicial.local.txt','database/schema.sql','scripts/setup-database.php'] as $path) {
        $context=stream_context_create(['http'=>['ignore_errors'=>true]]);
        file_get_contents('http://localhost/RELAX-Mobile/'.$path,false,$context);
        check(strpos($http_response_header[0],'403')!==false,'Archivo privado protegido: '.$path);
    }
    echo "Pruebas superadas: $checks.\n";
} finally {
    foreach($ids as $id) {
        if(!$id) continue;
        query('DELETE m FROM mensajes m JOIN conversaciones c ON c.id=m.conversacion_id WHERE c.usuario_id=?',[$id]);
        query('DELETE FROM conversaciones WHERE usuario_id=?',[$id]);
        query('DELETE p FROM pagos p JOIN pedidos o ON o.id=p.pedido_id WHERE o.usuario_id=?',[$id]);
        query('DELETE i FROM itinerario i JOIN viajes v ON v.id=i.viaje_id WHERE v.usuario_id=?',[$id]);
        query('DELETE r FROM reservas_hospedaje r JOIN viajes v ON v.id=r.viaje_id WHERE v.usuario_id=?',[$id]);
        query('DELETE d FROM pedido_detalles d JOIN pedidos o ON o.id=d.pedido_id WHERE o.usuario_id=?',[$id]);
        query('DELETE FROM pedidos WHERE usuario_id=?',[$id]); query('DELETE FROM viajes WHERE usuario_id=?',[$id]);
        query('DELETE FROM metodos_pago WHERE usuario_id=?',[$id]); query('DELETE FROM favoritos WHERE usuario_id=?',[$id]);
        query('DELETE FROM sesiones WHERE usuario_id=?',[$id]); query('DELETE FROM negocios WHERE propietario_id=?',[$id]); query('DELETE FROM usuarios WHERE id=?',[$id]);
    }
    if(isset($admin['token'])) callApi('logout',[],$admin['token']);
    echo "Cuentas y datos de prueba eliminados.\n";
}
