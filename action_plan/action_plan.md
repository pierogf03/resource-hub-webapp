PLAN CONSOLIDADO PARA CURSOR — FRONTEND RESOURCEPULSE

Quiero construir el FRONTEND de una aplicación web llamada ResourcePulse.

ResourcePulse es una plataforma web para reemplazar un Excel de control de recursos externos. El sistema debe permitir gestionar consultores externos, proveedores, iniciativas/proyectos, asignaciones, costos, fechas de inicio y fin, vencimientos, órdenes de compra mensuales, dashboard e importación histórica desde Excel.

El frontend debe conectarse a un backend FastAPI mediante endpoints REST protegidos con JWT Bearer Token.

IMPORTANTE:
Construir el frontend con prácticas profesionales, diseño responsive, arquitectura ordenada, componentes reutilizables, validaciones sólidas, manejo de errores, buena distribución visual y sin errores de compilación. No dejar TODOs, código incompleto, rutas rotas, imports sin usar ni lógica duplicada.

============================================================

1. STACK OBLIGATORIO
   ============================================================

Usar:

* Angular 17+
* TypeScript
* Angular Material
* Angular Router
* Reactive Forms
* HttpClient
* HTTP Interceptor para JWT
* Guards para rutas protegidas
* SCSS
* RxJS
* Standalone Components si se usa Angular moderno
* Environment files para configurar la URL del backend

No usar por ahora:

* NgRx
* Redux
* Microfrontends
* SSR
* IA / Workato GO
* Reportes PDF
* Integración real con Coupa

============================================================
2. OBJETIVO DEL FRONTEND
========================

Crear una interfaz profesional, moderna, limpia, elegante y responsive para usuarios de negocio.

El sistema debe permitir:

1. Iniciar sesión con usuario y contraseña.
2. Guardar token JWT de forma segura.
3. Consumir endpoints protegidos usando Authorization Bearer Token.
4. Mostrar dashboard resumen.
5. Gestionar proveedores configurables.
6. Gestionar iniciativas/proyectos.
7. Gestionar recursos externos.
8. Gestionar asignaciones de recursos.
9. Generar OCs mensuales por asignación.
10. Gestionar órdenes de compra.
11. Importar información histórica desde Excel.
12. Mostrar errores, estados vacíos y cargas de forma profesional.
13. Mantener un diseño responsive para desktop, laptop, tablet y móvil.

============================================================
3. IDENTIDAD VISUAL Y DISEÑO
============================

Nombre del sistema:
ResourcePulse

Estilo:

* Corporativo
* Profesional
* Moderno
* Limpio
* Orientado a managers y usuarios no técnicos
* Con buena jerarquía visual
* Con diseño responsive

Color principal obligatorio:
Morado elegante

Paleta sugerida:

* Primary Purple: #5B21B6
* Deep Purple: #3B0764
* Accent Violet: #7C3AED
* Soft Purple: #EDE9FE
* Background: #F8F7FC
* Surface: #FFFFFF
* Text Primary: #1F2937
* Text Secondary: #6B7280
* Border: #E5E7EB
* Success Green: #16A34A
* Warning Amber: #F59E0B
* Danger Red: #DC2626
* Info Blue: #2563EB
* Neutral Gray: #6B7280

Reglas de diseño:

* Usar el morado como color principal en sidebar, botones primarios, acentos y elementos activos.
* No saturar toda la pantalla de morado.
* Usar fondo claro y tarjetas blancas.
* Mantener buen contraste.
* Usar bordes suaves y sombras ligeras.
* Usar espacios consistentes entre secciones.
* Priorizar legibilidad.
* Las tablas deben ser claras y escaneables.
* Los formularios deben estar bien agrupados.
* Los estados deben representarse con chips o badges.
* El dashboard debe verse como una herramienta empresarial real.

============================================================
4. DISEÑO RESPONSIVE
====================

El frontend debe ser responsive.

Breakpoints sugeridos:

* Desktop grande: >= 1280px
* Laptop: 1024px - 1279px
* Tablet: 768px - 1023px
* Mobile: < 768px

Comportamiento esperado:

Desktop:

* Sidebar fijo a la izquierda.
* Header superior.
* Cards KPI en grilla de 4 columnas.
* Tablas completas.

Laptop:

* Sidebar fijo o compacto.
* Cards KPI en 3 o 4 columnas según espacio.
* Tablas con scroll horizontal si es necesario.

Tablet:

* Sidebar colapsable.
* Cards KPI en 2 columnas.
* Tablas con columnas prioritarias.
* Filtros apilados o en dos columnas.

Mobile:

