export enum EventType {
  RENDA = 'renda',
  DESPESA = 'despesa',
  DESPESAS = 'despesas'
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  [EventType.RENDA]: 'Renda',
  [EventType.DESPESA]: 'Despesa',
  [EventType.DESPESAS]: 'Despesas'
};

export enum FrequencyType {
  UNICA = 'unica',
  MENSAL = 'mensal'
}

export const FREQUENCY_LABELS: Record<FrequencyType, string> = {
  [FrequencyType.UNICA]: 'única',
  [FrequencyType.MENSAL]: 'mensal'
};

export const EVENT_TYPE = [
  {value: EventType.RENDA, label: 'Adicionar renda'},
  {value: EventType.DESPESA, label: 'Adicionar despesas'}
]

export const FRENQUENCY = [
  {value: FrequencyType.UNICA, label: 'Única'},
  {value: FrequencyType.MENSAL, label: 'Mensal'}
]