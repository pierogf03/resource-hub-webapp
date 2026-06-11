export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