* Sidebar tipo drawer.
* Cards KPI en 1 columna.
* Formularios en 1 columna.
* Tablas convertidas en cards o con scroll horizontal.
* Botones principales visibles.
* Evitar overflow visual.

Reglas responsive obligatorias:

* No debe romperse el layout en pantallas pequeñas.
* No debe haber textos superpuestos.
* No debe haber botones fuera del viewport.
* Las tablas deben tener contenedor con overflow-x.
* Los formularios deben adaptarse a una sola columna en móvil.
* El sidebar debe poder cerrarse en móvil.
* El header debe mantener usuario y logout accesibles.

============================================================
5. ESTRUCTURA DEL PROYECTO
==========================

Crear esta estructura:

frontend/
src/
app/
core/
constants/
api-endpoints.ts
app-colors.ts
status.constants.ts

```
    guards/
      auth.guard.ts
      role.guard.ts

    interceptors/
      auth.interceptor.ts
      error.interceptor.ts

    models/
      api-response.model.ts
      auth.model.ts
      user.model.ts
      provider.model.ts
      initiative.model.ts
      external-resource.model.ts
      assignment.model.ts
      purchase-order.model.ts
      dashboard.model.ts
      import.model.ts
      pagination.model.ts

    services/
      auth.service.ts
      storage.service.ts
      user.service.ts
      provider.service.ts
      initiative.service.ts
      external-resource.service.ts
      assignment.service.ts
      purchase-order.service.ts
      dashboard.service.ts
      import.service.ts
      notification.service.ts

  layout/
    main-layout/
      main-layout.component.ts
      main-layout.component.html
      main-layout.component.scss

    sidebar/
      sidebar.component.ts
      sidebar.component.html
      sidebar.component.scss

    header/
      header.component.ts
      header.component.html
      header.component.scss

  shared/
    components/
      page-header/
      stat-card/
      status-chip/
      expiration-badge/
      loading-spinner/
      empty-state/
      confirm-dialog/
      search-filter-bar/
      file-upload-box/

    pipes/
      usd-currency.pipe
      pen-currency.pipe
      days-left.pipe
      month-label.pipe

    utils/
      date-format.util.ts
      money-format.util.ts

  features/
    auth/
      login/
        login.component.ts
        login.component.html
        login.component.scss

    dashboard/
      dashboard-page/
        dashboard-page.component.ts
        dashboard-page.component.html
        dashboard-page.component.scss

    users/
      user-list/
      user-form/

    providers/
      provider-list/
      provider-form/

    initiatives/
      initiative-list/
      initiative-form/

    external-resources/
      external-resource-list/
      external-resource-form/

    assignments/
      assignment-list/
      assignment-form/
      assignment-detail/

    purchase-orders/
      purchase-order-list/
      purchase-order-form/

    imports/
      historical-import/
      import-history/
      import-errors/

  app.routes.ts
  app.config.ts

environments/
  environment.ts
  environment.development.ts

styles.scss
```

============================================================
6. ENVIRONMENT
==============

Crear configuración de ambiente.

environment.development.ts:

export const environment = {
production: false,
apiUrl: 'http://localhost:8000'
};

environment.ts:

export const environment = {
production: true,
apiUrl: 'https://api-resourcepulse.example.com'
};

Toda llamada HTTP debe usar environment.apiUrl.

No hardcodear URLs en componentes.

============================================================
7. AUTENTICACIÓN Y SEGURIDAD FRONTEND
=====================================

Implementar login con JWT.

Flujo:

1. Usuario ingresa email y password.
2. Frontend llama POST /auth/login.
3. Backend devuelve access_token y datos del usuario.
4. Frontend guarda token y usuario.
5. Redirige a /dashboard.
6. Todas las llamadas protegidas envían:
   Authorization: Bearer access_token
7. Si el backend devuelve 401, limpiar sesión y redirigir a /login.

Componentes y servicios:

AuthService:

* login(credentials)
* logout()
* getCurrentUser()
* isAuthenticated()
* hasRole(role)
* getToken()

StorageService:

* setToken(token)
* getToken()
* removeToken()
* setUser(user)
* getUser()
* clearSession()

AuthInterceptor:

* Adjuntar Authorization Bearer Token si existe token.
* No adjuntar token al endpoint /auth/login.

ErrorInterceptor:

* Manejar 401.
* Manejar 403.
* Manejar 500.
* Mostrar mensajes amigables usando NotificationService.

AuthGuard:

* Bloquear rutas si no hay token.
* Redirigir a /login.

RoleGuard:

* Permitir acceso según rol si se requiere.

Roles:

* ADMIN
* MANAGER
* ANALYST

Reglas de UI por rol:

ADMIN:

* Puede ver módulos de usuarios.
* Puede ver toda la información.

MANAGER:

