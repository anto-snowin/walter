'use client';

import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

interface BrutalSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const BrutalSelect = forwardRef<HTMLSelectElement, BrutalSelectProps>(
  ({ label, error, className = '', id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`brutal-select ${error ? '!border-[#FF6B4A]' : ''} ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && (
          <span className="text-xs font-mono font-bold text-[#FF6B4A]">
            [{error}]
          </span>
        )}
      </div>
    );
  }
);

BrutalSelect.displayName = 'BrutalSelect';
