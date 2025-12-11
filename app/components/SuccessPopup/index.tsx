'use client';

import { SuccessPopupType } from '@/app/types';
import { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export function SuccessPopup({ message, isVisible, onClose, duration = 3000 }: SuccessPopupType) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-primary-600 text-white rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px]">
        <FaCheckCircle className="w-5 h-5 shrink-0 text-white" />
        <span className="font-semibold text-white">{message}</span>
      </div>
    </div>
  );
}
