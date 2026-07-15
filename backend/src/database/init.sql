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
    fecha_programada VARCHAR(20) NOT NULL DEFAULT TO_CHAR(CURRENT_DATE, 'DD/MM/YYYY'),
    estado_orden VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
);
