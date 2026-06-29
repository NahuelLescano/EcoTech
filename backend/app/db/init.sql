-- Se usa CamelCase para el nombre de las tablas y snake_case para los nombres de las columnas.

-- Tabla para almacenar información sobre los contenedores de residuos en los hubs de reciclaje.

CREATE TABLE ContenedoresHub (
    id SERIAL PRIMARY KEY,
    ubicacion_barrio VARCHAR(100) NOT NULL,
    tipo_residuo_permitido VARCHAR(50) NOT NULL,
    capacidad_maxima_kg INT NOT NULL,
    carga_actual_kg INT NOT NULL,
    estado_llenado VARCHAR(20) NOT NULL DEFAULT 'Vacante',
);

-- Tabla para almacenar información sobre los depósitos de residuos realizados por los vecinos en los contenedores.

CREATE TABLE DepositosResiduos (
    id SERIAL PRIMARY KEY,
    contenedor_id INT NOT NULL REFERENCES ContenedoresHub(id),
    dni_vecino VARCHAR(20) NOT NULL,
    peso_ingresado_kg INT NOT NULL,
    puntos_otorgados INT NOT NULL,
    fecha_deposito TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

-- Tabla para almacenar información sobre las órdenes de retiro de residuos de los contenedores.

CREATE TABLE OrdenesRetiros (
    id SERIAL PRIMARY KEY,
    contenedor_id INT NOT NULL REFERENCES ContenedoresHub(id),
    empresa_recolectora VARCHAR(100) NOT NULL,
    patente_camion VARCHAR(20) NOT NULL,
    fecha_programada TIMESTAMP NOT NULL,
    estado_orden VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
);


