# Instalar la copia de RELAX en otro equipo

Esta entrega contiene el código completo, la web ya compilada en `dist/` y `database/relax-export.sql`, una copia de la base actual con sus cuentas y datos. Las sesiones y los intentos fallidos de acceso se entregan vacíos: cada persona deberá iniciar sesión. No se incluyen credenciales de conexión del equipo de origen.

## 1. Preparar XAMPP

Instalar XAMPP con Apache, PHP 8 y MariaDB 10.4 o posterior. La versión de origen es MariaDB 10.4.32 y PHP 8.0.30. Se recomienda usar MariaDB de XAMPP, no otro servidor MySQL ajeno a XAMPP.

Extraer el ZIP para que el proyecto quede exactamente así:

```text
C:\xampp\htdocs\RELAX-Mobile\
  api\index.php
  database\relax-export.sql
  dist\index.html
  scripts\setup-database.php
  src\
```

Evitar una carpeta doble `RELAX-Mobile\RELAX-Mobile`. No renombrar la carpeta: la compilación ya tiene la ruta `/RELAX-Mobile/dist`.

Encender Apache y MySQL/MariaDB en el panel de XAMPP. Anotar el puerto de MariaDB: suele ser 3306; en el equipo de origen se usa 3307. Apache se supone en el puerto 80.

## 2. Importar la base actual

1. Abrir http://localhost/phpmyadmin/ y comprobar que se está usando el servidor de MariaDB de XAMPP.
2. Crear una base vacía llamada **relax**, con cotejamiento `utf8mb4_unicode_ci`.
3. Seleccionar esa base y entrar en **Importar**.
4. Elegir `database/relax-export.sql` de esta entrega y ejecutar la importación.
5. Comprobar que aparecen **25 tablas**.

Importar una sola vez en una base vacía. El archivo no elimina tablas existentes: si ya hay una base relax con información propia, respaldarla y usar una instalación separada antes de continuar. No importar también `schema.sql`: ya está incluido el esquema completo en la exportación.

No ejecutar los scripts de seed al usar esta copia: los catálogos y la marca de importación ya están en el SQL.

## 3. Generar la conexión local

Abrir PowerShell y ejecutar, ajustando solo el puerto si es necesario:

```powershell
cd C:\xampp\htdocs\RELAX-Mobile
$env:RELAX_DB_PORT = '3306'
& C:\xampp\php\php.exe scripts/setup-database.php
```

Si MariaDB usa 3307, cambiar `'3306'` por `'3307'`. El instalador conserva la base importada y genera `api/config.local.php` con una contraseña nueva para el usuario técnico local `relax_app`. Requiere una cuenta de MariaDB con permiso para crear ese usuario y conceder permisos.

XAMPP suele tener `root` sin contraseña en local. Si se configuró otra cuenta/contraseña, definir `RELAX_DB_ADMIN_USER` y `RELAX_DB_ADMIN_PASSWORD` antes de ejecutar el instalador; no escribirlas en archivos compartidos. Al terminar se pueden quitar de la consola con:

```powershell
Remove-Item Env:RELAX_DB_ADMIN_USER -ErrorAction SilentlyContinue
Remove-Item Env:RELAX_DB_ADMIN_PASSWORD -ErrorAction SilentlyContinue
```

No copiar el `config.local.php` de otro equipo. Si la instalación indica que conserva la base existente, es correcto. Como la copia ya contiene al administrador, no genera otro ni crea un archivo nuevo con su contraseña.

## 4. Abrir la aplicación

Primero comprobar que la API responde:

http://localhost/RELAX-Mobile/api/index.php?accion=salud

Debe devolver `{"ok":true,"database":"relax"}`. Después abrir:

**http://localhost/RELAX-Mobile/dist/iniciar-sesion**

La entrega ya incluye `dist/`, por lo que no hace falta Node.js para probarla desde XAMPP.

## 5. Cuentas incluidas

Se conservan las cuentas existentes y sus contraseñas, porque la exportación incluye sus hashes. El remitente debe facilitar las contraseñas por separado; no están escritas en este paquete. Cuentas de administrador y empresa conocidas:

- Administrador: `administrador@relax.local`.
- Empresa: `empresa@relax.local`.

El registro público permite crear nuevas cuentas de cliente. Solo un administrador autenticado puede crear empresas mediante la API. Los paneles específicos de administrador y empresario todavía están pendientes; al entrar con esas cuentas aparece su aviso, no una pantalla de gestión. Los pagos siguen pendientes y no realizan cobros reales.

Las bases quedan independientes: los cambios posteriores en un equipo no se replican a los demás.

## 6. Para modificar el proyecto

Instalar Node.js 22.13 o posterior (en origen se usa Node 24). Desde la carpeta raíz:

```powershell
npm.cmd ci
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run export:xampp
```

Después de cambiar el frontend, repetir `npm.cmd run export:xampp` y recargar el navegador. Para desarrollo con Expo: `npm.cmd run web -- --port 8083`; Apache y MariaDB deben seguir encendidos.

## Problemas frecuentes

- **No se pudo conectar con XAMPP:** comprobar Apache, MariaDB y el puerto de `config.local.php`.
- **Access denied al ejecutar el instalador:** revisar la cuenta administrativa de MariaDB y su contraseña.
- **Plugin caching_sha2_password:** se está accediendo a otro MySQL; seleccionar el puerto de MariaDB de XAMPP.
- **Table already exists al importar:** se intentó importar en una base no vacía. No repetir ni borrar información sin respaldarla.
- **Pantalla sin botones o recursos 404:** comprobar el nombre exacto de la carpeta y usar `/RELAX-Mobile/dist/iniciar-sesion`.
- **Rutas sin extensión devuelven 404:** habilitar `mod_rewrite` y permitir `.htaccess` en Apache. Los `.htaccess` del paquete deben conservarse.
- **Apache usa otro puerto:** por ejemplo, con 8080 el enlace será `http://localhost:8080/...`; también se debe ajustar la dirección de la API mediante `EXPO_PUBLIC_API_URL` y volver a compilar. Para la instalación más sencilla usar Apache en 80.
- **Sesión anterior no aparece:** es normal; las sesiones no se trasladan. Iniciar sesión nuevamente.

Consultar `api/README.md` para los endpoints y `database/ESTRUCTURA.md` para el modelo. El SQL contiene cuentas y datos de la aplicación: entregar este ZIP solo a las personas que deban recibirlos.
