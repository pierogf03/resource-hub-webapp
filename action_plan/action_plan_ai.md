PLAN FINAL FRONTEND — RESOURCE HUB AI CHAT POR API

Objetivo:
Implementar en Angular un chat embebido en Resource Hub para interactuar con Resource Hub Assistant. El frontend enviará mensajes al backend mediante POST /ai/chat/messages y mostrará la respuesta del asistente en una experiencia de chat profesional, responsive y alineada al diseño del sistema.

Este enfoque es la arquitectura final del chat IA. Angular no se conecta directamente a Workato.

Nombre del sistema:
Resource Hub

Nombre del asistente:
Resource Hub Assistant

Color principal:
Morado elegante #5B21B6

============================================================

1. ARQUITECTURA FINAL FRONTEND
   ============================================================

Usuario
↓
Chat Resource Hub
↓
AiChatService
↓
POST /ai/chat/messages
↓
FastAPI Resource Hub
↓
Workato/Genie por API
↓
Respuesta normalizada
↓
Chat Resource Hub

Reglas:

* Angular solo llama al backend Resource Hub.
* Angular no conoce Workato.
* Angular no guarda API keys.
* El JWT se envía mediante AuthInterceptor.
* El chat debe estar disponible dentro del layout autenticado.
* No debe aparecer en login.

============================================================
2. CUMPLIMIENTO DEL CHALLENGE
=============================

El chat debe reforzar los módulos core del challenge:

* Recursos externos.
* Alertas de vencimiento.
* Control de OCs mensuales.
* Presupuesto en USD.
* Visibilidad por manager.
* Importación histórica Excel.

El asistente debe poder responder:

* Dame un resumen del área.
* ¿Qué recursos están por vencer?
* ¿Qué recursos están en rojo?
* ¿Cuántas OCs están pendientes?
* Muéstrame las OCs de este mes.
* ¿Cuál es el presupuesto comprometido?
* ¿Cómo salió la última importación?
* Genera las OCs mensuales de una asignación.
* Marca una OC como aprobada.

============================================================
3. MÓDULOS EXISTENTES QUE NO SE DEBEN ROMPER
============================================

Mantener:

* Login
* Dashboard
* Usuarios
* Proveedores
* Iniciativas
* Recursos externos
* Asignaciones
* Órdenes de compra
* Importación Excel
* Historial
* JWT AuthInterceptor
* AuthGuard
* RoleGuard
* ErrorInterceptor
* Layout responsive
* Sidebar
* Header

No usar:

* ResourcePulse
* Resoruse Hub

Usar siempre:

* Resource Hub

============================================================
4. ESTRUCTURA DE ARCHIVOS
=========================

Crear:

src/app/features/ai-chat/
chat-widget/
chat-widget.component.ts
chat-widget.component.html
chat-widget.component.scss

chat-panel/
chat-panel.component.ts
chat-panel.component.html
chat-panel.component.scss

chat-message/
chat-message.component.ts
chat-message.component.html
chat-message.component.scss

chat-input/
chat-input.component.ts
chat-input.component.html
chat-input.component.scss

chat-suggestions/
chat-suggestions.component.ts
chat-suggestions.component.html
chat-suggestions.component.scss

chat-pending-action/
chat-pending-action.component.ts
chat-pending-action.component.html
chat-pending-action.component.scss

Crear:

src/app/core/models/ai-chat.model.ts
src/app/core/services/ai-chat.service.ts

Actualizar:

src/app/core/constants/api-endpoints.ts
src/app/layout/main-layout/main-layout.component.html
src/app/layout/main-layout/main-layout.component.ts
src/app/layout/main-layout/main-layout.component.scss
src/app/core/interceptors/error.interceptor.ts
src/app/core/services/notification.service.ts
README.md

============================================================
5. ENDPOINTS FRONTEND
=====================

Agregar en api-endpoints.ts:

aiChat: {
sendMessage: '/ai/chat/messages',
confirmAction: '/ai/chat/actions/confirm'
}

No agregar endpoints directos de Workato.

============================================================
6. MODELOS TYPESCRIPT
=====================

Crear ai-chat.model.ts:

