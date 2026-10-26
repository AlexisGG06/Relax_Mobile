# RELAX Mobile

Aplicación de turismo en Hidalgo con Expo SDK 57, React Native, Expo Router y TypeScript. La única versión activa está en `C:\xampp\htdocs\RELAX-Mobile`; el inicio es `src/app/index.tsx`.

## Ejecutar en XAMPP

Encender Apache y MariaDB de XAMPP (puerto 3307) y abrir http://localhost/RELAX-Mobile/dist/iniciar-sesion. La base `relax` ya está creada y conectada. Después de modificar el frontend:

```powershell
npm.cmd run export:xampp
```

Para desarrollo: `npm.cmd run web -- --port 8083` y abrir http://localhost:8083. Apache y MariaDB deben seguir encendidos porque proporcionan la API y los datos.

## Acceso y cuentas

El registro público desde la página principal crea solamente clientes. Al completar el registro se inicia sesión automáticamente y se abre el inicio con el mensaje «Cuenta creada exitosamente». Si falla el acceso automático después de crear la cuenta, se permite iniciar sesión manualmente sin repetir el registro. El inicio de sesión usa correo y contraseña, y obtiene el rol de la base. Solo un administrador autenticado puede dar de alta empresas mediante la API `crear_empresa`. Las pantallas específicas de administrador y empresario siguen pendientes; no se añadieron paneles nuevos.

El administrador inicial es `administrador@relax.local`. Su contraseña aleatoria está en el archivo privado `api/admin-inicial.local.txt`. La configuración de la base está en `api/config.local.php`. Ambos se excluyen de Git y están bloqueados en Apache. Las antiguas cuentas de demostración ya no se utilizan.

## Datos conectados

La API PHP lee los catálogos desde MariaDB y guarda por usuario: perfil, sesiones, métodos de pago, favoritos, hospedaje, itinerario, pedidos e historial del asistente. Los datos se recuperan al volver a iniciar sesión. La app no incluye credenciales de MariaDB.

Las contraseñas se guardan con hash y la sesión web se restaura con cookie HttpOnly. La API valida permisos, propiedad, fechas, capacidad y precios. El asistente conserva sus respuestas por reglas y guarda su historial.

Los métodos permiten tarjetas de prueba (solo titular y últimos cuatro dígitos), efectivo, transferencia y OXXO. Pedidos y pagos quedan pendientes: no existe pasarela, cargos reales ni inventario hotelero en tiempo real. Los consumos de restaurantes y lugares siguen fuera del total, igual que en el prototipo.

## Estructura

- `src/app/`: pantallas y rutas de Expo Router.
- `src/context/`: sesión, catálogos, viaje y métodos conectados a la API.
- `src/services/api.ts`: cliente HTTP compartido; para teléfono físico configurar `EXPO_PUBLIC_API_URL` con la IP de la computadora.
- `src/data/`: fuente original para importar catálogos; las pantallas consultan MariaDB.
- `api/`: backend PHP y su documentación.
- `database/`: esquema y relaciones.
- `scripts/`: instalación, importación, pruebas e integración de XAMPP.
- `assets/`: imágenes e iconos.

## Comandos y documentación

- `npm.cmd ci`: instalar dependencias.
- `npm.cmd run typecheck`: comprobar TypeScript.
- `npm.cmd run lint`: revisar código.
- `npm.cmd run android` / `ios`: abrir plataforma configurada; simulador iOS requiere macOS.
- `npx.cmd expo install --check`: comprobar compatibilidad.
- `npm.cmd run export:xampp`: generar la web con ruta base de XAMPP.

Ver [api/README.md](api/README.md) para endpoints, instalación, configuración y pruebas. Ver [database/ESTRUCTURA.md](database/ESTRUCTURA.md) y [database/schema.sql](database/schema.sql) para las 23 tablas del diseño más dos auxiliares de la API.
