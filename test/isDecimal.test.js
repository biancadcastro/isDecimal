import assert from 'assert';
import { test } from 'node:test';
import { isInteger, isDecimal } from '../src/isDecimal.js';
import index from '../src/index.js';

test('main index reexporta funções', () => {
  assert.strictEqual(typeof index.isInteger, 'function');
  assert.strictEqual(typeof index.isDecimal, 'function');
  assert.strictEqual(index.isInteger(5), true);
  assert.strictEqual(index.isDecimal(5.5), true);
});

test('deve detectar inteiros válidos', () => {
  assert.strictEqual(isInteger(0), true);
  assert.strictEqual(isInteger(1), true);
  assert.strictEqual(isInteger(-1), true);
  assert.strictEqual(isInteger('123'), true);
  assert.strictEqual(isInteger('123.0'), true);
  assert.strictEqual(isInteger('1e2'), true);
});

test('deve detectar decimais válidos', () => {
  assert.strictEqual(isDecimal(0.1), true);
  assert.strictEqual(isDecimal('-0.01'), true);
  assert.strictEqual(isDecimal('123.45'), true);
  assert.strictEqual(isDecimal('1e-1'), true);
  assert.strictEqual(isDecimal('1.23e1'), true);
});

test('deve tratar como não decimal quando inteiro', () => {
  assert.strictEqual(isDecimal(42), false);
  assert.strictEqual(isDecimal('42.0'), false);
  assert.strictEqual(isDecimal('10e1'), false);
});

test('deve rejeitar entradas inválidas', () => {
  assert.strictEqual(isInteger('abc'), false);
  assert.strictEqual(isDecimal('abc'), false);
  assert.strictEqual(isInteger('1..2'), false);
  assert.strictEqual(isDecimal(''), false);
  assert.strictEqual(isInteger(Infinity), false);
  assert.strictEqual(isDecimal(NaN), false);
});
