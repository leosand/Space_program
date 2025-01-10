/**
 * Format a number with commas as thousands separators
 */
export const formatNumber = (
  number: number,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(locale, options).format(number);
};

/**
 * Format a number as currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number as a percentage
 */
export const formatPercentage = (
  number: number,
  locale: string = 'en-US',
  decimals: number = 1
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Format a number with metric prefixes (K, M, B)
 */
export const formatCompactNumber = (
  number: number,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};

/**
 * Format a number with specified decimal places
 */
export const formatDecimal = (
  number: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Format a number as a file size (bytes, KB, MB, GB)
 */
export const formatFileSize = (bytes: number, locale: string = 'en-US'): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatDecimal(size, unitIndex === 0 ? 0 : 2, locale)} ${units[unitIndex]}`;
};

/**
 * Calculate the percentage between two numbers
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return value / total;
};

/**
 * Round a number to a specified number of decimal places
 */
export const roundNumber = (number: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(number * factor) / factor;
}; 