* No debe ver administración de usuarios si no corresponde.
* Ve información asociada a su manager_id según backend.

ANALYST:

* Puede ver recursos asociados a él según backend.

Importante:
La seguridad real la controla el backend. El frontend solo debe ocultar opciones y mejorar experiencia.

============================================================
8. FORMATO ESTÁNDAR DE RESPUESTA DEL BACKEND
============================================

El frontend debe asumir este formato para respuestas exitosas:

{
"success": true,
"message": "Operation completed successfully",
"data": {}
}

Para listados:

{
"success": true,
"message": "Items retrieved successfully",
"data": {
"items": [],
"total": 0,
"page": 1,
"page_size": 10
}
}

Para errores:

{
"success": false,
"message": "Validation error",
"errors": [
{
"field": "email",
"message": "Invalid email format"
}
]
}

Crear interfaces genéricas:

ApiResponse<T>
PaginatedResponse<T>
ApiErrorResponse
FieldError

============================================================
9. MAPEO DE ENDPOINTS
=====================

Crear archivo:

core/constants/api-endpoints.ts

Con este mapeo:

AUTH:

* POST /auth/login
* POST /auth/register
* GET /auth/me

USERS:

* GET /users
* POST /users
* PUT /users/{user_id}

PROVIDERS:

* GET /providers
* POST /providers
* PUT /providers/{provider_id}

INITIATIVES:

* GET /initiatives
* POST /initiatives
* PUT /initiatives/{initiative_id}

EXTERNAL RESOURCES:

* GET /external-resources
* POST /external-resources
* PUT /external-resources/{resource_id}

ASSIGNMENTS:

* GET /assignments
* POST /assignments
* PUT /assignments/{assignment_id}
* POST /assignments/{assignment_id}/generate-monthly-purchase-orders

PURCHASE ORDERS:

* GET /purchase-orders
* POST /purchase-orders
* PUT /purchase-orders/{purchase_order_id}

DASHBOARD:

* GET /dashboard/summary
* GET /dashboard/expiring-resources

IMPORTS:

* POST /imports/historical-excel
* GET /imports
* GET /imports/{batch_id}/errors

Implementar funciones helper para endpoints con ID.

Ejemplo conceptual:

API_ENDPOINTS = {
auth: {
login: '/auth/login',
me: '/auth/me'
},
providers: {
list: '/providers',
create: '/providers',
update: (id: string) => `/providers/${id}`
}
}

============================================================
10. MODELOS TYPESCRIPT
======================

Crear modelos TypeScript alineados al backend.

---

## 10.1 Auth

LoginRequest:

* email: string
* password: string

LoginResponse:

* access_token: string
* token_type: string
* expires_in: number
* user: AuthUser

AuthUser:

* id: string
* full_name: string
* email: string
* role: 'ADMIN' | 'MANAGER' | 'ANALYST'

---

## 10.2 User

User:

* id: string
* full_name: string
* email: string
* role: 'ADMIN' | 'MANAGER' | 'ANALYST'
* is_active: boolean

CreateUserRequest:

* full_name: string
* email: string
* password: string
* role: string
* is_active?: boolean

---

## 10.3 Provider

Provider:

* id: string
* name: string
* ruc?: string | null
* contact_name?: string | null
* contact_email?: string | null
* is_active: boolean
* created_at?: string

CreateProviderRequest:

* name: string
* ruc?: string | null
* contact_name?: string | null
* contact_email?: string | null

UpdateProviderRequest:

* name?: string
* ruc?: string | null
* contact_name?: string | null
* contact_email?: string | null
* is_active?: boolean

Importante:
No hardcodear empresas proveedoras reales.
Los proveedores deben venir del API o del Excel importado.
Para datos visuales demo, usar solo nombres genéricos si se requiere mock temporal:

* Proveedor Demo SAP
* Proveedor Demo Workato
* Proveedor Demo Full Stack
* Proveedor Demo BW

---

## 10.4 Initiative

Initiative:

* id: string
* name: string
* description?: string | null
* responsible_manager_id?: string | null
* budget_usd?: number | null
* is_active: boolean

CreateInitiativeRequest:

* name: string
* description?: string | null
* responsible_manager_id?: string | null
* budget_usd?: number | null

---

## 10.5 ExternalResource

ExternalResource:

* id: string
* consultant_name: string
* technical_profile: string
* document_number?: string | null
* is_active: boolean

CreateExternalResourceRequest:

* consultant_name: string
* technical_profile: string
* document_number?: string | null

Perfiles técnicos sugeridos para combos:

* ABAP
* FI
* Full Stack
* Workato
* BW
* QA
* Data
* Integraciones SAP
* Backend Python
* Frontend Angular

