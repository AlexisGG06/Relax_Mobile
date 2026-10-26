<?php
function catalogos(): array {
    $services=query('SELECT s.*,z.nombre AS zona FROM servicios s JOIN zonas z ON z.id=s.zona_id WHERE s.activo=1 ORDER BY s.id')->fetchAll();
    $images=[];
    foreach(query('SELECT * FROM imagenes_servicio ORDER BY orden,id')->fetchAll() as $img) $images[$img['servicio_id']][]=$img['url'];
    $amenities=[];
    foreach(query('SELECT ha.hospedaje_id,a.nombre FROM hospedaje_amenidades ha JOIN amenidades a ON a.id=ha.amenidad_id ORDER BY a.id')->fetchAll() as $a) $amenities[$a['hospedaje_id']][]=$a['nombre'];
    $policies=[];
    foreach(query('SELECT * FROM politicas_hospedaje ORDER BY orden,id')->fetchAll() as $p) $policies[$p['hospedaje_id']][]=$p['descripcion'];
    $hotels=[]; $zones=[];
    $details=[];
    foreach(query('SELECT * FROM hospedajes')->fetchAll() as $h) $details[$h['servicio_id']]=$h;
    $activities=[];
    foreach(query('SELECT * FROM actividades')->fetchAll() as $a) $activities[$a['servicio_id']]=$a;
    $restaurants=[];
    foreach(query('SELECT * FROM restaurantes')->fetchAll() as $r) $restaurants[$r['servicio_id']]=$r;
    foreach(query('SELECT * FROM zonas WHERE activo=1 ORDER BY id')->fetchAll() as $z) {
        $zones[$z['id']]=['id'=>$z['slug'],'nombre'=>$z['nombre'],'emoji'=>$z['emoji'],'resumen'=>$z['resumen'],'hospedaje'=>['nombre'=>'','precio'=>0],'actividades'=>[],'restaurantes'=>[],'lugares'=>[]];
    }
    foreach($services as $s) {
        $id=$s['id']; $zid=$s['zona_id'];
        if (!isset($zones[$zid])) continue;
        if ($s['tipo']==='hospedaje' && isset($details[$id])) {
            $h=$details[$id];
            $hotels[]=['id'=>$s['slug'],'nombre'=>$s['nombre'],'zona'=>$s['zona'],'ubicacion'=>$s['direccion']?:$s['zona'],'precio'=>(float)$s['precio_base'],'calificacion'=>(float)$s['calificacion_catalogo'],'tipo'=>$s['categoria'],'habitacion'=>$h['habitacion'],'descripcion'=>$s['descripcion'],'imagenes'=>$images[$id]??[],'servicios'=>$amenities[$id]??[],'checkIn'=>substr($h['hora_entrada'],0,5),'checkOut'=>substr($h['hora_salida'],0,5),'capacidad'=>(int)$h['capacidad'],'camas'=>(int)$h['camas'],'banos'=>(int)$h['banos'],'politicas'=>$policies[$id]??[]];
            if (!$zones[$zid]['hospedaje']['nombre']) $zones[$zid]['hospedaje']=['nombre'=>$s['nombre'],'precio'=>(float)$s['precio_base']];
        } elseif($s['tipo']==='lugar') $zones[$zid]['lugares'][]=$s['nombre'];
        else {
            $item=['nombre'=>$s['nombre'],'tipo'=>$s['categoria'],'descripcion'=>$s['descripcion'],'emoji'=>$s['emoji'],'imagen'=>isset($images[$id][0])?['uri'=>$images[$id][0]]:null];
            if ($s['tipo']==='actividad' && isset($activities[$id])) {
                $mins=(int)$activities[$id]['duracion_minutos'];
                $zones[$zid]['actividades'][]=$item+['duracion'=>($mins/60).' horas','precio'=>(float)$s['precio_base']];
            } elseif ($s['tipo']==='restaurante' && isset($restaurants[$id])) $zones[$zid]['restaurantes'][]=$item+['menu'=>$restaurants[$id]['menu_descripcion'],'precioPromedio'=>(float)$s['precio_base'],'calificacion'=>(float)$s['calificacion_catalogo']];
        }
    }
    return ['hospedajes'=>$hotels,'zonas'=>array_values($zones)];
}
