'use client';

import { forwardRef } from 'react';
import { TextInputType } from '../../types';

export const TextInput = forwardRef<HTMLInputElement, TextInputType>(
  ({ prefix, error, helperText, label, ...rest }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium">{label}</label>
        <div className="relative">
          {prefix && <span className="absolute left-3 top-[22px] -translate-y-1/2 text-gray-500">{prefix}</span>}
          <input
            {...rest}
            ref={ref}
            type="text"
            className="w-full h-9 mt-1 pl-10 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition-colors"
          />
        </div>
        {error && <span className="text-red-500 text-xs">{helperText}</span>}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';