Importante:
technical_profile no es proveedor.
technical_profile describe la especialidad del consultor.

---

## 10.6 Assignment

Assignment:

* id: string
* consultant_name: string
* technical_profile: string
* provider_name: string
* main_initiative_name: string
* manager_name: string
* analyst_responsible_name?: string | null
* start_date: string
* end_date: string
* duration_months: number
* monthly_cost: number
* currency: 'USD' | 'PEN'
* exchange_rate?: number | null
* monthly_cost_usd: number
* total_cost_usd: number
* status: 'ACTIVE' | 'CLOSED' | 'CANCELLED'
* days_to_end: number
* expiration_alert: 'GREEN' | 'AMBER' | 'RED'
* purchase_orders_count: number

CreateAssignmentRequest:

* resource_id: string
* provider_id: string
* main_initiative_id: string
* manager_id: string
* analyst_responsible_id?: string | null
* start_date: string
* end_date: string
* duration_months: number
* monthly_cost: number
* currency: 'USD' | 'PEN'
* exchange_rate?: number | null
* comments?: string | null
* initiatives: AssignmentInitiativeRequest[]

AssignmentInitiativeRequest:

* initiative_id: string
* allocation_percentage: number
* is_primary: boolean
* is_funding_source: boolean

GeneratePurchaseOrdersRequest:

* overwrite_existing: boolean

GeneratePurchaseOrdersResponse:

* assignment_id: string
* generated_count: number
* skipped_count: number
* items: GeneratedPurchaseOrder[]

GeneratedPurchaseOrder:

* id: string
* period_month: string
* status: string
* amount_usd: number

---

## 10.7 PurchaseOrder

PurchaseOrder:

* id: string
* assignment_id: string
* consultant_name: string
* provider_name: string
* period_month: string
* po_number?: string | null
* status: 'PENDING' | 'COUPA_GENERATED' | 'SENT' | 'APPROVED' | 'CLOSED' | 'CANCELLED'
* amount: number
* currency: 'USD' | 'PEN'
* exchange_rate?: number | null
* amount_usd: number
* comments?: string | null

CreatePurchaseOrderRequest:

* assignment_id: string
* period_month: string
* po_number?: string | null
* status: string
* amount: number
* currency: 'USD' | 'PEN'
* exchange_rate?: number | null
* comments?: string | null

UpdatePurchaseOrderRequest:

* po_number?: string | null
* status?: string
* amount?: number
* currency?: 'USD' | 'PEN'
* exchange_rate?: number | null
* comments?: string | null

---

## 10.8 Dashboard

DashboardSummary:

* active_assignments: number
* expiring_soon: number
* expired: number
* total_monthly_cost_usd: number
* total_committed_cost_usd: number
* purchase_orders: PurchaseOrderStatusSummary
* expiration_alerts: ExpirationAlertSummary

PurchaseOrderStatusSummary:

* total: number
* pending: number
* coupa_generated: number
* sent: number
* approved: number
* closed: number

ExpirationAlertSummary:

* green: number
* amber: number
* red: number

ExpiringResource:

* assignment_id: string
* consultant_name: string
* technical_profile: string
* provider_name: string
* main_initiative_name: string
* end_date: string
* days_to_end: number
* expiration_alert: 'GREEN' | 'AMBER' | 'RED'

---

## 10.9 Imports

HistoricalImportRequest:

* file: File
* default_manager_id?: string
* default_exchange_rate?: number
* auto_generate_purchase_orders: boolean

HistoricalImportResult:

* batch_id: string
* file_name: string
* status: 'PROCESSING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED'
* total_rows: number
* successful_rows: number
* failed_rows: number
* created: ImportCreatedSummary
* errors: ImportError[]

ImportCreatedSummary:

* providers: number
* initiatives: number
* external_resources: number
* assignments: number
* purchase_orders: number

ImportBatch:

* id: string
* file_name: string
* imported_by: string
* total_rows: number
* successful_rows: number
* failed_rows: number
* status: string
* created_at: string

ImportError:

* row_number: number
* column_name?: string | null
* error_message: string
* raw_data?: any

============================================================
11. RUTAS DEL FRONTEND
======================

Crear rutas:

Public:

* /login

Protected:

* /dashboard
* /users
* /providers
* /initiatives
* /external-resources
* /assignments
* /assignments/new
* /assignments/:id
* /assignments/:id/edit
* /purchase-orders
* /imports/historical
* /imports/history
* /imports/:batchId/errors

Ruta default:

* Si está autenticado: redirect a /dashboard.
* Si no está autenticado: redirect a /login.

Ruta wildcard:

* Redirigir a /dashboard si autenticado.
* Redirigir a /login si no autenticado.

