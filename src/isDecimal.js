const NUMERIC_PATTERN = /^[+-]?(?:\d+)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

function _normalize(input) {
  if (input === null || input === undefined) return null;

  if (typeof input === 'bigint') {
    input = input.toString();
  }

  if (typeof input === 'number') {
    if (!Number.isFinite(input)) return null;
    return input.toString();
  }

  if (typeof input === 'string') {
    const value = input.trim();
    if (value === '') return null;
    if (!NUMERIC_PATTERN.test(value)) return null;
    return value;
  }

  return null;
}

function _toDecimalParts(value) {
  const normalized = _normalize(value);
  if (normalized === null) return null;

  const  [base, exp] = normalized.split(/[eE]/);
  const exponent = exp ? Number(exp) : 0;

  if (Number.isNaN(exponent)) return null;

  const decimalIndex = base.indexOf('.');
  if (decimalIndex === -1) {
    const intPart = base.replace(/^\+|-/, '');
    return { intPart, fracPart: '', exponent };
  }

  const intPart = base.slice(0, decimalIndex).replace(/^\+|-/, '') || '0';
  const fracPart = base.slice(decimalIndex + 1);

  if (fracPart === '') {
    return { intPart, fracPart: '', exponent };
  }

  return { intPart, fracPart, exponent };
}

export function isInteger(value) {
  const parts = _toDecimalParts(value);
  if (parts === null) return false;

  const shift = parts.exponent;

  if (parts.fracPart === '') {
    return shift >= 0;
  }

  if (shift >= 0) {
    // move fractional digits right by exponent; if nothing remains after trimming zeros, é inteiro
    return parts.fracPart.padEnd(shift + parts.fracPart.length, '0').replace(/0+$/, '') === '';
  }

  // shift < 0: number has digits before decimal and exponent negative. ex: 12.34e-1 = 1.234
  const normalized = `${parts.intPart}${parts.fracPart}`;
  const decimalPos = normalized.length + shift;
  if (decimalPos <= 0) {
    // toda parte real passa para fração: será decimal se houver qualquer dígito não-zero no normalized
    return /^0+$/.test(normalized);
  }

  const after = normalized.slice(decimalPos);
  return /^0+$/.test(after);
}

export function isDecimal(value) {
  const parts = _toDecimalParts(value);
  if (parts === null) return false;
  if (isInteger(value)) return false;
  return true;
}
