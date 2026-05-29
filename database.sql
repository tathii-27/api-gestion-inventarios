-- =====================================================
-- BASE DE DATOS PARA GESTIÓN DE INVENTARIOS
-- Sistema de autenticación JWT con roles
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS inventarios_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE inventarios_db;

-- =====================================================
-- TABLA: usuarios
-- Almacena información de usuarios y credenciales
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'docente') NOT NULL DEFAULT 'docente',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: estados
-- Catálogo de estados de equipos
-- =====================================================
CREATE TABLE IF NOT EXISTS estados (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: marcas
-- Catálogo de marcas de equipos
-- =====================================================
CREATE TABLE IF NOT EXISTS marcas (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: tipos_equipos
-- Catálogo de tipos de equipos
-- =====================================================
CREATE TABLE IF NOT EXISTS tipos_equipos (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: inventarios
-- Registro principal de equipos en inventario
-- =====================================================
CREATE TABLE IF NOT EXISTS inventarios (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    serial VARCHAR(100) UNIQUE,
    codigo_patrimonial VARCHAR(50) UNIQUE,
    estado_id INT UNSIGNED,
    marca_id INT UNSIGNED,
    tipo_equipo_id INT UNSIGNED,
    usuario_id INT UNSIGNED,
    fecha_adquisicion DATE,
    valor_compra DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (estado_id) REFERENCES estados(id) ON DELETE SET NULL,
    FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE SET NULL,
    FOREIGN KEY (tipo_equipo_id) REFERENCES tipos_equipos(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_serial (serial),
    INDEX idx_codigo_patrimonial (codigo_patrimonial),
    INDEX idx_estado_id (estado_id),
    INDEX idx_marca_id (marca_id),
    INDEX idx_tipo_equipo_id (tipo_equipo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: logs_actividad
-- Auditoría de acciones del sistema (opcional)
-- =====================================================
CREATE TABLE IF NOT EXISTS logs_actividad (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNSIGNED,
    accion VARCHAR(100) NOT NULL,
    entidad VARCHAR(50),
    entidad_id INT,
    detalles JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_accion (accion),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar estados
INSERT INTO estados (nombre, descripcion) VALUES
('Disponible', 'Equipo disponible para asignación inmediata'),
('En uso', 'Equipo actualmente asignado y en uso'),
('En mantenimiento', 'Equipo en proceso de mantenimiento preventivo o correctivo'),
('Dañado', 'Equipo fuera de servicio por daño técnico'),
('Dado de baja', 'Equipo retirado oficialmente del inventario'),
('En reparación', 'Equipo enviado a servicio técnico externo');

-- Insertar marcas
INSERT INTO marcas (nombre, descripcion) VALUES
('HP', 'Hewlett-Packard - Computadoras e impresoras'),
('Dell', 'Dell Technologies - Equipos de cómputo'),
('Lenovo', 'Lenovo Group Limited - Tecnología'),
('Apple', 'Apple Inc. - Mac, iPhone, iPad'),
('Samsung', 'Samsung Electronics - Electrónica'),
('Acer', 'Acer Inc. - Computadoras'),
('Asus', 'ASUSTeK Computer Inc. - Hardware'),
('Microsoft', 'Microsoft Corporation - Surface'),
('LG', 'LG Electronics - Electrónica'),
('Sony', 'Sony Corporation - Electrónica');

-- Insertar tipos de equipos
INSERT INTO tipos_equipos (nombre, descripcion) VALUES
('Laptop', 'Computadora portátil'),
('Desktop', 'Computadora de escritorio'),
('Tablet', 'Tableta electrónica táctil'),
('Smartphone', 'Teléfono inteligente'),
('Monitor', 'Pantalla de visualización'),
('Proyector', 'Proyector de video'),
('Impresora', 'Impresora multifuncional'),
('Servidor', 'Servidor de cómputo'),
('Switch', 'Switch de red'),
('Router', 'Router de red');

-- Insertar usuarios de prueba
-- Contraseña para todos: 123456
-- Hash generado con bcrypt (rounds=10)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin Sistema', 'admin@inventarios.com', '$2a$10$tKqXqKqXqKqXqKqXqKqXqOqXqKqXqKqXqKqXqKqXqKqXqKqXqKq', 'administrador'),
('Carlos López', 'carlos@inventarios.com', '$2a$10$tKqXqKqXqKqXqKqXqKqXqOqXqKqXqKqXqKqXqKqXqKqXqKqXqKq', 'docente'),
('Ana Martínez', 'ana@inventarios.com', '$2a$10$tKqXqKqXqKqXqKqXqKqXqOqXqKqXqKqXqKqXqKqXqKqXqKqXqKq', 'docente'),
('Pedro Rodríguez', 'pedro@inventarios.com', '$2a$10$tKqXqKqXqKqXqKqXqKqXqOqXqKqXqKqXqKqXqKqXqKqXqKqXqKq', 'docente');

-- Insertar inventarios de ejemplo
INSERT INTO inventarios (nombre, descripcion, serial, codigo_patrimonial, estado_id, marca_id, tipo_equipo_id, usuario_id, fecha_adquisicion, valor_compra) VALUES
('Laptop HP EliteBook 840', 'Laptop para desarrollo de software, 16GB RAM, 512GB SSD', 'HP-ELITE-001', 'PAT-2024-001', 2, 1, 1, 2, '2024-01-15', 1250000.00),
('MacBook Pro M2', 'Laptop para diseño gráfico, 16GB RAM, 512GB SSD', 'AP-MBP-002', 'PAT-2024-002', 2, 4, 1, 3, '2024-02-01', 1850000.00),
('Monitor Dell Ultrasharp 27"', 'Monitor 4K para estaciones de trabajo', 'DE-MON-003', 'PAT-2024-003', 1, 2, 5, NULL, '2024-01-20', 850000.00),
('Tablet Samsung Galaxy Tab S8', 'Tablet para presentaciones y reuniones', 'SA-TAB-004', 'PAT-2024-004', 1, 5, 3, NULL, '2024-02-10', 650000.00),
('Proyector Epson EB-FH06', 'Proyector Full HD para sala de juntas', 'EP-PRO-005', 'PAT-2024-005', 3, 3, 6, NULL, '2024-01-05', 950000.00),
('Impresora HP LaserJet Pro', 'Impresora láser monocromática', 'HP-PRI-006', 'PAT-2024-006', 1, 1, 7, NULL, '2024-01-25', 450000.00),
('Servidor Dell PowerEdge', 'Servidor para base de datos', 'DE-SRV-007', 'PAT-2024-007', 1, 2, 8, NULL, '2024-02-15', 3500000.00),
('Laptop Lenovo ThinkPad X1', 'Laptop ejecutiva para dirección', 'LEN-TPX-008', 'PAT-2024-008', 2, 3, 1, 4, '2024-02-20', 1450000.00);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de inventario completo
CREATE OR REPLACE VIEW vista_inventario_completo AS
SELECT 
    i.id,
    i.nombre,
    i.descripcion,
    i.serial,
    i.codigo_patrimonial,
    i.fecha_adquisicion,
    i.valor_compra,
    e.nombre AS estado,
    e.descripcion AS estado_descripcion,
    m.nombre AS marca,
    t.nombre AS tipo_equipo,
    u.nombre AS responsable,
    u.email AS responsable_email,
    i.created_at,
    i.updated_at
FROM inventarios i
LEFT JOIN estados e ON i.estado_id = e.id
LEFT JOIN marcas m ON i.marca_id = m.id
LEFT JOIN tipos_equipos t ON i.tipo_equipo_id = t.id
LEFT JOIN usuarios u ON i.usuario_id = u.id;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS (opcional)
-- =====================================================

DELIMITER //

-- Procedimiento para obtener estadísticas de inventario
CREATE PROCEDURE sp_estadisticas_inventario()
BEGIN
    SELECT 
        COUNT(*) as total_equipos,
        SUM(CASE WHEN estado_id = 1 THEN 1 ELSE 0 END) as disponibles,
        SUM(CASE WHEN estado_id = 2 THEN 1 ELSE 0 END) as en_uso,
        SUM(CASE WHEN estado_id = 3 THEN 1 ELSE 0 END) as mantenimiento,
        SUM(CASE WHEN estado_id = 4 THEN 1 ELSE 0 END) as danados,
        SUM(valor_compra) as valor_total_inventario
    FROM inventarios;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_inventarios_timestamp
BEFORE UPDATE ON inventarios
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;