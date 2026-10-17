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
            className="section-header"
            style={{ marginBottom: 0 }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`brutal-input ${error ? 'border-[var(--walter-coral)]' : ''} ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs font-medium" style={{ color: 'var(--walter-coral)' }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

BrutalInput.displayName = 'BrutalInput';
