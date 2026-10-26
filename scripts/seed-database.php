<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(403); exit; }
require dirname(__DIR__) . '/api/bootstrap.php';
if (query('SELECT COUNT(*) FROM catalogo_importacion')->fetchColumn()) { echo "Catálogo ya importado; se conserva.\n"; exit; }
$data = json_decode(file_get_contents(dirname(__DIR__) . '/database/seed.local.json'), true, 512, JSON_THROW_ON_ERROR);
atomic(function () use ($data) {
    $zones = [];
    foreach ($data['zonas'] as $zone) {
        query('INSERT INTO zonas(slug,nombre,resumen,emoji) VALUES(?,?,?,?)', [$zone['id'],$zone['nombre'],$zone['resumen'],$zone['emoji']]);
        $zones[$zone['nombre']] = (int)db()->lastInsertId();
        foreach (['actividades'=>'actividad','restaurantes'=>'restaurante','lugares'=>'lugar'] as $key=>$type) {
            foreach ($zone[$key] as $index=>$item) {
                if (is_string($item)) $item = ['nombre'=>$item,'descripcion'=>$item];
                query('INSERT INTO servicios(zona_id,tipo,slug,nombre,categoria,descripcion,precio_base,calificacion_catalogo,emoji) VALUES(?,?,?,?,?,?,?,?,?)', [$zones[$zone['nombre']],$type,"$type-{$zone['id']}-$index",$item['nombre'],$item['tipo']??$type,$item['descripcion']??'', $item['precio']??$item['precioPromedio']??0,$item['calificacion']??null,$item['emoji']??null]);
                $id = (int)db()->lastInsertId();
                if ($type === 'actividad') {
                    preg_match('/([0-9]+(?:\.[0-9]+)?)/', $item['duracion'], $m);
                    $minutes = max(1,(int)round((float)($m[1]??1)*(stripos($item['duracion'],'hora')!==false?60:1)));
                    query('INSERT INTO actividades VALUES(?,?)',[$id,$minutes]);
                }
                if ($type === 'restaurante') query('INSERT INTO restaurantes VALUES(?,?,?)',[$id,$item['tipo'],$item['menu']]);
                if (isset($item['imagen']['uri'])) query('INSERT INTO imagenes_servicio(servicio_id,url) VALUES(?,?)',[$id,$item['imagen']['uri']]);
            }
        }
    }
    foreach ($data['hospedajes'] as $h) {
        query('INSERT INTO servicios(zona_id,tipo,slug,nombre,categoria,descripcion,direccion,precio_base,calificacion_catalogo) VALUES(?,"hospedaje",?,?,?,?,?,?,?)',[$zones[$h['zona']],$h['id'],$h['nombre'],$h['tipo'],$h['descripcion'],$h['ubicacion'],$h['precio'],$h['calificacion']]);
        $id=(int)db()->lastInsertId();
        query('INSERT INTO hospedajes VALUES(?,?,?,?,?,?,?)',[$id,$h['habitacion'],$h['capacidad'],$h['camas'],$h['banos'],$h['checkIn'],$h['checkOut']]);
        foreach ($h['imagenes'] as $i=>$url) query('INSERT INTO imagenes_servicio(servicio_id,url,orden) VALUES(?,?,?)',[$id,$url,$i]);
        foreach ($h['politicas'] as $i=>$text) query('INSERT INTO politicas_hospedaje(hospedaje_id,descripcion,orden) VALUES(?,?,?)',[$id,$text,$i]);
        foreach ($h['servicios'] as $name) {
            query('INSERT IGNORE INTO amenidades(nombre) VALUES(?)',[$name]);
            $aid=query('SELECT id FROM amenidades WHERE nombre=?',[$name])->fetchColumn();
            query('INSERT INTO hospedaje_amenidades VALUES(?,?)',[$id,$aid]);
        }
    }
    query('INSERT INTO catalogo_importacion VALUES(1,NOW())');
});
echo "Catálogos importados desde los archivos originales.\n";
