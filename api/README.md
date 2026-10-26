# API local de RELAX

Implementada en PHP 8 y PDO sobre la base `relax` de MariaDB de XAMPP (puerto 3307). Apache atiende `http://localhost/RELAX-Mobile/api/index.php?accion=...`. La app web en XAMPP consume esta dirección; Expo web local también está permitido mediante CORS con origen explícito.

## Estado y acceso

La base ya está creada y los catálogos originales ya están importados. Las cuentas de demostración anteriores no existen en la base: se sustituyeron por autenticación real. El administrador inicial es `administrador@relax.local`; su contraseña aleatoria está en el archivo privado [admin-inicial.local.txt](admin-inicial.local.txt). No copiar ese archivo ni `config.local.php` a un repositorio o compartirlo. Apache impide descargarlos.

El registro público crea únicamente clientes desde la página principal. Las empresas las da de alta exclusivamente un administrador autenticado. La API fija el rol; los campos enviados por un cliente nunca pueden elevar sus permisos. Las pantallas específicas de administrador y empresario siguen pendientes, como se había definido; no se añadieron en esta integración.

## Endpoints

Todos devuelven JSON. POST requiere `Content-Type: application/json`. Errores: `{ "error": "mensaje" }` y un estado HTTP distinto de 2xx.

| Acción `accion=` | Método | Permisos y datos |
| --- | --- | --- |
| salud | GET | Público; comprueba conexión |
| catalogos | GET | Público; zonas, hospedajes, actividades, restaurantes y lugares de MariaDB |
| registro | POST | Público; `nombre`, `correo`, `contrasena`, `telefono` opcional; solo cliente |
| login | POST | `correo`, `contrasena`; devuelve usuario y token; cookie HttpOnly para web |
| sesion | GET | Recupera usuario desde cookie/token; null si no existe sesión |
| logout | POST | Sesión; revoca token y elimina cookie |
| crear_empresa | POST | Solo administrador; `nombre`, `correo`, `contrasena`, `telefono` opcional, `negocio`; crea empresario y negocio en transacción |
| metodos | GET/POST | Cliente; POST `tipo`, `titular` y `ultimos4` para tarjeta; solo metadatos de prueba |
| viaje | GET/POST | Cliente; GET recupera viaje y favoritos; POST aplica operación y devuelve estado confirmado |
| pedidos | GET | Historial de pedidos del usuario autenticado |
| mensajes | GET/POST | Cliente; historial propio, POST `pregunta` y `respuesta` del asistente de reglas |

Operaciones POST de `viaje`:

- `{ "operacion": "reservar", "elemento": { "id": "slug-hospedaje", "fechaLlegada": "dd/mm/aaaa", "fechaSalida": "dd/mm/aaaa", "huespedes": 1, "metodoPagoId": "id-propio" } }`.
- `{ "operacion": "eliminarHospedaje" }`: cancela el viaje activo y conserva su historial.
- `{ "operacion": "agregar", "tipo": "actividad|restaurante|lugar", "elemento": { "nombre": "nombre-del-catalogo", "fecha": "dd/mm/aaaa", "personas": 1 } }`.
- `{ "operacion": "eliminar", "tipo": "actividad|restaurante|lugar", "nombre": "nombre-del-catalogo" }`.
- `{ "operacion": "favorito", "tipo": "actividad|restaurante", "nombre": "nombre-del-catalogo" }`: alterna favorito.

`crear_empresa` se puede invocar desde un cliente de API usando `Authorization: Bearer <token de la sesión del administrador>`. Ningún cliente ni empresario puede usar ese endpoint. La futura interfaz administrativa consumirá esa misma operación.

## Sesiones y configuración

En web se restaura la sesión con cookie HttpOnly, SameSite=Lax, limitada a la ruta de la API. El token se almacena como hash en la base y expira en siete días; no se guarda en localStorage. La app también admite Bearer en memoria para móvil. La app nativa necesita `EXPO_PUBLIC_API_URL=http://IP_DE_LA_PC/RELAX-Mobile/api`; no usar localhost desde un teléfono. No se ha realizado prueba física móvil. Para web desde otra máquina, agregar su origen exacto a `allowed_origins` dentro de `config.local.php`. No usar CORS con `*` para sesiones.

En local se usa HTTP. Antes de publicar: HTTPS, configuración del servidor, recuperación/verificación de cuentas, gestión de contraseñas, monitoreo y una revisión de seguridad de despliegue. No se implementó correo transaccional. El administrador inicial debe cambiar su contraseña antes de publicar, mediante un proceso administrativo seguro.

## Datos persistidos y límites

Se recuperan por usuario: perfil, sesión, métodos, favoritos, hospedaje, itinerario e historial del asistente. La lista original de catálogos queda como fuente para reinstalar/importar, pero las pantallas consumen MariaDB por la API.

Los precios enviados por la app se ignoran; el servidor obtiene el precio del catálogo y recalcula noches/personas. Cada modificación del itinerario genera un nuevo pedido pendiente y cancela el borrador anterior; se conserva el historial. No se cobran restaurantes ni lugares, igual que antes. Los pagos se registran como pendientes: no hay pasarela ni cargos reales y tampoco se promete disponibilidad hotelera en tiempo real. Las tarjetas solo guardan titular/terminación, nunca número completo ni CVV.

El asistente sigue generando respuestas por reglas; la API conserva su historial sin simular conexión a IA. Los borrados de viaje cancelan datos históricos en lugar de eliminarlos.

## Reinstalar y verificar

Con MariaDB de XAMPP encendido en 3307, desde la raíz:

```powershell
node scripts/export-seed.js
& C:\xampp\php\php.exe scripts/setup-database.php
& C:\xampp\php\php.exe scripts/seed-database.php
& C:\xampp\php\php.exe scripts/test-api.php
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run export:xampp
```

El instalador no borra tablas y omite importar el esquema si la base ya contiene tablas. El catálogo se importa una sola vez con marca de importación. En una instalación distinta, configurar `RELAX_DB_ADMIN_USER` y `RELAX_DB_ADMIN_PASSWORD` para el instalador si root requiere contraseña. El usuario de ejecución `relax_app` solo recibe SELECT/INSERT/UPDATE/DELETE sobre `relax`; su configuración se genera en el archivo privado.

Las pruebas usan cuentas temporales propias, comprueban permisos, sesiones, persistencia, precios y aislamiento, y eliminan sus datos al terminar. No sustituyen pruebas visuales ni pruebas físicas de Android/iOS.

En una copia SQL importada no se entrega `admin-inicial.local.txt`. Para ejecutar `scripts/test-api.php` allí, definir `RELAX_TEST_ADMIN_EMAIL` y `RELAX_TEST_ADMIN_PASSWORD` con el acceso del administrador importado y quitarlas de la consola al terminar. No se requieren para usar normalmente la aplicación.