============================================================
12. PANTALLAS OBLIGATORIAS
==========================

---

## 12.1 Login

Ruta:
/login

Debe incluir:

* Logo o nombre ResourcePulse.
* Texto breve: "Gestión de recursos externos y presupuesto".
* Campo email.
* Campo password.
* Botón "Iniciar sesión".
* Loading al enviar.
* Mensaje de error si falla.
* Diseño centrado y profesional.
* Fondo sutil con tonos morados.

Validaciones:

* Email obligatorio.
* Email con formato válido.
* Password obligatorio.
* Password mínimo 8 caracteres.

Endpoint:
POST /auth/login

Input:
{
"email": "[admin@resourcepulse.com](mailto:admin@resourcepulse.com)",
"password": "Admin123"
}

Al éxito:

* Guardar token.
* Guardar usuario.
* Redirigir a /dashboard.

---

## 12.2 Layout principal

Debe incluir:

* Sidebar lateral.
* Header superior.
* Contenido principal.
* Nombre ResourcePulse.
* Usuario logueado.
* Rol del usuario.
* Botón de cerrar sesión.

Sidebar:

* Dashboard
* Usuarios, solo si ADMIN
* Proveedores
* Iniciativas
* Recursos externos
* Asignaciones
* Órdenes de compra
* Importar Excel
* Historial de importaciones

Responsive:

* Desktop: sidebar fijo.
* Tablet/mobile: sidebar colapsable tipo drawer.

---

## 12.3 Dashboard

Ruta:
/dashboard

Endpoints:

GET /dashboard/summary
GET /dashboard/expiring-resources

Debe mostrar KPIs:

* Asignaciones activas.
* Recursos por vencer.
* Recursos vencidos.
* Costo mensual total USD.
* Costo comprometido total USD.
* OCs pendientes.
* OCs aprobadas.
* OCs cerradas.

Debe mostrar secciones:

1. Cards KPI.
2. Semáforo de vencimientos.
3. Recursos próximos a vencer.
4. Resumen de OCs por estado.
5. Resumen financiero.

Diseño:

* Cards en grilla responsive.
* Iconos simples.
* Morado para indicadores principales.
* Verde, ámbar y rojo para semáforo.
* Tabla compacta para próximos vencimientos.

Semáforo:

* GREEN: más de 30 días.
* AMBER: entre 15 y 30 días.
* RED: menos de 15 días o vencido.

---

## 12.4 Usuarios

Ruta:
/users

Visible principalmente para ADMIN.

Endpoints:

GET /users
POST /users
PUT /users/{user_id}

Tabla:

* Nombre
* Email
* Rol
* Estado
* Acciones

Formulario:

* Nombre completo
* Email
* Password, solo al crear
* Rol
* Estado

Validaciones:

* Nombre obligatorio.
* Email obligatorio y válido.
* Password mínimo 8 caracteres al crear.
* Rol obligatorio.

---

## 12.5 Proveedores

Ruta:
/providers

Endpoints:

GET /providers
POST /providers
PUT /providers/{provider_id}

Tabla:

* Nombre
* RUC
* Contacto
* Email contacto
* Estado
* Acciones

Formulario:

* Nombre
* RUC opcional
* Contacto opcional
* Email contacto opcional
* Estado

Validaciones:

* Nombre obligatorio.
* Nombre mínimo 2 caracteres.
* Email contacto válido si se ingresa.

Reglas importantes:

* No hardcodear proveedores reales.
* Los proveedores vienen del backend o del Excel importado.
* No usar empresas no proporcionadas.
* Para placeholders usar:
  "Ej. Proveedor Demo SAP"

---

## 12.6 Iniciativas

Ruta:
/initiatives

Endpoints:

GET /initiatives
POST /initiatives
PUT /initiatives/{initiative_id}

Tabla:

* Nombre
* Manager responsable
* Presupuesto USD
* Estado
* Acciones

Formulario:

* Nombre
* Descripción
* Manager responsable
* Presupuesto USD
* Estado

Validaciones:

* Nombre obligatorio.
* Presupuesto mayor o igual a 0 si se ingresa.

---

## 12.7 Recursos externos

Ruta:
/external-resources

Endpoints:

GET /external-resources
POST /external-resources
PUT /external-resources/{resource_id}

Tabla:

* Consultor
* Perfil técnico
* Documento
* Estado
* Acciones

Formulario:

* Nombre del consultor
* Perfil técnico
* Documento opcional
* Estado

Combo de perfiles técnicos sugeridos:

* ABAP
* FI
* Full Stack
* Workato
* BW
* QA
* Data
* Integraciones SAP
* Backend Python
* Frontend Angular

Validaciones:

* Nombre del consultor obligatorio.
* Perfil técnico obligatorio.

