'use client';

import { SelectInputType } from '@/app/types';
import { forwardRef } from 'react';

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputType>(
  ({ error, helperText, label, options, placeholder, ...rest }, ref) => {
    return (
      <div>
        {label && <label className="block text-sm font-medium text-navy-100">{label}</label>}
        <select
          {...rest}
          ref={ref}
          className="w-full h-9 mt-1 rounded border border-gray-300 focus:border-primary-600 focus:ring focus:ring-primary-200 focus:outline-none transition-colors text-navy-100"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-red-500 text-xs">{helperText}</span>}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';