export interface AiChatMessageRequest {
message: string;
conversation_id?: string | null;
metadata?: AiChatMetadata;
}

export interface AiChatMetadata {
source?: string;
screen?: string;
}

export interface AiChatMessageResponse {
conversation_id: string;
reply: string;
intent?: string | null;
used_skills?: string[];
suggested_questions?: string[];
requires_confirmation: boolean;
pending_action?: AiPendingAction | null;
created_at?: string;
}

export interface AiPendingAction {
action_id: string;
action_type: 'generate_monthly_purchase_orders' | 'update_purchase_order_status' | string;
summary: string;
payload: any;
}

export interface AiChatConfirmActionRequest {
conversation_id: string;
action_id: string;
approved: boolean;
rejection_reason?: string | null;
}

export interface AiChatConfirmActionResponse {
conversation_id: string;
action_id: string;
status: 'APPROVED' | 'REJECTED' | 'FAILED';
reply: string;
result?: any;
}

export type ChatMessageSource = 'user' | 'assistant' | 'system';

export interface ChatMessage {
id: string;
source: ChatMessageSource;
content: string;
created_at: string;
is_loading?: boolean;
used_skills?: string[];
intent?: string | null;
}

============================================================
7. SERVICIO ai-chat.service.ts
==============================

Crear AiChatService.

Métodos:

sendMessage(
request: AiChatMessageRequest
): Observable<ApiResponse<AiChatMessageResponse>>

confirmAction(
request: AiChatConfirmActionRequest
): Observable<ApiResponse<AiChatConfirmActionResponse>>

Reglas:

* Usar environment.apiUrl.
* Usar API_ENDPOINTS.aiChat.
* Usar HttpClient.
* El token JWT lo adjunta AuthInterceptor.
* No llamar a Workato directamente.
* Tipar todas las respuestas.
* No usar any salvo en payload de pending_action.

Ejemplo lógico:

sendMessage(request) {
return this.http.post<ApiResponse<AiChatMessageResponse>>(
`${environment.apiUrl}${API_ENDPOINTS.aiChat.sendMessage}`,
request
);
}

confirmAction(request) {
return this.http.post<ApiResponse<AiChatConfirmActionResponse>>(
`${environment.apiUrl}${API_ENDPOINTS.aiChat.confirmAction}`,
request
);
}

============================================================
8. CHAT WIDGET
==============

Crear ChatWidgetComponent.

Responsabilidad:
Mostrar botón flotante para abrir/cerrar Resource Hub Assistant.

Ubicación:

* Inferior derecho.

Diseño:

* Botón circular.
* Fondo morado #5B21B6.
* Ícono de chat.
* Sombra suave.
* Tooltip: Resource Hub Assistant.

Reglas:

* Mostrar solo si el usuario está autenticado.
* No mostrar en /login.
* No bloquear navegación.
* En móvil debe ser accesible.

============================================================
9. CHAT PANEL
=============

Crear ChatPanelComponent.

Debe incluir:

Header:

* Título: Resource Hub Assistant
* Subtítulo: Consulta recursos, OCs, vencimientos y presupuesto
* Botón cerrar
* Botón limpiar conversación

Body:

* Lista de mensajes.
* Loading mientras responde.
* Chips de skills usadas.
* Acción pendiente si existe.
* Preguntas sugeridas.

Footer:

* ChatInputComponent.

Diseño desktop:

* Panel lateral derecho.
* Width: 440px.
* Height: 100vh.
* Position fixed.
* Right: 0.
* Top: 0.
* Z-index alto.
* Fondo blanco.
* Sombra lateral.

Diseño tablet:

* Width: 80vw.

Diseño mobile:

* Width: 100vw.
* Height: 100vh.
* Fullscreen.
* Header fijo.
* Input fijo abajo.
* Mensajes con scroll.

============================================================
10. CHAT MESSAGE
================

Crear ChatMessageComponent.

Tipos:

User:

* Alineado derecha.
* Fondo morado suave.
* Texto oscuro.

Assistant:

* Alineado izquierda.
* Fondo blanco o gris claro.
* Borde suave.

System:

* Centrado.
* Texto pequeño y gris.

Debe soportar:

