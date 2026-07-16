-- Creacion de la base de datos y tablas para el sistema de gestion de residuos
CREATE TABLE ContenedoresHub (
    id SERIAL PRIMARY KEY,
    ubicacion_barrio VARCHAR(100) NOT NULL,
    tipo_residuo_permitido VARCHAR(50) NOT NULL,
    capacidad_maxima_kg INT NOT NULL,
    carga_actual_kg INT NOT NULL,
    estado_llenado VARCHAR(20) NOT NULL DEFAULT 'Vacante'
);

CREATE TABLE DepositosResiduos (
    id SERIAL PRIMARY KEY,
    contenedor_id INT NOT NULL REFERENCES ContenedoresHub(id),
    dni_vecino VARCHAR(20) NOT NULL,
    peso_ingresado_kg INT NOT NULL,
    puntos_otorgados INT NOT NULL,
    fecha_deposito TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OrdenesRetiros (
    id SERIAL PRIMARY KEY,
    contenedor_id INT NOT NULL REFERENCES ContenedoresHub(id),
    empresa_recolectora VARCHAR(100),
    patente_camion VARCHAR(20),
    fecha_programada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_orden VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
);

-- Datos de ejemplo
INSERT INTO ContenedoresHub (ubicacion_barrio, tipo_residuo_permitido, capacidad_maxima_kg, carga_actual_kg, estado_llenado) VALUES
('Palermo', 'carton', 800, 0, 'Vacante'),
('Recoleta', 'carton', 800, 0, 'Vacante'),
('San Telmo', 'vidrio', 600, 0, 'Vacante'),
('Belgrano', 'plastico', 1000, 0, 'Vacante'),
('Caballito', 'metal', 1200, 0, 'Vacante'),
('Almagro', 'carton', 500, 0, 'Vacante'),
('Villa Urquiza', 'metal', 700, 0, 'Vacante'),
('Puerto Madero', 'plastico', 1000, 0, 'Vacante'),
('Flores', 'vidrio', 900, 0, 'Vacante'),
('Colegiales', 'carton', 800, 0, 'Vacante');


INSERT INTO DepositosResiduos (contenedor_id, dni_vecino, peso_ingresado_kg, puntos_otorgados, fecha_deposito) VALUES
(1, '40123456', 120, 600, '2026-07-01 10:30:00'),
(1, '40987654', 80, 400, '2026-07-03 15:00:00'),
(2, '40555111', 150, 750, '2026-07-02 09:00:00'),
(3, '40222333', 200, 3000, '2026-07-04 11:15:00'),
(4, '40777888', 300, 3000, '2026-07-05 14:45:00'),
(4, '40333444', 100, 1000, '2026-07-06 08:20:00'),
(5, '40666777', 250, 5000, '2026-07-07 16:00:00'),
(7, '40888999', 180, 3600, '2026-07-08 12:30:00'),
(8, '40111222', 400, 4000, '2026-07-09 10:00:00'),
(9, '40444555', 350, 5250, '2026-07-10 14:00:00');

INSERT INTO OrdenesRetiros (contenedor_id, empresa_recolectora, patente_camion, fecha_programada, estado_orden) VALUES
(1, NULL, NULL, NULL, 'Pendiente');
