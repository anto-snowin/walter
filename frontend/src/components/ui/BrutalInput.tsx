'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface BrutalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const BrutalInput = forwardRef<HTMLInputElement, BrutalInputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`brutal-input ${error ? '!border-[#FF6B4A]' : ''} ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs font-mono font-bold text-[#FF6B4A]">
            [{error}]
          </span>
        )}
      </div>
    );
  }
);

BrutalInput.displayName = 'BrutalInput';
