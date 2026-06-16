import { APP_COLORS } from './app-colors';

export type UserRole = 'ADMIN' | 'MANAGER' | 'ANALYST';

export type AssignmentStatus = 'ACTIVE' | 'CLOSED' | 'CANCELLED';

export type PurchaseOrderStatus =
  | 'PENDING'
  | 'COUPA_GENERATED'
  | 'SENT'
  | 'APPROVED'
  | 'CLOSED'
  | 'CANCELLED';

export type ExpirationAlert = 'GREEN' | 'AMBER' | 'RED';

export const TECHNICAL_PROFILES = [
  'ABAP',
  'FI',
  'Full Stack',
  'Workato',
  'BW',
  'QA',
  'Data',
  'Integraciones SAP',
  'Backend Python',
  'Frontend Angular',
] as const;

export const ASSIGNMENT_STATUS_CONFIG: Record<
  AssignmentStatus,
  { label: string; color: string; bg: string }
> = {
  ACTIVE: { label: 'Activa', color: APP_COLORS.successGreen, bg: '#DCFCE7' },
  CLOSED: { label: 'Cerrada', color: APP_COLORS.neutralGray, bg: '#F3F4F6' },
  CANCELLED: { label: 'Cancelada', color: APP_COLORS.dangerRed, bg: '#FEE2E2' },
};

export const PURCHASE_ORDER_STATUS_CONFIG: Record<
  PurchaseOrderStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: 'Pendiente', color: APP_COLORS.warningAmber, bg: '#FEF3C7' },
  COUPA_GENERATED: { label: 'Coupa generado', color: APP_COLORS.accentViolet, bg: APP_COLORS.softPurple },
  SENT: { label: 'OC enviada', color: APP_COLORS.infoBlue, bg: '#DBEAFE' },
  APPROVED: { label: 'Aprobada', color: APP_COLORS.successGreen, bg: '#DCFCE7' },
  CLOSED: { label: 'Cerrada', color: APP_COLORS.neutralGray, bg: '#F3F4F6' },
  CANCELLED: { label: 'Cancelada', color: APP_COLORS.dangerRed, bg: '#FEE2E2' },
};

export const EXPIRATION_ALERT_CONFIG: Record<
  ExpirationAlert,
  { label: string; color: string; bg: string }
> = {
  GREEN: { label: 'Vigente', color: APP_COLORS.successGreen, bg: '#DCFCE7' },
  AMBER: { label: 'Por vencer', color: APP_COLORS.warningAmber, bg: '#FEF3C7' },
  RED: { label: 'Crítico / vencido', color: APP_COLORS.dangerRed, bg: '#FEE2E2' },
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Manager',
  ANALYST: 'Analista',
};
