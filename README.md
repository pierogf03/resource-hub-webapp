# Resource Hub Frontend

Aplicación Angular para gestionar recursos externos, asignaciones, presupuesto, OCs mensuales e importación histórica desde Excel.

## Stack

- Angular 19 (standalone components)
- TypeScript
- Angular Material
- JWT Bearer authentication
- SCSS
- RxJS

## Arquitectura de carpetas

```
src/app/
├── core/
│   ├── constants/     # API endpoints, colores, estados
│   ├── guards/        # AuthGuard, RoleGuard
│   ├── interceptors/  # JWT y manejo de errores HTTP
│   ├── models/        # Interfaces TypeScript alineadas al backend
│   └── services/      # Servicios HTTP por dominio
├── features/          # Módulos funcionales (login, dashboard, CRUD, imports)
├── layout/            # Main layout, sidebar, header
└── shared/            # Componentes, pipes y utilidades reutilizables
```

## Configuración de environment

| Archivo | Uso | API URL |
|---------|-----|---------|
| `src/environments/environment.development.ts` | Desarrollo (`ng serve`) | `http://localhost:8000` |
| `src/environments/environment.ts` | Producción (`ng build`) | `https://api-Resource Hub.example.com` |

## Ejecución local

```bash
npm install
ng serve
```

Abrir [http://localhost:4200](http://localhost:4200)

Credenciales de prueba (según backend):

- Email: `admin@resourcepulse.com`
- Password: `Admin123`

## Módulos implementados

| Módulo | Ruta |
|--------|------|
| Login | `/login` |
| Dashboard | `/dashboard` |
| Usuarios (ADMIN) | `/users` |
| Proveedores | `/providers` |
| Iniciativas | `/initiatives` |
| Recursos externos | `/external-resources` |
| Asignaciones | `/assignments` |
| Órdenes de compra | `/purchase-orders` |
| Importación Excel | `/imports/historical` |
| Historial importaciones | `/imports/history` |
| Errores de importación | `/imports/:batchId/errors` |

## Mapeo de endpoints

| Dominio | Endpoints |
|---------|-----------|
| Auth | `POST /auth/login`, `GET /auth/me` |
| Users | `GET/POST /users`, `PUT /users/{id}` |
| Providers | `GET/POST /providers`, `PUT /providers/{id}` |
| Initiatives | `GET/POST /initiatives`, `PUT /initiatives/{id}` |
| External Resources | `GET/POST /external-resources`, `PUT /external-resources/{id}` |
| Assignments | `GET/POST /assignments`, `PUT /assignments/{id}`, `POST /assignments/{id}/generate-monthly-purchase-orders` |
| Purchase Orders | `GET/POST /purchase-orders`, `PUT /purchase-orders/{id}` |
| Dashboard | `GET /dashboard/summary`, `GET /dashboard/expiring-resources` |
| Imports | `POST /imports/historical-excel`, `GET /imports`, `GET /imports/{batch_id}/errors` |
| AI Chat | `POST /ai/chat/messages`, `POST /ai/chat/actions/confirm` |

## Resource Hub Assistant

Asistente de chat embebido en el layout autenticado para consultar recursos, OCs, vencimientos, presupuesto e importaciones mediante lenguaje natural.

### Arquitectura

```
Usuario → Chat Widget → AiChatService → FastAPI → Workato/Genie
```

Angular consume únicamente el backend Resource Hub. La integración con Workato/Genie se realiza desde FastAPI. El frontend no almacena API keys ni se conecta directamente a Workato.

### Endpoints

| Método | Ruta | Uso |
|--------|------|-----|
| `POST` | `/ai/chat/messages` | Enviar mensaje y recibir respuesta del asistente |
| `POST` | `/ai/chat/actions/confirm` | Confirmar o rechazar acciones pendientes (generar OCs, aprobar OC, etc.) |

### Componentes

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| `ChatWidgetComponent` | `features/ai-chat/chat-widget` | Botón flotante morado para abrir/cerrar el chat |
| `ChatPanelComponent` | `features/ai-chat/chat-panel` | Panel lateral con estado, mensajes y orquestación |
| `ChatMessageComponent` | `features/ai-chat/chat-message` | Burbujas de mensaje user/assistant/system |
| `ChatInputComponent` | `features/ai-chat/chat-input` | Entrada de texto con validación |
| `ChatSuggestionsComponent` | `features/ai-chat/chat-suggestions` | Preguntas sugeridas |
| `ChatPendingActionComponent` | `features/ai-chat/chat-pending-action` | Tarjeta de confirmación de acciones |

### Seguridad

- JWT adjunto automáticamente por `AuthInterceptor`
- Chat visible solo en layout autenticado (no en `/login`)
- Sesión del chat en `sessionStorage`; se limpia al cerrar sesión
- Sin API keys ni credenciales de Workato en el frontend

### Flujo de confirmaciones

Cuando el asistente propone una acción (ej. generar OCs mensuales), la respuesta incluye `requires_confirmation: true` y un `pending_action`. El usuario debe confirmar o cancelar; la decisión se envía a `POST /ai/chat/actions/confirm`.

### Limitaciones del asistente

- Depende del backend FastAPI con endpoints `/ai/chat/*` operativos
- Sin historial persistente entre sesiones del navegador (solo `sessionStorage`)
- Sin streaming de respuestas (request/response síncrono)

## Seguridad

- **JWT**: token almacenado en `localStorage` tras login exitoso
- **AuthInterceptor**: adjunta `Authorization: Bearer {token}` a todas las peticiones excepto login
- **ErrorInterceptor**: maneja 401 (logout + redirect), 403, 400/422 y 500
- **AuthGuard**: protege rutas del layout principal
- **RoleGuard**: restringe `/users` a rol `ADMIN`

## Diseño

- Paleta principal morada (`#5B21B6`, `#3B0764`, `#7C3AED`)
- Fondo claro `#F8F7FC` con tarjetas blancas
- Layout responsive: sidebar fijo en desktop, drawer en móvil
- Angular Material con tema personalizado

## Limitaciones actuales

- No hay reportes PDF
- No hay integración real con Coupa
- Depende del backend FastAPI en ejecución

## Próximos pasos

- Streaming de respuestas del asistente
- Mejorar gráficos del dashboard
- Agregar reportes ejecutivos
- Agregar pruebas unitarias
- Agregar exportación Excel/PDF