Importante:

* Perfil técnico no es proveedor.
* Proveedor se selecciona en la asignación.

---

## 12.8 Asignaciones

Ruta:
/assignments

Endpoints:

GET /assignments
POST /assignments
PUT /assignments/{assignment_id}
POST /assignments/{assignment_id}/generate-monthly-purchase-orders

Tabla:

* Consultor
* Perfil
* Proveedor
* Iniciativa principal
* Manager
* Analista responsable
* Inicio
* Fin
* Duración
* Costo mensual USD
* Costo total USD
* Días restantes
* Semáforo
* OCs
* Estado
* Acciones

Filtros:

* Buscar por consultor.
* Proveedor.
* Iniciativa.
* Estado.
* Alerta: GREEN, AMBER, RED.
* Manager, solo si ADMIN.

Formulario:

* Consultor externo
* Proveedor
* Iniciativa principal
* Manager
* Analista responsable
* Fecha inicio
* Fecha fin
* Duración meses
* Costo mensual
* Moneda USD/PEN
* Tipo de cambio, obligatorio si PEN
* Comentarios
* Asignaciones parciales por iniciativa

Validaciones:

* Consultor obligatorio.
* Proveedor obligatorio.
* Iniciativa principal obligatoria.
* Manager obligatorio.
* Fecha inicio obligatoria.
* Fecha fin obligatoria.
* Fecha fin >= fecha inicio.
* Duración > 0.
* Costo mensual >= 0.
* Moneda obligatoria.
* Si moneda = PEN, tipo de cambio obligatorio y mayor a 0.
* La suma de porcentajes de iniciativas no debe superar 100.
* Solo una iniciativa principal.
* Solo una fuente de fondeo.

Botón importante:

"Generar OCs mensuales"

Al hacer click:

* Mostrar confirmación.
* Llamar POST /assignments/{assignment_id}/generate-monthly-purchase-orders.
* Mostrar generated_count y skipped_count.
* Refrescar tabla.

Confirmación sugerida:
"Se generará una OC por cada mes de la asignación. ¿Deseas continuar?"

---

## 12.9 Órdenes de compra

Ruta:
/purchase-orders

Endpoints:

GET /purchase-orders
POST /purchase-orders
PUT /purchase-orders/{purchase_order_id}

Tabla:

* Consultor
* Proveedor
* Periodo
* Número de OC
* Estado
* Importe
* Moneda
* Importe USD
* Comentarios
* Acciones

Filtros:

* Estado.
* Proveedor.
* Periodo desde.
* Periodo hasta.
* Asignación.

Formulario:

* Asignación
* Periodo mensual
* Número de OC
* Estado
* Importe
* Moneda
* Tipo de cambio si PEN
* Comentarios

Validaciones:

* Asignación obligatoria.
* Periodo obligatorio.
* Periodo debe ser mensual.
* Importe >= 0.
* Moneda obligatoria.
* Si moneda = PEN, tipo de cambio obligatorio.

Estados visuales:

* PENDING: amarillo suave
* COUPA_GENERATED: morado suave
* SENT: azul
* APPROVED: verde
* CLOSED: gris
* CANCELLED: rojo

No crear provider_id desde el frontend para OC.
El backend lo obtiene desde assignment_id.

---

## 12.10 Importación histórica desde Excel

Ruta:
/imports/historical

Endpoint:

POST /imports/historical-excel

Content-Type:
multipart/form-data

Pantalla debe incluir:

* Caja para cargar archivo .xlsx.
* Campo default_manager_id opcional.
* Campo default_exchange_rate opcional.
* Checkbox auto_generate_purchase_orders.
* Botón "Importar histórico".
* Mensaje de progreso.
* Resultado de importación.

Validaciones frontend:

* Archivo obligatorio.
* Solo aceptar extensión .xlsx.
* Si default_exchange_rate se ingresa, debe ser mayor a 0.
* auto_generate_purchase_orders default true.

Enviar FormData:

* file
* default_manager_id
* default_exchange_rate
* auto_generate_purchase_orders

Mostrar resultado:

* Estado de importación.
* Total filas.
* Filas exitosas.
* Filas con error.
* Proveedores creados.
* Iniciativas creadas.
* Recursos creados.
* Asignaciones creadas.
* OCs creadas.
* Tabla de errores si existen.

Columnas esperadas del Excel, mostrarlas como ayuda en pantalla:

* Proyecto
* Consultor
* Analista responsable
* Proveedor
* Perfil
* Costo Mensual [USD]
* Costo Mensual [PEN]
* Duración
* Costo Total [USD]
* Costo Total [PEN]
* Inicio
* Fin
* Comentarios
* Mes1
* Mes2
* Mes3
* Mes4
* Mes5
* Mes6
* Mes7
* Mes8

