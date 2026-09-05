/**
 * Helper formatting utilities for dates, numbers, percentages and text
 */

export const formatDate = (isoString) => {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (e) {
    return isoString;
  }
};

export const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  return `${Number(val).toFixed(2)}%`;
};

export const truncateText = (text, maxLength = 60) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
