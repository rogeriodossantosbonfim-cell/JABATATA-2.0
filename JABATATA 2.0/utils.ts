export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const isToday = (dateStr: string): boolean => {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isCurrentMonth = (dateStr: string): boolean => {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};