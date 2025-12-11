'use client';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFinancialDashboard } from '../../context/FinancialDashboardProvider';
import { useState, useMemo, ChangeEvent } from 'react';
import { TextInput } from '../TextInput';
import { SelectInput } from '../SelectInput';
import { SuccessPopup } from '../SuccessPopup';
import { EVENT_TYPE, FRENQUENCY, FrequencyType } from '@/app/constants/form.constants';
import { formatToCurrency } from '@/app/utils/formatCurrency';
import { SelectOptionType } from '@/app/types';
import { eventFormSchema, EventFormType } from '@/app/schemas/eventForm.schema';

export function EventForm({ onSuccess }: { onSuccess?: () => void }) {
  const { projection, addEvent } = useFinancialDashboard();
  const years = projection.cash_flow.labels;
  const [success, setSuccess] = useState(false);
  
  const yearOptions: SelectOptionType[] = useMemo(
    () => years.map(year => ({ value: year, label: year })),
    [years]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  
  } = useForm<EventFormType>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      type: undefined,
      frequency: undefined,
      value: 0,
      year: undefined,
      start_year: undefined,
      end_year: undefined,
    },
  });

  const frequency = useWatch({ control, name: 'frequency' });

  const onSubmit = (data: EventFormType) => {
    addEvent({
      type: data.type,
      frequency: data.frequency,
      year: frequency === FrequencyType.UNICA ? (data.year ?? undefined) : undefined,
      start_year: frequency === FrequencyType.MENSAL ? (data.start_year ?? undefined) : undefined,
      end_year: frequency === FrequencyType.MENSAL ? (data.end_year ?? undefined) : undefined,
      value: data.value,
    });
    setSuccess(true);
    reset();

    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
    }, 500);
  };

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <SelectInput
          label="Tipo de Evento"
          error={!!errors.type}
          helperText={errors.type?.message}
          placeholder="Selecione"
          options={EVENT_TYPE}
          {...register('type')}
        />

        <SelectInput
          label="Frequência"
          error={!!errors.frequency}
          helperText={errors.frequency?.message}
          placeholder="Selecione"
          options={FRENQUENCY}
          {...register('frequency')}
        />
        
        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <TextInput
              error={!!errors.value?.message}
              helperText={errors.value?.message}
              placeholder="0,00"
              label='Valor (R$)'
              prefix='R$'
              value={formatToCurrency(field.value)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                const numbersOnly = value.replace(/\D/g, '');
                const numericValue = numbersOnly === '' ? 0 : parseFloat(numbersOnly) / 100;
                field.onChange(numericValue);
              }}
            />
          )}
        />
      </div>
      {frequency === FrequencyType.UNICA && (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <SelectInput
                  label="Ano"
                  error={!!errors.year}
                  helperText={errors.year?.message}
                  placeholder="Selecione..."
                  options={yearOptions}
                  value={field.value?.toString() || ''}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? undefined : Number(value));
                  }}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>
        </div>
      )}
      {frequency === FrequencyType.MENSAL && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Controller
            name="start_year"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Ano inicial"
                error={!!errors.start_year}
                helperText={errors.start_year?.message}
                placeholder="Selecione..."
                options={yearOptions}
                value={field.value?.toString() || ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? undefined : Number(value));
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            name="end_year"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Ano final"
                error={!!errors.end_year}
                helperText={errors.end_year?.message}
                placeholder="Selecione..."
                options={yearOptions}
                value={field.value?.toString() || ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? undefined : Number(value));
                }}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
      )}
      <button type="submit" className="cursor-pointer w-full sm:w-auto px-6 py-2 bg-primary-500 text-white font-bold rounded hover:bg-primary-600 transition">Adicionar</button>
      <SuccessPopup 
        message="Evento cadastrado com sucesso!" 
        isVisible={success} 
        onClose={() => setSuccess(false)}
      />
    </form>
  );
}
