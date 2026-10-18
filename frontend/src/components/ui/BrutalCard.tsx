import { ReactNode, HTMLAttributes } from 'react';

interface BrutalCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark' | 'lime' | 'coral' | 'flat';
  hoverable?: boolean;
  children: ReactNode;
}

export function BrutalCard({
  variant = 'default',
  hoverable = false,
  children,
  className = '',
  ...props
}: BrutalCardProps) {
  let variantClass = 'bg-[#0E1322]/70 border border-white/[0.08] shadow-xl';

  if (variant === 'dark') {
    variantClass = 'bg-[#0A0D18]/90 border border-white/[0.06] shadow-2xl';
  } else if (variant === 'lime') {
    variantClass = 'bg-gradient-to-br from-emerald-500/10 via-[#0E1322]/80 to-transparent border border-emerald-500/20 shadow-emerald-500/5 shadow-xl';
  } else if (variant === 'coral') {
    variantClass = 'bg-gradient-to-br from-rose-500/10 via-[#0E1322]/80 to-transparent border border-rose-500/20 shadow-rose-500/5 shadow-xl';
  } else if (variant === 'flat') {
    variantClass = 'bg-[#0E1322]/50 border border-white/[0.06] shadow-none';
  }

  const hoverClass = hoverable
    ? 'hover:-translate-y-1 hover:border-white/[0.18] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300'
    : '';

  return (
    <div
      className={`rounded-2xl backdrop-blur-xl p-6 relative overflow-hidden transition-all duration-300 ${variantClass} ${hoverClass} ${className}`}
      {...props}
    >
      {/* Top Hairline Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