* Saltos de línea.
* Listas simples.
* Loading.
* Chips con used_skills.
* Intent opcional.

Texto para skills:
"Skills usadas: get_dashboard_summary, get_expiring_resources"

============================================================
11. CHAT INPUT
==============

Crear ChatInputComponent.

Debe incluir:

* Textarea.
* Botón enviar.
* Enter para enviar.
* Shift + Enter para salto de línea.
* Máximo 4000 caracteres.
* Validación de mensaje vacío.
* Deshabilitar mientras isSending = true.

Placeholder:
Pregúntale a Resource Hub Assistant...

Validaciones:

* No enviar vacío.
* No enviar solo espacios.
* No exceder 4000 caracteres.

============================================================
12. CHAT SUGGESTIONS
====================

Crear ChatSuggestionsComponent.

Mostrar cuando:

* El chat está vacío.
* El backend devuelve suggested_questions.
* El usuario limpia conversación.

Sugerencias iniciales:

* Dame un resumen del área
* ¿Qué recursos están por vencer?
* ¿Qué recursos están en rojo?
* ¿Cuántas OCs están pendientes?
* Muéstrame las OCs de este mes
* ¿Cuál es el presupuesto comprometido?
* ¿Cómo salió la última importación?

Al hacer clic:

* Enviar la sugerencia como mensaje.

============================================================
13. CHAT PENDING ACTION
=======================

Crear ChatPendingActionComponent.

Se muestra cuando la respuesta trae:

requires_confirmation = true
pending_action != null

Debe mostrar:

Título:
Confirmación requerida

Contenido:
pending_action.summary

Detalle opcional:

* action_type
* payload resumido en formato legible

Botones:

* Confirmar
* Cancelar

Confirmar:
Llamar POST /ai/chat/actions/confirm con:

{
"conversation_id": "...",
"action_id": "...",
"approved": true,
"rejection_reason": null
}

Cancelar:
Llamar POST /ai/chat/actions/confirm con:

{
"conversation_id": "...",
"action_id": "...",
"approved": false,
"rejection_reason": "El usuario canceló la acción desde el chat"
}

Después de confirmar:

* Agregar mensaje del sistema indicando que se está procesando.
* Mostrar respuesta final del backend.
* Limpiar pending_action.

============================================================
14. FLUJO DEL CHAT
==================

Al abrir:

1. Mostrar panel.
2. Si no hay conversation_id, iniciar en null.
3. Mostrar sugerencias iniciales si no hay mensajes.

Al enviar mensaje:

1. Agregar mensaje del usuario inmediatamente.
2. Agregar mensaje assistant con is_loading = true.
3. Llamar POST /ai/chat/messages.
4. Remover loading.
5. Agregar reply del asistente.
6. Guardar conversation_id.
7. Mostrar used_skills si existen.
8. Mostrar suggested_questions si existen.
9. Si requires_confirmation = true, mostrar ChatPendingActionComponent.

Al confirmar acción:

1. Llamar POST /ai/chat/actions/confirm.
2. Mostrar loading.
3. Agregar reply final del backend.
4. Limpiar pending_action.

Al rechazar acción:

1. Llamar POST /ai/chat/actions/confirm con approved=false.
2. Agregar mensaje:
   "Acción cancelada. No se realizó ningún cambio."

Al limpiar conversación:

1. Borrar mensajes locales.
2. Borrar conversation_id.
3. Borrar pending_action.
4. Mostrar sugerencias iniciales.

============================================================
15. ESTADO DEL CHAT
===================

ChatPanel debe manejar:

* isOpen
* isSending
* conversationId
* messages: ChatMessage[]
* pendingAction: AiPendingAction | null
* suggestedQuestions: string[]
* errorMessage: string | null

Persistir en sessionStorage:

resourceHubChatConversationId
resourceHubChatMessages

Al logout:

* Limpiar sessionStorage del chat.

============================================================
16. DISEÑO VISUAL
=================

Usar paleta actual:

