<?php
function activeTrip(int $uid): ?array {
    return query('SELECT * FROM viajes WHERE usuario_id=? AND estado IN ("borrador","confirmado") ORDER BY id DESC LIMIT 1',[$uid])->fetch() ?: null;
}
function tripState(int $uid): array {
    $state=['hospedaje'=>null,'actividades'=>[],'restaurantes'=>[],'lugares'=>[],'favoritosActividades'=>[],'favoritosRestaurantes'=>[]];
    foreach(query('SELECT s.tipo,s.nombre FROM favoritos f JOIN servicios s ON s.id=f.servicio_id WHERE f.usuario_id=?',[$uid])->fetchAll() as $f) {
        if($f['tipo']==='actividad') $state['favoritosActividades'][]=$f['nombre'];
        if($f['tipo']==='restaurante') $state['favoritosRestaurantes'][]=$f['nombre'];
    }
    $trip=activeTrip($uid); if(!$trip) return $state;
    $h=query('SELECT r.*,s.slug,s.nombre,s.calificacion_catalogo,z.nombre AS zona FROM reservas_hospedaje r JOIN servicios s ON s.id=r.hospedaje_id JOIN zonas z ON z.id=s.zona_id WHERE r.viaje_id=? AND r.estado<>"cancelada"',[$trip['id']])->fetch();
    $order=query('SELECT * FROM pedidos WHERE viaje_id=? AND estado<>"cancelado" ORDER BY id DESC LIMIT 1',[$trip['id']])->fetch();
    if($h) $state['hospedaje']=['id'=>$h['slug'],'nombre'=>$h['nombre'],'ubicacion'=>$h['zona'],'precio'=>$h['precio_noche'],'calificacion'=>$h['calificacion_catalogo'],'fechaLlegada'=>displayDate($h['fecha_llegada']),'fechaSalida'=>displayDate($h['fecha_salida']),'huespedes'=>(int)$h['huespedes'],'metodoPago'=>$order?methodLabel($order['metodo_tipo_snapshot'],$order['metodo_terminacion_snapshot']):null,'metodoPagoId'=>$order?(string)$order['metodo_pago_id']:null];
    foreach(query('SELECT i.*,s.nombre,s.tipo,s.categoria,s.descripcion,s.calificacion_catalogo,z.nombre AS zona,a.duracion_minutos FROM itinerario i JOIN servicios s ON s.id=i.servicio_id JOIN zonas z ON z.id=s.zona_id LEFT JOIN actividades a ON a.servicio_id=s.id WHERE i.viaje_id=? ORDER BY i.fecha,i.orden,i.id',[$trip['id']])->fetchAll() as $i) {
        $item=['nombre'=>$i['nombre'],'ubicacion'=>$i['zona'],'tipo'=>$i['categoria'],'fecha'=>displayDate($i['fecha'])];
        if($i['tipo']==='actividad') $state['actividades'][]=$item+['duracion'=>($i['duracion_minutos']/60).' horas','precio'=>(float)$i['precio_persona'],'personas'=>(int)$i['personas']];
        elseif($i['tipo']==='restaurante') $state['restaurantes'][]=$item+['calificacion'=>$i['calificacion_catalogo']];
        else $state['lugares'][]=$item+['descripcion'=>$i['descripcion']];
    }
    return $state;
}
function methodLabel(?string $type, ?string $last): string {
    $names=['credito'=>'Tarjeta de crédito','debito'=>'Tarjeta de débito','efectivo'=>'Efectivo al llegar','transferencia'=>'Transferencia bancaria','oxxo'=>'Pago en OXXO'];
    return ($names[$type]??'Método de pago').($last?" •••• $last":'');
}
function rebuildOrder(array $trip, ?int $methodId=null): void {
    $reservation=query('SELECT r.*,s.nombre FROM reservas_hospedaje r JOIN servicios s ON s.id=r.hospedaje_id WHERE r.viaje_id=?',[$trip['id']])->fetch();
    if(!$reservation) return;
    if(!$methodId) $methodId=(int)query('SELECT metodo_pago_id FROM pedidos WHERE viaje_id=? ORDER BY id DESC LIMIT 1',[$trip['id']])->fetchColumn();
    $m=query('SELECT * FROM metodos_pago WHERE id=? AND usuario_id=? AND activo=1',[$methodId,$trip['usuario_id']])->fetch();
    if(!$m) fail('Selecciona un método de pago guardado.');
    $nights=(new DateTimeImmutable($reservation['fecha_llegada']))->diff(new DateTimeImmutable($reservation['fecha_salida']))->days;
    $lines=[['service'=>$reservation['hospedaje_id'],'name'=>$reservation['nombre'],'unit'=>'noche','qty'=>$nights,'price'=>$reservation['precio_noche'],'reservation'=>$reservation['id']]];
    foreach(query('SELECT i.*,s.nombre FROM itinerario i JOIN servicios s ON s.id=i.servicio_id WHERE i.viaje_id=? AND s.tipo="actividad"',[$trip['id']])->fetchAll() as $i) $lines[]=['service'=>$i['servicio_id'],'name'=>$i['nombre'],'unit'=>'persona','qty'=>$i['personas'],'price'=>$i['precio_persona'],'itinerary'=>$i['id']];
    $totalCents=0; foreach($lines as $l) $totalCents+=(int)round((float)$l['price']*100)*$l['qty'];
    query('UPDATE pagos p JOIN pedidos o ON o.id=p.pedido_id SET p.estado="cancelado" WHERE o.viaje_id=? AND p.estado="pendiente"',[$trip['id']]);
    query('UPDATE pedidos SET estado="cancelado" WHERE viaje_id=? AND estado="pendiente"',[$trip['id']]);
    query('INSERT INTO pedidos(usuario_id,viaje_id,metodo_pago_id,metodo_tipo_snapshot,metodo_terminacion_snapshot,total) VALUES(?,?,?,?,?,?)',[$trip['usuario_id'],$trip['id'],$m['id'],$m['tipo'],$m['ultimos4'],$totalCents/100]);
    $oid=(int)db()->lastInsertId();
    foreach($lines as $l) {
        query('INSERT INTO pedido_detalles(pedido_id,servicio_id,nombre_snapshot,unidad,cantidad,precio_unitario) VALUES(?,?,?,?,?,?)',[$oid,$l['service'],$l['name'],$l['unit'],$l['qty'],$l['price']]);
        $lineId=(int)db()->lastInsertId();
        if(isset($l['reservation'])) query('UPDATE reservas_hospedaje SET pedido_detalle_id=? WHERE id=?',[$lineId,$l['reservation']]);
        else query('UPDATE itinerario SET pedido_detalle_id=? WHERE id=?',[$lineId,$l['itinerary']]);
    }
    if($totalCents>0) query('INSERT INTO pagos(pedido_id,tipo,clave_idempotencia,importe) VALUES(?,?,?,?)',[$oid,$m['tipo'],bin2hex(random_bytes(24)),$totalCents/100]);
}
function mutateTrip(int $uid, array $b): array {
    return atomic(function() use($uid,$b) {
        query('SELECT id FROM usuarios WHERE id=? FOR UPDATE',[$uid]);
        $trip=activeTrip($uid); $op=$b['operacion']??''; $item=$b['elemento']??[];
        if($op==='favorito') {
            $type=$b['tipo']??'';
            if(!in_array($type,['actividad','restaurante'],true)) fail('Tipo inválido.');
            $s=query('SELECT id FROM servicios WHERE nombre=? AND tipo=? AND activo=1',[$b['nombre']??'',$type])->fetch();
            if(!$s) fail('Servicio no encontrado.');
            $found=query('SELECT 1 FROM favoritos WHERE usuario_id=? AND servicio_id=?',[$uid,$s['id']])->fetchColumn();
            if($found) query('DELETE FROM favoritos WHERE usuario_id=? AND servicio_id=?',[$uid,$s['id']]);
            else query('INSERT INTO favoritos(usuario_id,servicio_id) VALUES(?,?)',[$uid,$s['id']]);
        } elseif($op==='reservar') {
            $h=query('SELECT s.*,h.capacidad,z.nombre AS zona FROM servicios s JOIN hospedajes h ON h.servicio_id=s.id JOIN zonas z ON z.id=s.zona_id WHERE s.slug=? AND s.activo=1',[$item['id']??''])->fetch();
            if(!$h) fail('Hospedaje no disponible.');
            $start=isoDate($item['fechaLlegada']??''); $end=isoDate($item['fechaSalida']??''); $people=filter_var($item['huespedes']??0,FILTER_VALIDATE_INT);
            if($start<date('Y-m-d') || $end<=$start || $people<1 || $people>$h['capacidad']) fail('Revisa fechas y capacidad del hospedaje.');
            if((new DateTimeImmutable($start))->diff(new DateTimeImmutable($end))->days>366) fail('La estancia máxima es de 366 noches.');
            if($trip && $trip['zona_id']!=$h['zona_id']) { cancelTrip($trip); $trip=null; }
            if(!$trip) {
                query('INSERT INTO viajes(usuario_id,zona_id,nombre,fecha_inicio,fecha_fin) VALUES(?,?,?,?,?)',[$uid,$h['zona_id'],'Mi viaje a '.$h['zona'],$start,$end]);
                $trip=activeTrip($uid);
            } else {
                if(query('SELECT 1 FROM itinerario WHERE viaje_id=? AND (fecha<? OR fecha>=?) LIMIT 1',[$trip['id'],$start,$end])->fetchColumn()) fail('Hay selecciones fuera de las nuevas fechas. Elimínalas o ajusta la estancia.');
                query('UPDATE viajes SET fecha_inicio=?,fecha_fin=? WHERE id=?',[$start,$end,$trip['id']]);
            }
            query('INSERT INTO reservas_hospedaje(viaje_id,hospedaje_id,fecha_llegada,fecha_salida,huespedes,precio_noche) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE hospedaje_id=VALUES(hospedaje_id),fecha_llegada=VALUES(fecha_llegada),fecha_salida=VALUES(fecha_salida),huespedes=VALUES(huespedes),precio_noche=VALUES(precio_noche)',[$trip['id'],$h['id'],$start,$end,$people,$h['precio_base']]);
            rebuildOrder($trip,(int)($item['metodoPagoId']??0));
        } elseif($op==='eliminarHospedaje') { if($trip) cancelTrip($trip); }
        elseif(in_array($op,['agregar','eliminar'],true)) {
            if(!$trip) fail('Primero selecciona tu hospedaje.');
            $type=$b['tipo']??'';
            if(!in_array($type,['actividad','restaurante','lugar'],true)) fail('Tipo inválido.');
            $s=query('SELECT * FROM servicios WHERE zona_id=? AND nombre=? AND tipo=? AND activo=1',[$trip['zona_id'],$item['nombre']??$b['nombre']??'',$type])->fetch();
            if(!$s) fail('El servicio no pertenece a la zona del viaje.');
            if($op==='eliminar') query('DELETE FROM itinerario WHERE viaje_id=? AND servicio_id=?',[$trip['id'],$s['id']]);
            else {
                $date=isoDate($item['fecha']??displayDate($trip['fecha_inicio']));
                if($date<$trip['fecha_inicio']||$date>=$trip['fecha_fin']) fail('La fecha debe estar dentro de tu estancia.');
                $people=filter_var($item['personas']??1,FILTER_VALIDATE_INT);
                if($people<1 || $people>100) fail('Cantidad de personas inválida.');
                query('INSERT INTO itinerario(viaje_id,servicio_id,fecha,personas,precio_persona) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE fecha=VALUES(fecha),personas=VALUES(personas),precio_persona=VALUES(precio_persona)',[$trip['id'],$s['id'],$date,$people,$type==='actividad'?$s['precio_base']:0]);
            }
            rebuildOrder($trip);
        } else fail('Operación desconocida.');
        return tripState($uid);
    });
}
function cancelTrip(array $trip): void {
    query('UPDATE viajes SET estado="cancelado" WHERE id=?',[$trip['id']]);
    query('UPDATE reservas_hospedaje SET estado="cancelada" WHERE viaje_id=?',[$trip['id']]);
    query('UPDATE pagos p JOIN pedidos o ON o.id=p.pedido_id SET p.estado="cancelado" WHERE o.viaje_id=? AND p.estado="pendiente"',[$trip['id']]);
    query('UPDATE pedidos SET estado="cancelado" WHERE viaje_id=? AND estado="pendiente"',[$trip['id']]);
}
