"use client";

import { NavigationMenuType, ViewType } from '@/app/types';
import { useState, useRef, useEffect } from 'react';
import { FaBars, FaUsers, FaChartLine } from 'react-icons/fa';

export function NavigationMenu({ currentView, onViewChange }: NavigationMenuType) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleViewChange = (view: ViewType) => {
    onViewChange(view);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        aria-label="Menu de navegação"
        aria-expanded={isOpen}
      >
        <FaBars className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed top-16 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[200px] overflow-hidden">
          <button
            onClick={() => handleViewChange('members')}
            className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-100 transition-colors ${
              currentView === 'members' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
            }`}
          >
            <FaUsers className="w-5 h-5" />
            <span>Membros</span>
          </button>
          <button
            onClick={() => handleViewChange('dashboard')}
            className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-100 transition-colors border-t border-gray-200 ${
              currentView === 'dashboard' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
            }`}
          >
            <FaChartLine className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>
      )}
    </div>
  );
}
