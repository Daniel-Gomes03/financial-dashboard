export const formatToCurrency = (value: number | undefined): string => {
  if (!value || value === 0) return '';
  const formatted = value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatted;
};

export const formatYAxisValue = (value: number): string => {
  if (value === 0) return 'R$ 0';
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1000000) {
    const millions = absValue / 1000000;
    return `R$ ${millions.toFixed(1)}M`;
  } else if (absValue >= 1000) {
    const thousands = absValue / 1000;
    return `R$ ${thousands.toFixed(1)}K`;
  } else {
    return `R$ ${absValue.toFixed(0)}`;
  }
};