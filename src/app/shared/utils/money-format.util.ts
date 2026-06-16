export function convertToUsd(
  amount: number,
  currency: 'USD' | 'PEN',
  exchangeRate?: number | null
): number | null {
  if (currency === 'USD') {
    return amount;
  }
  if (!exchangeRate || exchangeRate <= 0) {
    return null;
  }
  return amount / exchangeRate;
}

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
