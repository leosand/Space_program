/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a date string to include time
 */
export const formatDateTime = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
};

/**
 * Get relative time string (e.g., "2 days ago" or "in 3 hours")
 */
export const getRelativeTime = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  const now = new Date();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const diffInMilliseconds = date.getTime() - now.getTime();
  const diffInSeconds = Math.round(diffInMilliseconds / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);

  if (Math.abs(diffInDays) >= 7) {
    return formatDate(dateString, locale);
  }

  if (Math.abs(diffInDays) > 0) {
    return rtf.format(diffInDays, 'day');
  }

  if (Math.abs(diffInHours) > 0) {
    return rtf.format(diffInHours, 'hour');
  }

  if (Math.abs(diffInMinutes) > 0) {
    return rtf.format(diffInMinutes, 'minute');
  }

  return rtf.format(diffInSeconds, 'second');
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date.getTime() > now.getTime();
};

/**
 * Get the year from a date string
 */
export const getYear = (dateString: string): number => {
  return new Date(dateString).getFullYear();
};

/**
 * Group dates by year
 */
export const groupByYear = <T extends { launch_date_utc: string }>(
  items: T[]
): Record<number, T[]> => {
  return items.reduce((acc, item) => {
    const year = getYear(item.launch_date_utc);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {} as Record<number, T[]>);
};

/**
 * Sort dates in ascending or descending order
 */
export const sortDates = <T extends { launch_date_utc: string }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.launch_date_utc).getTime();
    const dateB = new Date(b.launch_date_utc).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}; 