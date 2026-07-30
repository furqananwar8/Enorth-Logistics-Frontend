// Helper: strip time/timezone, keep YYYY-MM-DD
export const formatShipDate = (date: string | Date | undefined): string | undefined => {
  if (!date) return undefined;
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, '0');
  // Use LOCAL getters — the date picker represents your local calendar date
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};