export type MemberType = {
  uuid: string;
  name: string;
  age: number;
  retirement_age: number;
  life_expectancy: number;
  net_income: number;
  has_inss: boolean;
  inss: number;
  expenses_decline_rate: number;
  judicial_inventory_costs: number | string;
  extrajudicial_inventory_costs: number | string;
  inventory_costs: number | string;
};

export type EventType = 'renda' | 'despesa';
export type FrequencyType = 'unica' | 'mensal';

export type FinancialEventType = {
  id: string;
  type: EventType;
  frequency: FrequencyType;
  year?: number;
  start_year?: number;
  end_year?: number;
  value: number;
  created_at: string;
  description: string;
};

export type CashFlowDatasetType = {
  name: string;
  type: string;
  data: number[];
};

export type CashFlowType = {
  labels: number[];
  datasets: CashFlowDatasetType[];
};

export type ProjectionType = {
  cash_flow: CashFlowType;
};

export type SimulationDataType = {
  simulation: {
    uuid: string;
    active_income_members: MemberType[];
    events: FinancialEventType[];
  };
  projection: ProjectionType;
};

export type TextInputType = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'size' | 'prefix'
> & {
  label?: string;
  helperText?: string;
  error?: boolean;
  prefix?: string;
};

export type SelectOptionType = {
  value: string | number;
  label: string | number;
};

export type SelectInputType = Omit<
  React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
  'size'
> & {
  label?: string;
  helperText?: string;
  error?: boolean;
  options: SelectOptionType[];
  placeholder?: string;
};

export type MemberInfoItemType = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export type SuccessPopupType = {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
};

export type ViewType = 'dashboard' | 'members';

export type NavigationMenuType = {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
};

export type FinancialDashboardContextType ={
  simulation: SimulationDataType["simulation"];
  projection: ProjectionType;
  addEvent: (event: Omit<FinancialEventType, "id" | "created_at" | "description">) => void;
  removeEvent: (id: string) => void;
};

export type DialogType = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export type EventsStateType = {
  events: FinancialEventType[];
  addEvent: (event: FinancialEventType) => void;
  removeEvent: (eventId: string) => void;
  setEvents: (events: FinancialEventType[]) => void;
};
