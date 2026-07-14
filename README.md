# EcoTech - Hubs de Reciclaje Urbano

Plataforma de economía circular para gestionar puntos limpios comunitarios (Hubs).
Registra depósitos de residuos clasificados de vecinos a cambio de puntos ecológicos,
automatizando la logística de alerta y retiro cuando los contenedores alcanzan su límite.

## Requisitos

- [Node.js](https://nodejs.org/) 22+
- [Docker](https://www.docker.com/) y Docker Compose
- [Make](https://www.gnu.org/software/make/) (opcional, para comandos del Makefile)

## Inicio Rápido

### Con Docker (recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/NahuelLescano/EcoTech.git
cd EcoTech

# Levantar backend + base de datos
make up
```

El backend estará disponible en `http://localhost:8000`.

### Frontend

```bash
# En otra terminal
make front
```

El frontend estará disponible en `http://localhost:4000`.

### Ambos juntos

```bash
make run
```

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `make up` | Reconstruir y levantar backend + DB |
| `make down` | Detener backend |
| `make remove` | Detener y eliminar volúmenes de DB |
| `make logs` | Ver logs del backend |
| `make ps` | Listar containers en ejecución |
| `make front` | Levantar frontend (http-server en puerto 4000) |
| `make run` | Levantar backend y frontend en paralelo |
| `make install` | Instalar dependencias del backend |

## Arquitectura

```
ecotech-tp/
├── backend/                    # API REST (Express 5 + PostgreSQL)
│   ├── src/
│   │   ├── controller/         # Lógica de negocio
│   │   ├── database/           # Queries SQL y schema inicial
│   │   ├── routes/             # Definición de endpoints
│   │   ├── schemas/            # Validación de inputs
│   │   └── index.js            # Entry point
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/                   # Sitio estático (HTML + Bulma + Vanilla JS)
│   ├── index.html              # Inicio
│   ├── terminal.html           # Terminal del Vecino
│   ├── logistica.html          # Panel de Logística
│   ├── auditoria.html          # Dashboard de Auditoría
│   ├── js/                     # Lógica por vista
│   ├── css/
│   └── env.js                  # URLs de la API
└── Makefile
```

## Modelo de Datos

### ContenedoresHub

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PK | Identificador único |
| ubicacion_barrio | VARCHAR(100) | Ubicación del contenedor |
| tipo_residuo_permitido | VARCHAR(50) | Tipo de residuo aceptado |
| capacidad_maxima_kg | INT | Capacidad máxima en kg |
| carga_actual_kg | INT | Carga actual en kg |
| estado_llenado | VARCHAR(20) | `Vacante` o `Lleno` |

### DepositosResiduos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PK | Identificador único |
| contenedor_id | INT FK | Referencia a ContenedoresHub |
| dni_vecino | VARCHAR(20) | DNI del vecino |
| peso_ingresado_kg | INT | Peso depositado en kg |
| puntos_otorgados | INT | Puntos ganados |
| fecha_deposito | TIMESTAMP | Fecha del depósito |

### OrdenesRetiros

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PK | Identificador único |
| contenedor_id | INT FK | Referencia a ContenedoresHub |
| empresa_recolectora | VARCHAR(100) | Empresa asignada |
| patente_camion | VARCHAR(20) | Patente del camión |
| fecha_programada | TIMESTAMP | Fecha programada |
| estado_orden | VARCHAR(20) | `Pendiente` o `Completada` |

## Endpoints

### Contenedores

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/contenedores` | Listar todos los contenedores |
| POST | `/api/contenedores` | Crear contenedor |
| PUT | `/api/contenedores/:id` | Actualizar contenedor |
| DELETE | `/api/contenedores/:id` | Eliminar contenedor |

### Depósitos

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/depositos` | Registrar depósito de residuos |

### Órdenes de Retiro

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/ordenes-retiros` | Listar órdenes pendientes |
| PUT | `/api/ordenes-retiros/:id/completar` | Marcar orden como completada |

### Health Check

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Verificar estado del backend |

## Reglas de Negocio

- **Cálculo de puntos**: Cada tipo de residuo otorga puntos por kg (plástico: 10, cartón: 5, vidrio: 15, metal: 20)
- **Disparador automático**: Si un depósito supera el 90% de capacidad, el contenedor cambia a estado `Lleno` y se crea automáticamente una `OrdenRetiro` con estado `Pendiente`
- **Bloqueo**: No se permiten depósitos en contenedores con estado `Lleno`
- **Reset de inventario**: Al completar una orden de retiro, la carga del contenedor se resetea a 0 y su estado vuelve a `Vacante`

## Stack Tecnológico

- **Backend**: Node.js 22, Express 5, PostgreSQL 17
- **Frontend**: HTML5, Bulma CSS, JavaScript (ES Modules)
- **Infraestructura**: Docker Compose, Make
- **Validación**: Schema manual con middleware propio

## Autores

Grupo 404 not found - Universidad de Buenos Aires
