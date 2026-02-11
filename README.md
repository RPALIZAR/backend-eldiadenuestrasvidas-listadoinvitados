# ListadoInvitados - Azure Function API

Esta función proporciona una vista agregada y simplificada de todos los invitados para el panel de control del administrador.

## 🚀 Funcionalidades

- **GET**: Recupera todos los registros de la colección `invitados`.
- **Procesamiento**: Cruza los datos con la colección `rsvp` para mostrar el estado real de asistencia, autobús y alergias de cada integrante.
- **Seguridad**: Validación obligatoria mediante `x-admin-token` en las cabeceras de la petición.

## 🛠️ Tecnologías

- **Node.js** (Azure Functions v4)
- **MongoDB** (Azure Cosmos DB para MongoDB)

## ⚙️ Configuración necesaria

| Variable | Descripción |
| :--- | :--- |
| `COSMOS_MONGO_URI` | Cadena de conexión a la base de datos MongoDB. |
| `COSMOS_DB_NAME` | Nombre de la base de datos (BodaDB). |
| `ADMIN_TOKEN` | Token secreto para acceso administrativo. |

---
Desarrollado para el proyecto "El día de nuestras vidas".