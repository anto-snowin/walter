import { ReactNode } from 'react';

interface StatusBadgeProps {
  status:
    | 'active'
    | 'completed'
    | 'failed'
    | 'missed'
    | 'urgent'
    | 'critical'
    | 'high'
    | 'medium'
    | 'low'
    | 'online'
    | 'offline'
    | 'simulated';
  children?: ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className = '' }: StatusBadgeProps) {
  let badgeColor = 'bg-[#EDE8DD] text-[#171717]';

  switch (status) {
    case 'active':
    case 'online':
    case 'completed':
      badgeColor = 'bg-[#C8FF00] text-[#171717]';
      break;
    case 'failed':
    case 'critical':
    case 'urgent':
    case 'high':
      badgeColor = 'bg-[#FF6B4A] text-white';
      break;
    case 'medium':
      badgeColor = 'bg-[#FFDE59] text-[#171717]';
      break;
    case 'simulated':
      badgeColor = 'bg-[#00F0FF] text-[#171717]';
      break;
    case 'missed':
    case 'low':
    case 'offline':
      badgeColor = 'bg-[#EDE8DD] text-[#171717]';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border-[2px] border-[#171717] font-mono font-bold text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_#171717] ${badgeColor} ${className}`}
    >
      <span className="w-1.5 h-1.5 bg-current rounded-full" />
      {children || status.toUpperCase()}
    </span>
  );
}
