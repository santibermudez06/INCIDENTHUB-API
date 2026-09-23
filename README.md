# IncidentHub API

API REST para la gestión de incidentes tecnológicos, desarrollada con Node.js, TypeScript y Express.

---

## 1. Problema que Soluciona

En una organización, los incidentes tecnológicos pueden ser reportados mediante llamadas, mensajes y conversaciones informales, lo que dificulta llevar un control y una trazabilidad adecuada.

**IncidentHub API** permite centralizar el registro, consulta, modificación, atención y eliminación de incidentes tecnológicos.

La información se almacena temporalmente en memoria mediante un arreglo de TypeScript, sin utilizar una base de datos.

---

## 2. Tecnologías Utilizadas

- **Node.js**
- **TypeScript**
- **Express.js**
- **tsx**
- **dotenv**

---

## 3. Instalación y Ejecución

### Prerrequisitos

Tener instalado:

- Node.js v18 o superior.
- npm.

### Instalar dependencias

Desde la carpeta del proyecto:

```bash
npm install
```

Este comando instala las dependencias definidas en `package.json`.

### Ejecutar el proyecto

```bash
npm run dev
```

El servidor se ejecutará en:

```text
http://localhost:3000
```

---

# 4. Documentación de Endpoints

## Incidentes

| Método | Endpoint | Descripción | Respuesta |
|---|---|---|---|
| `GET` | `/api/incidents` | Consulta todos los incidentes | `200 OK` |
| `GET` | `/api/incidents/:id` | Consulta un incidente por ID | `200 / 404` |
| `POST` | `/api/incidents` | Registra un nuevo incidente | `201 Created` |
| `PUT` | `/api/incidents/:id` | Actualiza un incidente | `200 / 404` |
| `PATCH` | `/api/incidents/:id/status` | Cambia el estado de un incidente | `200 / 400 / 404` |
| `DELETE` | `/api/incidents/:id` | Elimina un incidente | `204 / 401 / 403 / 404` |

