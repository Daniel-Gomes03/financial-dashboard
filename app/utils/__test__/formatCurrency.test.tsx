import { formatToCurrency, formatYAxisValue } from '../formatCurrency';

describe('formatToCurrency', () => {
  it('should return empty string when value is undefined', () => {
    expect(formatToCurrency(undefined)).toBe('');
  });

  it('should return empty string when value is 0', () => {
    expect(formatToCurrency(0)).toBe('');
  });

  it('should format positive integer correctly', () => {
    expect(formatToCurrency(1000)).toBe('1.000,00');
  });

  it('should format positive decimal correctly', () => {
    expect(formatToCurrency(1234.56)).toBe('1.234,56');
  });

  it('should format large number correctly', () => {
    expect(formatToCurrency(1000000)).toBe('1.000.000,00');
  });

  it('should format small decimal correctly', () => {
    expect(formatToCurrency(0.5)).toBe('0,50');
  });

  it('should format number with trailing zeros correctly', () => {
    expect(formatToCurrency(100)).toBe('100,00');
  });
});

describe('formatYAxisValue', () => {
  it('should return "R$ 0" when value is 0', () => {
    expect(formatYAxisValue(0)).toBe('R$ 0');
  });

  it('should format values less than 1000 correctly', () => {
    expect(formatYAxisValue(500)).toBe('R$ 500');
    expect(formatYAxisValue(999)).toBe('R$ 999');
    expect(formatYAxisValue(1)).toBe('R$ 1');
  });

  it('should format values between 1000 and 999999 as thousands (K)', () => {
    expect(formatYAxisValue(1000)).toBe('R$ 1.0K');
    expect(formatYAxisValue(1500)).toBe('R$ 1.5K');
    expect(formatYAxisValue(5000)).toBe('R$ 5.0K');
    expect(formatYAxisValue(999999)).toBe('R$ 1000.0K');
    expect(formatYAxisValue(999000)).toBe('R$ 999.0K');
  });

  it('should format values >= 1000000 as millions (M)', () => {
    expect(formatYAxisValue(1000000)).toBe('R$ 1.0M');
    expect(formatYAxisValue(1500000)).toBe('R$ 1.5M');
    expect(formatYAxisValue(5000000)).toBe('R$ 5.0M');
    expect(formatYAxisValue(10000000)).toBe('R$ 10.0M');
  });

  it('should format decimal values correctly', () => {
    expect(formatYAxisValue(1234.56)).toBe('R$ 1.2K');
    expect(formatYAxisValue(1234567.89)).toBe('R$ 1.2M');
  });
});
