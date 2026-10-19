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
  const isDark = variant === 'dark';
  const isCoral = variant === 'coral';

  const iconBg = isDark
    ? 'bg-[#262626] text-[#C8FF00] border-white/20'
    : isCoral
    ? 'bg-white text-[#FF6B4A] border-[#171717]'
    : variant === 'lime'
    ? 'bg-white text-[#171717] border-[#171717]'
    : 'bg-[#C8FF00] text-[#171717] border-[#171717]';

  return (
    <BrutalCard variant={variant} className="flex flex-col justify-between p-5 min-h-[140px]">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`font-mono font-bold text-xs uppercase tracking-wider ${
            isDark ? 'text-[#C8FF00]' : isCoral ? 'text-white' : 'text-[#171717]'
          }`}
        >
          {label}
        </span>
        {icon && (
          <div
            className={`w-9 h-9 border-[2px] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#171717] ${iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div
          className={`text-4xl sm:text-5xl font-black font-display tracking-tight leading-none ${
            isDark ? 'text-[#F5F0E8]' : isCoral ? 'text-white' : 'text-[#171717]'
          }`}
        >
          {value}
        </div>
        {subtext && (
          <div
            className={`text-xs font-mono font-semibold mt-2 inline-block px-1.5 py-0.5 border-[1px] ${
              isDark
                ? 'bg-[#262626] text-[#8a8a7a] border-[#383838]'
                : isCoral
                ? 'bg-black/20 text-white border-white/40'
                : 'bg-[#EDE8DD] text-[#171717] border-[#171717]'
            }`}
          >
            {subtext}
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
