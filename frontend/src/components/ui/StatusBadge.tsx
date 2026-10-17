import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: 'active' | 'completed' | 'failed' | 'missed' | 'urgent' | 'critical' | 'high' | 'medium' | 'low' | 'online' | 'offline' | 'simulated';
  children?: ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className = '' }: StatusBadgeProps) {
  let badgeClass = 'brutal-badge-muted';

  switch (status) {
    case 'active':
    case 'online':
    case 'completed':
      badgeClass = 'brutal-badge-lime';
      break;
    case 'failed':
    case 'critical':
    case 'urgent':
    case 'high':
      badgeClass = 'brutal-badge-coral';
      break;
    case 'medium':
      badgeClass = 'brutal-badge-lime';
      break;
    case 'missed':
    case 'low':
    case 'offline':
      badgeClass = 'brutal-badge-muted';
      break;
    case 'simulated':
      badgeClass = 'bg-[#EDE8DD] text-[#171717] border-[2px] border-[#171717]';
      break;
  }

  return (
    <span className={`brutal-badge ${badgeClass} ${className}`}>
      {children || status.toUpperCase()}
    </span>
  );
}