Primary Purple: #5B21B6
Deep Purple: #3B0764
Accent Violet: #7C3AED
Soft Purple: #EDE9FE
Background: #F8F7FC
Surface: #FFFFFF
Text Primary: #1F2937
Text Secondary: #6B7280
Border: #E5E7EB
Success Green: #16A34A
Warning Amber: #F59E0B
Danger Red: #DC2626
Info Blue: #2563EB

Reglas:

* Botón flotante morado.
* Header del chat morado.
* Mensajes del usuario en morado suave.
* Mensajes del asistente en blanco/gris claro.
* Tarjeta de confirmación en ámbar suave.
* Diseño profesional.
* No saturar de morado.
* Mantener legibilidad.

============================================================
17. RESPONSIVE
==============

Desktop:

* Panel derecho de 440px.
* No desplaza el contenido principal.

Tablet:

* Panel 80% ancho.

Mobile:

* Panel fullscreen.
* Header compacto.
* Input fijo abajo.
* Mensajes con scroll.
* Botones táctiles.

Validar:

* 1440px.
* 1024px.
* 768px.
* 390px.

============================================================
18. MANEJO DE ERRORES
=====================

401:

* AuthInterceptor cierra sesión y redirige a login.

403:
Mostrar:
No tienes permisos para usar el asistente o ejecutar esta acción.

500:
Mostrar:
Ocurrió un error al contactar al asistente.

504:
Mostrar:
El asistente está tardando más de lo esperado. Intenta nuevamente.

Respuesta sin reply:
Mostrar:
No se recibió una respuesta válida del asistente.

Error confirmando acción:
Mostrar:
No se pudo completar la acción solicitada.

============================================================
19. INTEGRACIÓN EN MAIN LAYOUT
==============================

Agregar en main-layout.component.html:

<app-chat-widget></app-chat-widget>

Condición:
Mostrar solo si el usuario está autenticado.

No mostrar en /login.

============================================================
20. README FRONTEND
===================

Actualizar README.md con sección:

Resource Hub Assistant

Incluir:

* Descripción.
* Arquitectura final por API.
* Endpoint POST /ai/chat/messages.
* Endpoint POST /ai/chat/actions/confirm.
* Componentes creados.
* Seguridad.
* Flujo de confirmaciones.
* Limitaciones.
* Próximos pasos.

Indicar:
Angular consume únicamente el backend Resource Hub. La integración con Workato/Genie se realiza desde FastAPI.

============================================================
21. PRUEBAS MANUALES
====================

Probar:

1. Login funciona.
2. Chat no aparece en /login.
3. Chat aparece en layout autenticado.
4. Botón abre y cierra panel.
5. Enviar mensaje llama POST /ai/chat/messages.
6. El mensaje del usuario aparece de inmediato.
7. Se muestra loading mientras responde.
8. Se muestra reply del asistente.
9. Se muestran skills usadas.
10. Se muestran preguntas sugeridas.
11. Acción pendiente muestra confirmación.
12. Confirmar acción llama POST /ai/chat/actions/confirm.
13. Rechazar acción no ejecuta cambios.
14. Error 401 redirige a login.
15. Error 403 muestra mensaje de permisos.
16. Diseño responsive funciona.
17. No existen API keys de Workato en Angular.
18. No hay textos ResourcePulse.
19. No hay textos Resoruse Hub.
20. App compila sin errores.
21. README actualizado.

============================================================
22. CRITERIOS DE ACEPTACIÓN
===========================

El frontend queda completo cuando:

* Existe módulo ai-chat.
* ChatWidget aparece en el layout principal.
* ChatPanel es responsive.
* AiChatService consume POST /ai/chat/messages.
* AiChatService consume POST /ai/chat/actions/confirm.
* El chat muestra respuestas del asistente.
* El chat muestra used_skills.
* El chat muestra suggested_questions.
* El chat soporta pending_action.
* El usuario puede confirmar o rechazar acciones.
* El diseño respeta el color morado elegante.
* Angular no llama a Workato.
* No hay API keys en frontend.
* No hay referencias a ResourcePulse.
* No hay errores de compilación.
* README actualizado.

Resultado esperado:
Frontend Angular de Resource Hub con chat IA embebido, profesional y responsive, conectado al backend mediante una arquitectura final por API, cumpliendo el bonus de IA integrada del challenge.
