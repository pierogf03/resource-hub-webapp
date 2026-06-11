export function formatUsd(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '-';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPen(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '-';
  }
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(value);
}
