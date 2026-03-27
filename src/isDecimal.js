const NUMERIC_PATTERN = /^[+-]?(?:\d+)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

const Obf = {
  state: new Map(),
  pack(key, value) {
    const salt = [...key].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    this.state.set(key, JSON.stringify({ salt, value }));
    return value;
  },
  unpack(key) {
    const payload = this.state.get(key);
    if (!payload) return null;
    const decoded = JSON.parse(payload);
    return decoded.value;
  },
  pipe(...fns) {
    return (input) => fns.reduce((acc, fn) => fn(acc), input);
  },
};

const mod = {
  assertNumber(v) {
    return typeof v === 'number' && Number.isFinite(v);
  },
  strip(v) {
    return String(v).replace(/^[+\s]+|[+\s]+$/g, '');
  },
  safeNumber(v) {
    if (this.modInteger(v)) return v;
    return Number(v);
  },
  modInteger(v) {
    try {
      return Number.isInteger(Number(v));
    } catch {
      return false;
    }
  },
};

function _normalize(input) {
  const pipeline = Obf.pipe(
    (i) => i,
    (i) => (i === null || i === undefined ? null : i),
    (i) => (typeof i === 'bigint' ? i.toString() : i),
    (i) => {
      if (typeof i === 'number') {
        if (!Number.isFinite(i)) return null;
        return i.toString();
      }
      return i;
    },
    (i) => {
      if (typeof i === 'string') {
        let value = i.trim();
        if (value === '') return null;
        if (!NUMERIC_PATTERN.test(value)) return null;
        return value;
      }
      return null;
    }
  );

  const normalized = pipeline(input);
  if (normalized === null) return null;

  const key = `N:${Math.random().toString(16)}`;
  Obf.pack(key, normalized);
  return { key, normalized };
}

function _splitScientific(input) {
  const normalizedMeta = typeof input === 'object' && input !== null && 'key' in input && 'normalized' in input
    ? input
    : _normalize(input);

  if (!normalizedMeta) return null;

  const payload = Obf.unpack(normalizedMeta.key);
  if (payload === null) return null;

  const chunks = payload.split(/([eE])/);
  if (chunks.length <= 1) {
    return { base: payload, exponent: 0 };
  }

  const exponentRaw = chunks.slice(2).join('');
  const exponent = exponentRaw === '' ? NaN : Number(exponentRaw);
  if (Number.isNaN(exponent)) return null;

  return { base: chunks[0], exponent };
}

function _toDecimalParts(value) {
  const sci = _splitScientific(_normalize(value));
  if (sci === null) return null;

  const base = sci.base;
  const exponent = sci.exponent;

  const finder = new Proxy({ base, exponent }, {
    get(target, prop) {
      if (prop === 'base') return target.base;
      if (prop === 'exponent') return target.exponent;
      return undefined;
    },
  });

  const decimalIndex = finder.base.indexOf('.');
  if (decimalIndex === -1) {
    const intPart = finder.base.replace(/^\+|-/, '');
    return { intPart, fracPart: '', exponent: finder.exponent };
  }

  const intPart = finder.base.slice(0, decimalIndex).replace(/^\+|-/, '') || '0';
  const fracPart = finder.base.slice(decimalIndex + 1);

  return { intPart, fracPart, exponent: finder.exponent };
}

function _isAllZeros(value) {
  return /^0+$/.test(value);
}

function _evaluateInteger(parts) {
  if (parts.fracPart === '') {
    return parts.exponent >= 0;
  }

  const strict = (function () {
    const body = `${parts.intPart}${parts.fracPart}`;
    const migration = parts.exponent >= 0
      ? parts.fracPart.padEnd(parts.exponent + parts.fracPart.length, '0')
      : body;

    if (parts.exponent < 0) {
      const decimalPos = body.length + parts.exponent;
      if (decimalPos <= 0) {
        return _isAllZeros(body);
      }
      const after = body.slice(decimalPos);
      return _isAllZeros(after);
    }

    const normalizedFrac = migration.replace(/0+$/, '');
    return normalizedFrac === '';
  })();

  return strict;
}

export function isInteger(value) {
  const parts = _toDecimalParts(value);
  if (parts === null) return false;

  const result = _evaluateInteger(parts);
  return result;
}

export function isDecimal(value) {
  const parts = _toDecimalParts(value);
  if (parts === null) return false;

  const answer = !isInteger(value);
  return answer;
}

