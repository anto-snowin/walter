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
  let variantClass = 'bg-white text-[#171717] border-[3px] border-[#171717] shadow-[5px_5px_0px_#171717]';

  if (variant === 'dark') {
    variantClass = 'bg-[#171717] text-[#F5F0E8] border-[3px] border-[#171717] shadow-[5px_5px_0px_#171717]';
  } else if (variant === 'lime') {
    variantClass = 'bg-[#C8FF00] text-[#171717] border-[3px] border-[#171717] shadow-[5px_5px_0px_#171717]';
  } else if (variant === 'coral') {
    variantClass = 'bg-[#FF6B4A] text-white border-[3px] border-[#171717] shadow-[5px_5px_0px_#171717]';
  } else if (variant === 'flat') {
    variantClass = 'bg-[#EDE8DD] text-[#171717] border-[2px] border-[#171717] shadow-none';
  }

  const hoverClass = hoverable
    ? 'hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[7px_7px_0px_#171717] cursor-pointer'
    : '';

  return (
    <div
      className={`p-6 relative transition-all duration-150 ${variantClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
