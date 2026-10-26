-- RELAX: propuesta inicial para MariaDB 10.4+ / MySQL 8.0.16+.
-- Importar manualmente en una base VACIA seleccionada en phpMyAdmin.
-- No incluye CREATE DATABASE, DROP, usuarios, contraseñas ni datos personales.
SET NAMES utf8mb4;

CREATE TABLE roles (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(25) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO roles (id, nombre) VALUES (1, 'administrador'), (2, 'cliente'), (3, 'empresario');

CREATE TABLE usuarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  rol_id TINYINT UNSIGNED NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(191) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  estado ENUM('activo','pendiente','bloqueado') NOT NULL DEFAULT 'pendiente',
  correo_verificado_en DATETIME NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sesiones (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expira_en DATETIME NOT NULL,
  revocada_en DATETIME NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_sesiones_expira (expira_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE zonas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(120) NOT NULL,
  resumen TEXT NOT NULL,
  emoji VARCHAR(16),
  activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE negocios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  propietario_id BIGINT UNSIGNED NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  telefono VARCHAR(20),
  correo_contacto VARCHAR(191),
  estado ENUM('pendiente','aprobado','suspendido') NOT NULL DEFAULT 'pendiente',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (propietario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catálogo común: una zona y un negocio pueden tener muchos servicios.
-- Los lugares públicos pueden no pertenecer a un negocio.
CREATE TABLE servicios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  zona_id BIGINT UNSIGNED NOT NULL,
  negocio_id BIGINT UNSIGNED NULL,
  tipo ENUM('hospedaje','actividad','restaurante','lugar') NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  nombre VARCHAR(180) NOT NULL,
  categoria VARCHAR(80),
  descripcion TEXT NOT NULL,
  direccion VARCHAR(255),
  precio_base DECIMAL(12,2) NOT NULL DEFAULT 0,
  moneda CHAR(3) NOT NULL DEFAULT 'MXN',
  calificacion_catalogo DECIMAL(3,2) NULL,
  emoji VARCHAR(16),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (zona_id) REFERENCES zonas(id),
  FOREIGN KEY (negocio_id) REFERENCES negocios(id),
  CHECK (precio_base >= 0),
  CHECK (calificacion_catalogo BETWEEN 0 AND 5),
  INDEX idx_servicios_zona_tipo (zona_id, tipo, activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE imagenes_servicio (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  servicio_id BIGINT UNSIGNED NOT NULL,
  url VARCHAR(1024) NOT NULL,
  texto_alternativo VARCHAR(255),
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Una fila de hospedajes representa la opción/habitación vendible del catálogo actual.
CREATE TABLE hospedajes (
  servicio_id BIGINT UNSIGNED PRIMARY KEY,
  habitacion VARCHAR(150) NOT NULL,
  capacidad SMALLINT UNSIGNED NOT NULL,
  camas SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  banos SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  hora_entrada TIME NOT NULL,
  hora_salida TIME NOT NULL,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id),
  CHECK (capacidad > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE amenidades (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE hospedaje_amenidades (
  hospedaje_id BIGINT UNSIGNED NOT NULL,
  amenidad_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (hospedaje_id, amenidad_id),
  FOREIGN KEY (hospedaje_id) REFERENCES hospedajes(servicio_id) ON DELETE CASCADE,
  FOREIGN KEY (amenidad_id) REFERENCES amenidades(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE politicas_hospedaje (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hospedaje_id BIGINT UNSIGNED NOT NULL,
  descripcion TEXT NOT NULL,
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (hospedaje_id) REFERENCES hospedajes(servicio_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE actividades (
  servicio_id BIGINT UNSIGNED PRIMARY KEY,
  duracion_minutos SMALLINT UNSIGNED NOT NULL,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id),
  CHECK (duracion_minutos > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE restaurantes (
  servicio_id BIGINT UNSIGNED PRIMARY KEY,
  tipo_comida VARCHAR(100),
  menu_descripcion TEXT,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE viajes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  zona_id BIGINT UNSIGNED NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado ENUM('borrador','confirmado','cancelado','finalizado') NOT NULL DEFAULT 'borrador',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (zona_id) REFERENCES zonas(id),
  UNIQUE KEY uq_viaje_usuario (id, usuario_id),
  CHECK (fecha_fin > fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE favoritos (
  usuario_id BIGINT UNSIGNED NOT NULL,
  servicio_id BIGINT UNSIGNED NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, servicio_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- No almacenar PAN completo, CVV ni contraseñas bancarias.
CREATE TABLE metodos_pago (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  tipo ENUM('credito','debito','efectivo','transferencia','oxxo') NOT NULL,
  titular VARCHAR(120),
  ultimos4 CHAR(4),
  proveedor VARCHAR(50),
  token_proveedor VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  UNIQUE KEY uq_metodo_usuario (id, usuario_id),
  CHECK ((tipo IN ('credito','debito') AND titular IS NOT NULL AND ultimos4 IS NOT NULL AND ultimos4 REGEXP '^[0-9]{4}$') OR
    (tipo IN ('efectivo','transferencia','oxxo') AND ultimos4 IS NULL))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pedidos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  viaje_id BIGINT UNSIGNED NOT NULL,
  metodo_pago_id BIGINT UNSIGNED NULL,
  metodo_tipo_snapshot VARCHAR(25),
  metodo_terminacion_snapshot CHAR(4),
  estado ENUM('pendiente','confirmado','cancelado') NOT NULL DEFAULT 'pendiente',
  total DECIMAL(12,2) NOT NULL,
  moneda CHAR(3) NOT NULL DEFAULT 'MXN',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (viaje_id, usuario_id) REFERENCES viajes(id, usuario_id),
  FOREIGN KEY (metodo_pago_id, usuario_id) REFERENCES metodos_pago(id, usuario_id),
  UNIQUE KEY uq_pedido_usuario (id, usuario_id),
  CHECK (total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pedido_detalles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT UNSIGNED NOT NULL,
  servicio_id BIGINT UNSIGNED NOT NULL,
  nombre_snapshot VARCHAR(180) NOT NULL,
  unidad ENUM('noche','persona') NOT NULL,
  cantidad SMALLINT UNSIGNED NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (servicio_id) REFERENCES servicios(id),
  CHECK (cantidad > 0),
  CHECK (precio_unitario >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reservas_hospedaje (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  viaje_id BIGINT UNSIGNED NOT NULL UNIQUE,
  hospedaje_id BIGINT UNSIGNED NOT NULL,
  pedido_detalle_id BIGINT UNSIGNED NULL UNIQUE,
  fecha_llegada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  huespedes SMALLINT UNSIGNED NOT NULL,
  precio_noche DECIMAL(12,2) NOT NULL,
  estado ENUM('pendiente','confirmada','cancelada','finalizada') NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (viaje_id) REFERENCES viajes(id),
  FOREIGN KEY (hospedaje_id) REFERENCES hospedajes(servicio_id),
  FOREIGN KEY (pedido_detalle_id) REFERENCES pedido_detalles(id),
  CHECK (fecha_salida > fecha_llegada),
  CHECK (huespedes > 0),
  CHECK (precio_noche >= 0),
  INDEX idx_reserva_fechas (hospedaje_id, fecha_llegada, fecha_salida, estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Actividades, restaurantes y lugares seleccionados para un día del viaje.
CREATE TABLE itinerario (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  viaje_id BIGINT UNSIGNED NOT NULL,
  servicio_id BIGINT UNSIGNED NOT NULL,
  pedido_detalle_id BIGINT UNSIGNED NULL UNIQUE,
  fecha DATE NOT NULL,
  personas SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  precio_persona DECIMAL(12,2) NOT NULL DEFAULT 0,
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (viaje_id) REFERENCES viajes(id),
  FOREIGN KEY (servicio_id) REFERENCES servicios(id),
  FOREIGN KEY (pedido_detalle_id) REFERENCES pedido_detalles(id),
  UNIQUE KEY uq_itinerario_servicio (viaje_id, servicio_id),
  INDEX idx_itinerario_dia (viaje_id, fecha, orden),
  CHECK (personas > 0),
  CHECK (precio_persona >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pagos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT UNSIGNED NOT NULL,
  tipo ENUM('credito','debito','efectivo','transferencia','oxxo') NOT NULL,
  proveedor VARCHAR(50),
  referencia_externa VARCHAR(191) UNIQUE,
  clave_idempotencia VARCHAR(100) NOT NULL UNIQUE,
  importe DECIMAL(12,2) NOT NULL,
  moneda CHAR(3) NOT NULL DEFAULT 'MXN',
  estado ENUM('pendiente','aprobado','rechazado','cancelado','reembolsado') NOT NULL DEFAULT 'pendiente',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmado_en DATETIME NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  CHECK (importe > 0),
  INDEX idx_pagos_pedido_estado (pedido_id, estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Opcional: el asistente actual no conserva historial entre sesiones.
CREATE TABLE conversaciones (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  viaje_id BIGINT UNSIGNED NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (viaje_id, usuario_id) REFERENCES viajes(id, usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE mensajes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversacion_id BIGINT UNSIGNED NOT NULL,
  autor ENUM('usuario','asistente') NOT NULL,
  pregunta_clave VARCHAR(80),
  contenido TEXT NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE CASCADE,
  INDEX idx_mensajes_orden (conversacion_id, creado_en, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tablas de soporte de la API local (se agregan al esquema implementado).
CREATE TABLE intentos_acceso (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  origen_hash CHAR(64) NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_intentos (origen_hash, creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE catalogo_importacion (
  id TINYINT PRIMARY KEY,
  completada_en DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
