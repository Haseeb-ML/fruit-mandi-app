export function formatRs(amount) {
  const num = Number(amount) || 0;
  return `Rs ${num.toLocaleString('en-IN')}`;
}

export function formatNum(amount) {
  const num = Number(amount) || 0;
  return num.toLocaleString('en-IN');
}

export function getInitials(name = 'AK') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AK';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getTodayDisplay() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
