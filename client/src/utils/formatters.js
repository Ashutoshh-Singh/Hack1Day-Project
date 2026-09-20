/**
 * General text and currency formatting helpers
 */

export function formatCurrency(amount) {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatLakhs(lakhs) {
  const num = Number(lakhs);
  if (isNaN(num)) return '₹0';
  if (num === 0) return '₹0 (Zero)';
  if (num < 1) return `₹${num * 100} Thousand`;
  return `₹${num} Lakh${num > 1 ? 's' : ''}`;
}
