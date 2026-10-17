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
  const variantClass = variant !== 'default' ? `brutal-card-${variant}` : '';
  const hoverClass = hoverable ? 'brutal-card-hover' : '';

  return (
    <div
      className={`brutal-card ${variantClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
