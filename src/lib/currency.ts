// Currency formatting utilities for RWF (Rwandan Francs)

/**
 * Format a number as RWF currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted RWF string
 */
export function formatRWF(
  amount: number | string,
  options: {
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
) {
  const {
    showSymbol = true,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return 'RWF 0';
  }

  if (showSymbol) {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(numAmount);
  } else {
    return new Intl.NumberFormat('en-RW', {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(numAmount) + ' RWF';
  }
}

/**
 * Format a price for display (no decimal places for RWF)
 * @param price - The price to format
 * @returns Formatted price string
 */
export function formatPrice(price: number | string): string {
  return formatRWF(price, { showSymbol: true, minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/**
 * Format a price without currency symbol
 * @param price - The price to format
 * @returns Formatted price string without RWF symbol
 */
export function formatPriceNoSymbol(price: number | string): string {
  return formatRWF(price, { showSymbol: false, minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/**
 * Format a total amount with 2 decimal places for precision
 * @param amount - The amount to format
 * @returns Formatted amount string
 */
export function formatTotal(amount: number | string): string {
  return formatRWF(amount, { showSymbol: true, minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
