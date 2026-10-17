export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)} at ${formatTime(dateStr)}`;
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'critical': return 'brutal-badge-coral';
    case 'high': return 'brutal-badge-coral';
    case 'medium': return 'brutal-badge-lime';
    case 'low': return 'brutal-badge-muted';
    default: return 'brutal-badge-muted';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'brutal-badge-success';
    case 'active': return 'brutal-badge-lime';
    case 'failed': return 'brutal-badge-coral';
    case 'missed': return 'brutal-badge-muted';
    default: return 'brutal-badge-muted';
  }
}