## Endpoints adicionales

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/incidents/critical` | Obtiene únicamente los incidentes con prioridad `CRITICAL` |
| `GET` | `/api/incidents/pending` | Obtiene incidentes con estado `OPEN` o `IN_PROGRESS` |
| `GET` | `/api/incidents/stats` | Obtiene el resumen y las estadísticas de los incidentes |

---

# 5. Middlewares

### `loggerMiddleware`

Registra información de cada petición HTTP, incluyendo la fecha, el método y la ruta solicitada.

### `requestInfoMiddleware`

Agrega información adicional al objeto `Request`, como:

- `timestamp`
- `method`
- `path`

Esto permite demostrar cómo un middleware puede enriquecer una petición antes de continuar con el siguiente componente.

### `validateIdMiddleware`

Verifica que el parámetro `:id` sea un número entero positivo.

Ejemplos inválidos:

```text
abc
-3
4.5
```

Si el ID no es válido, responde con `400 Bad Request`.

### `validateIncidentMiddleware`

Valida que los campos requeridos de un incidente estén presentes y sean válidos:

- `title`
- `description`
- `reporter`
- `location`
- `priority`
- `estimatedMinutes`

### `validatePriorityMiddleware`

Verifica que la prioridad corresponda a uno de los valores permitidos:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

### `validateTimeMiddleware`

Valida que `estimatedMinutes` sea un número mayor que cero y que no supere los **480 minutos**.

Además, para incidentes con prioridad `CRITICAL`, el tiempo máximo permitido es de **60 minutos**.

### `authMiddleware`

Verifica el encabezado de autorización:

```http
Authorization: Bearer <token>
```

Los tokens utilizados son:

```text
instructor-token
technician-token
```

Si el encabezado no existe o el token es incorrecto, se devuelve `401 Unauthorized`.

### `adminMiddleware`

Verifica que el usuario tenga permisos administrativos.

El `instructor-token` tiene permisos administrativos, mientras que el `technician-token` representa a un técnico normal.

El técnico puede realizar operaciones `GET`, `POST`, `PUT` y `PATCH`, pero no puede realizar `DELETE`.

Si un técnico intenta eliminar un incidente, se devuelve:

```text
403 Forbidden
```

### `notFoundMiddleware`

Captura las solicitudes realizadas a rutas que no existen y devuelve:

```text
404 Not Found
```

### `errorMiddleware`

Maneja de forma centralizada los errores de la aplicación y transforma los errores controlados en respuestas HTTP uniformes.

---

# 6. DTO vs Model

## Model

El **Model** representa cómo existe un incidente dentro de la aplicación.

Contiene todos los atributos del incidente:

```typescript
interface Incident {
  id: number;
  title: string;
  description: string;
  reporter: string;
  location: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  estimatedMinutes: number;
  createdAt: string;
}
```

Incluye información que es administrada por el servidor, como:

- `id`
- `status`
- `createdAt`

## DTO

El **DTO (Data Transfer Object)** representa los datos que el cliente tiene permitido enviar en una determinada operación.

Para crear un incidente:

```typescript
interface CreateIncidentDto {
  title: string;
  description: string;
  reporter: string;
  location: string;
  priority: IncidentPriority;
  estimatedMinutes: number;
}
```

El cliente no envía:

- `id`
- `status`
- `createdAt`

Estos valores son generados y controlados por el servidor.

La diferencia principal es que el **Model representa el objeto completo dentro de la aplicación**, mientras que el **DTO define los datos permitidos para una operación específica**.

---

# 7. Reglas de Negocio

## Estados permitidos

Los estados disponibles son:

```text
OPEN
IN_PROGRESS
RESOLVED
```

## Transiciones permitidas

```text
OPEN → IN_PROGRESS
IN_PROGRESS → RESOLVED
OPEN → RESOLVED
```

No se permiten las siguientes transiciones:

```text
RESOLVED → OPEN
RESOLVED → IN_PROGRESS
```

## Regla para incidentes críticos

Cuando la prioridad sea:

```text
CRITICAL
```

el valor de `estimatedMinutes` no puede superar los **60 minutos**.

---

# 8. Manejo de Errores

La aplicación utiliza una clase `AppError` para representar errores controlados.

Los errores son enviados al `errorMiddleware`, que genera respuestas HTTP uniformes.

Los principales códigos utilizados son:

| Código | Significado |
|---|---|
| `200` | Operación exitosa |
| `201` | Recurso creado |
| `204` | Recurso eliminado correctamente |
| `400` | Solicitud inválida |
| `401` | No autenticado |
| `403` | Sin permisos suficientes |
| `404` | Recurso o ruta no encontrada |

---

# 9. Reflexión

## ¿Qué ventajas ofrece implementar validaciones, autenticación y manejo de errores mediante middlewares en lugar de escribir toda esta lógica directamente dentro de cada controller?

Separar estas responsabilidades mediante middlewares permite mantener una mejor organización del código.

Los controllers pueden concentrarse principalmente en la lógica de la operación, mientras que los middlewares se encargan de tareas específicas como validar datos, comprobar autenticación, verificar permisos y manejar errores.

También permite reutilizar el mismo middleware en diferentes rutas sin repetir código.

Además, si una regla de validación o autenticación cambia, se puede modificar el middleware correspondiente sin tener que realizar cambios en todos los controllers.

Finalmente, el manejo centralizado de errores permite mantener respuestas consistentes y evita repetir la misma lógica de manejo de errores en cada controller.

---

# 10. Pruebas y Evidencias

Las pruebas de la API fueron realizadas utilizando herramientas como **Thunder Client**.

Se verificaron diferentes escenarios, incluyendo:

- Consultar todos los incidentes.
- Consultar un incidente existente.
- Consultar un incidente inexistente.
- Validar IDs incorrectos.
- Crear incidentes.
- Validar datos incorrectos.
- Validar prioridades.
- Validar tiempos.
- Validar la regla de incidentes críticos.
- Actualizar incidentes.
- Cambiar estados.
- Validar transiciones de estados.
- Probar autenticación.
- Probar autorización administrativa.
- Eliminar incidentes.
- Consultar incidentes críticos.
- Consultar incidentes pendientes.
- Consultar estadísticas.
- Probar rutas inexistentes.

Las evidencias de las pruebas se entregan junto con el proyecto.