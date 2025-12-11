import { z } from 'zod';

export const eventFormSchema = z.object({
  type: z.enum(["renda", "despesa"], {message: 'Selecione uma opção válida'}),
  frequency: z.enum(["unica", "mensal"], {message: 'Selecione uma opção válida'}),
  year: z.number().optional().nullable(),
  start_year: z.number().optional().nullable(),
  end_year: z.number().optional().nullable(),
  value: z.number().positive('Informe um valor positivo'),
}).refine((data) => {
  if (data.frequency === 'unica') {
    return data.year !== undefined && data.year !== null && !isNaN(data.year);
  }
  return true;
}, {
  message: 'Ano é obrigatório para frequência única',
  path: ['year'],
}).refine((data) => {
  if (data.frequency === 'mensal') {
    return data.start_year !== undefined && data.start_year !== null && !isNaN(data.start_year);
  }
  return true;
}, {
  message: 'Ano inicial é obrigatório para frequência mensal',
  path: ['start_year'],
}).refine((data) => {
  if (data.frequency === 'mensal') {
    return data.end_year !== undefined && data.end_year !== null && !isNaN(data.end_year);
  }
  return true;
}, {
  message: 'Ano final é obrigatório para frequência mensal',
  path: ['end_year'],
}).refine((data) => {
  if (data.frequency === 'mensal' && data.start_year && data.end_year) {
    return data.end_year >= data.start_year;
  }
  return true;
}, {
  message: 'Ano final deve ser maior ou igual ao ano inicial',
  path: ['end_year'],
});

export type EventFormType = z.infer<typeof eventFormSchema>;
