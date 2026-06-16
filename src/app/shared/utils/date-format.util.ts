export function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  const date = new Date(value as string);
  return isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | Date | null | undefined): string {
  const date = value instanceof Date ? value : toDate(value);
  if (!date) {
    return typeof value === 'string' && value ? value : '-';
  }
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return toDate(value);
  }
  return new Date(year, month - 1, day);
}

export function formatApiMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function parseApiMonth(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const [year, month] = value.split('-').map(Number);
  if (!year || !month) {
    return toDate(value);
  }
  return new Date(year, month - 1, 1);
}

export function formatMonthYear(value: string | Date | null | undefined): string {
  const date = value instanceof Date ? value : parseApiMonth(typeof value === 'string' ? value : null);
  if (!date) {
    return typeof value === 'string' && value ? value : '-';
  }
  return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'long' });
}
