# isdecimal

Biblioteca para validar se um valor numérico é inteiro ou decimal, com tratamento de strings e notação científica.

## Instalação

```bash
npm install
```

## Uso

```js
import { isInteger, isDecimal } from './src/isDecimal.js';

console.log(isInteger(42));       // true
console.log(isInteger(42.0));     // true
console.log(isDecimal(42.5));     // true
console.log(isDecimal('-3.14'));  // true
```

## API

- `isInteger(value)` retorna `true` se o valor for inteiro.
- `isDecimal(value)` retorna `true` se o valor for número decimal (não inteiro).

## Testes

```bash
npm test
```
