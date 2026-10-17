import { ReactNode } from 'react';
import { BrutalCard } from './BrutalCard';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  variant?: 'default' | 'lime' | 'coral' | 'dark';
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  variant = 'default',
}: StatCardProps) {
  return (
    <BrutalCard variant={variant} className="flex flex-col justify-between p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="section-header text-xs tracking-wider" style={{ marginBottom: 0 }}>
          {label}
        </span>
        {icon && <div className="text-xl">{icon}</div>}
      </div>
      <div className="mt-3">
        <div className="stat-number leading-none">{value}</div>
        {subtext && (
          <p className="text-xs font-semibold mt-2 opacity-80">
            {subtext}
          </p>
        )}
      </div>
    </BrutalCard>
  );
}