---

## 12.11 Historial de importaciones

Ruta:
/imports/history

Endpoint:

GET /imports

Tabla:

* Archivo
* Estado
* Total filas
* Exitosas
* Fallidas
* Fecha
* Acciones

Acción:

* Ver errores.

---

## 12.12 Errores de importación

Ruta:
/imports/:batchId/errors

Endpoint:

GET /imports/{batch_id}/errors

Tabla:

* Fila
* Columna
* Mensaje de error
* Data cruda, si existe

============================================================
13. SERVICIOS HTTP
==================

Crear un servicio por dominio.

AuthService:

* login(request: LoginRequest)
* me()
* logout()

UserService:

* getUsers(params)
* createUser(request)
* updateUser(id, request)

ProviderService:

* getProviders(params)
* createProvider(request)
* updateProvider(id, request)

InitiativeService:

* getInitiatives(params)
* createInitiative(request)
* updateInitiative(id, request)

ExternalResourceService:

* getExternalResources(params)
* createExternalResource(request)
* updateExternalResource(id, request)

AssignmentService:

* getAssignments(params)
* createAssignment(request)
* updateAssignment(id, request)
* generateMonthlyPurchaseOrders(id, request)

PurchaseOrderService:

* getPurchaseOrders(params)
* createPurchaseOrder(request)
* updatePurchaseOrder(id, request)

DashboardService:

* getSummary()
* getExpiringResources()

ImportService:

* importHistoricalExcel(formData)
* getImportBatches()
* getImportErrors(batchId)

Cada servicio debe:

* Usar environment.apiUrl.
* Usar API_ENDPOINTS.
* Retornar Observables tipados.
* No contener lógica visual.
* Manejar tipos correctamente.

============================================================
14. COMPONENTES COMPARTIDOS
===========================

Crear componentes reutilizables:

1. PageHeaderComponent
   Props:

* title
* subtitle
* actionLabel
* showAction
* icon

2. StatCardComponent
   Props:

* title
* value
* subtitle
* icon
* variant

3. StatusChipComponent
   Props:

* status
* type

Debe soportar:

* Estados de OC.
* Estados de asignación.

4. ExpirationBadgeComponent
   Props:

* alert
* daysToEnd

Debe mostrar:

* GREEN
* AMBER
* RED

5. LoadingSpinnerComponent
   Uso:

* Pantallas cargando.
* Botones enviando.

6. EmptyStateComponent
   Uso:

* Tablas sin datos.

7. ConfirmDialogComponent
   Uso:

* Confirmar generación de OCs.
* Confirmar desactivación o actualización sensible.

8. FileUploadBoxComponent
   Uso:

* Carga de Excel.

============================================================
15. VALIDACIONES DE FORMULARIOS
===============================

Usar Reactive Forms.

Validaciones comunes:

* required
* email
* minLength
* min
* max
* date range
* conditional validators

Validación condicional:

Si currency = PEN:

* exchange_rate required
* exchange_rate > 0

Si currency = USD:

* exchange_rate puede quedar vacío o 1

Asignaciones parciales:

* suma de allocation_percentage <= 100
* solo un is_primary = true
* solo un is_funding_source = true

Importación:

* archivo .xlsx obligatorio
* default_exchange_rate > 0 si se ingresa

Mostrar errores bajo cada campo con mat-error.

============================================================
16. TABLAS Y FILTROS
====================

Usar Angular Material Table o una tabla custom profesional.

Cada tabla debe tener:

* Loading state.
* Empty state.
* Paginación.
* Búsqueda.
* Filtros relevantes.
* Acciones por fila.
* Chips de estado.
* Formato de moneda.
* Formato de fecha.

No cargar todo en memoria si el backend pagina.
Enviar page y page_size al backend.

Query params comunes:

* search
* page
* page_size
* is_active
* status

============================================================
17. MANEJO DE ERRORES
=====================

Crear NotificationService para mensajes:

* Éxito
* Error
* Advertencia
* Información

Usar MatSnackBar.

Errores comunes:

401:

* Sesión expirada.
* Limpiar sesión.
* Redirigir a /login.

403:

* Mostrar "No tienes permisos para realizar esta acción."

400/422:

* Mostrar errores de validación.
* Si hay errores por campo, mapearlos al formulario si corresponde.

500:

* Mostrar "Ocurrió un error inesperado. Intenta nuevamente."

Importación Excel:

* Mostrar errores por fila en tabla.
* No mostrar solo mensaje genérico.

============================================================
18. FORMATO VISUAL DE ESTADOS
=============================

Semáforo de vencimiento:

GREEN:

