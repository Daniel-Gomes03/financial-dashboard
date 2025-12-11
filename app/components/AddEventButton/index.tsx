'use client';

import { useState } from 'react';
import { Dialog } from '../Dialog';
import { EventForm } from '../EventForm';
import { FaPlus } from 'react-icons/fa';

export function AddEventButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center shadow-lg"
      >
        <FaPlus className="w-5 h-5" />
        <span>Adicionar Evento</span>
      </button>

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        title="Adicionar evento financeiro"
      >
        <EventForm onSuccess={handleSuccess} />
      </Dialog>
    </>
  );
}
