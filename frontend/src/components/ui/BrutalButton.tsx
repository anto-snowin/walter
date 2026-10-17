'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function BrutalButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: BrutalButtonProps) {
  const variantClass = `brutal-btn-${variant}`;
  const sizeClass = size === 'sm' ? 'brutal-btn-sm' : size === 'lg' ? 'brutal-btn-lg' : '';

  return (
    <button
      className={`brutal-btn ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