* Label: Vigente
* Color: verde
* Uso: más de 30 días

AMBER:

* Label: Por vencer
* Color: ámbar
* Uso: 15 a 30 días

RED:

* Label: Crítico / vencido
* Color: rojo
* Uso: menos de 15 días o vencido

Estados de OC:

PENDING:

* Label: Pendiente
* Color: ámbar suave

COUPA_GENERATED:

* Label: Coupa generado
* Color: morado suave

SENT:

* Label: OC enviada
* Color: azul

APPROVED:

* Label: Aprobada
* Color: verde

CLOSED:

* Label: Cerrada
* Color: gris

CANCELLED:

* Label: Cancelada
* Color: rojo

Estados de asignación:

ACTIVE:

* Label: Activa
* Color: verde

CLOSED:

* Label: Cerrada
* Color: gris

CANCELLED:

* Label: Cancelada
* Color: rojo

============================================================
19. UX ESPECÍFICA DEL RETO
==========================

El usuario final es un manager del área, por lo que la interfaz debe ser entendible para personas no técnicas.

Priorizar:

* Dashboard claro al ingresar.
* Alertas visibles.
* Semáforo fácil de interpretar.
* Filtros simples.
* Formularios ordenados.
* Botones con texto claro.
* Mensajes de éxito/error comprensibles.
* Evitar tecnicismos innecesarios en la UI.

Textos sugeridos:

Dashboard:
"Resumen de recursos externos"

Asignaciones:
"Gestiona la contratación, costos y vencimientos de tus recursos externos."

OCs:
"Control mensual de órdenes de compra asociadas a cada asignación."

Importación:
"Importa información histórica desde el Excel actual."

============================================================
20. README Y DOCUMENTACIÓN FRONTEND
===================================

Crear README.md del frontend con:

1. Nombre del proyecto:
   ResourcePulse Frontend

2. Descripción:
   Aplicación Angular para gestionar recursos externos, asignaciones, presupuesto, OCs mensuales e importación histórica desde Excel.

3. Stack:
   Angular, TypeScript, Angular Material, JWT, SCSS.

4. Arquitectura de carpetas.

5. Configuración de environment.

6. Cómo ejecutar localmente:

* npm install
* ng serve
* URL local

7. Módulos implementados:

* Login
* Dashboard
* Usuarios
* Proveedores
* Iniciativas
* Recursos externos
* Asignaciones
* Órdenes de compra
* Importación Excel

8. Mapeo de endpoints.

9. Seguridad:

* JWT
* Interceptor
* Guards
* Roles

10. Diseño:

* Paleta principal morada
* Diseño responsive
* Angular Material

11. Limitaciones actuales:

* No hay IA.
* No hay reportes PDF.
* No hay integración real con Coupa.
* Depende del backend FastAPI.

12. Próximos pasos:

* Mejorar gráficos.
* Agregar reportes ejecutivos.
* Agregar pruebas unitarias.
* Agregar exportación Excel/PDF.

============================================================
21. CRITERIOS DE CALIDAD ANTES DE FINALIZAR
===========================================

Antes de dar por terminado el frontend, validar:

* La aplicación compila sin errores.
* No hay errores de TypeScript.
* No hay imports rotos.
* No hay rutas rotas.
* Login funciona.
* Token JWT se guarda correctamente.
* Interceptor envía Authorization Bearer Token.
* AuthGuard protege rutas.
* Logout limpia sesión.
* Dashboard consume endpoints reales.
* Tablas consumen endpoints reales.
* Formularios validan correctamente.
* Se muestran errores del backend.
* Diseño mantiene color morado elegante.
* Layout es responsive.
* Sidebar funciona en desktop y móvil.
* Las tablas no rompen el diseño en móvil.
* La importación Excel envía FormData correctamente.
* No hay proveedores reales hardcodeados.
* No hay lógica duplicada.
* No hay TODOs pendientes.
* README.md está actualizado.

============================================================
22. RESULTADO ESPERADO
======================

Resultado esperado:

Un frontend Angular profesional, moderno, responsive, elegante y funcional para ResourcePulse.

Debe incluir:

* Login con JWT.
* Layout principal con sidebar y header.
* Dashboard con KPIs y alertas.
* Gestión de usuarios.
* Gestión de proveedores configurables.
* Gestión de iniciativas.
* Gestión de recursos externos.
* Gestión de asignaciones.
* Generación de OCs mensuales.
* Gestión de órdenes de compra.
* Importación histórica desde Excel.
* Historial de importaciones.
* Visualización de errores de importación.
* Manejo profesional de loading, empty states y errores.
* Diseño responsive con color principal morado elegante.
* Mapeo correcto de endpoints del backend.
* README.md documentado.
