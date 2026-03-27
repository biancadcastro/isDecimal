# isDecimal

[![npm version](https://badge.fury.io/js/isdecimalorint.svg)](https://badge.fury.io/js/isdecimalorint)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Uma biblioteca JavaScript leve e eficiente para validar se um valor numérico é um inteiro ou um decimal. Suporta números, strings, notação científica e trata casos especiais como valores infinitos e NaN.

## Características

- ✅ Suporte a números JavaScript nativos
- ✅ Validação de strings numéricas
- ✅ Tratamento de notação científica (ex: `1e10`, `2.5e-3`)
- ✅ Rejeição de valores inválidos (NaN, Infinity, strings não numéricas)
- ✅ API simples e intuitiva
- ✅ Zero dependências
- ✅ Compatível com ES modules

## Instalação

Instale via npm:

```bash
npm install isdecimalorint
```

Ou via yarn:

```bash
yarn add isdecimalorint
```

## Uso

### Importação

```javascript
import { isInteger, isDecimal } from 'isdecimalorint';
```

### Exemplos Básicos

```javascript
// Verificando inteiros
console.log(isInteger(42));        // true
console.log(isInteger('42'));      // true
console.log(isInteger(42.0));      // true
console.log(isInteger('42.0'));    // true

// Verificando decimais
console.log(isDecimal(3.14));      // true
console.log(isDecimal('3.14'));    // true
console.log(isDecimal('-2.5'));    // true

// Casos especiais
console.log(isInteger('1e2'));     // true (100)
console.log(isDecimal('1.5e1'));   // true (15.0, mas tem parte decimal)
console.log(isDecimal('1e-1'));    // true (0.1)

// Valores inválidos
console.log(isInteger('abc'));     // false
console.log(isDecimal(Infinity));  // false
console.log(isInteger(NaN));       // false
```

## API

### `isInteger(value)`

Verifica se o valor fornecido representa um número inteiro.

**Parâmetros:**
- `value` (number|string): O valor a ser verificado. Pode ser um número JavaScript ou uma string representando um número.

**Retorno:**
- `boolean`: `true` se o valor for um inteiro válido, `false` caso contrário.

**Exemplos:**
```javascript
isInteger(5);        // true
isInteger('5');      // true
isInteger(5.0);      // true
isInteger('5.0');    // true
isInteger(5.1);      // false
isInteger('abc');    // false
```

### `isDecimal(value)`

Verifica se o valor fornecido representa um número decimal (não inteiro).

**Parâmetros:**
- `value` (number|string): O valor a ser verificado. Pode ser um número JavaScript ou uma string representando um número.

**Retorno:**
- `boolean`: `true` se o valor for um decimal válido, `false` caso contrário.

**Exemplos:**
```javascript
isDecimal(3.14);     // true
isDecimal('3.14');   // true
isDecimal(5);        // false
isDecimal('5.0');    // false
isDecimal('abc');    // false
```

## Casos de Uso

Esta biblioteca é útil em validações de entrada de usuário, processamento de dados e qualquer situação onde você precisa distinguir entre números inteiros e decimais:

- Validação de formulários
- Processamento de dados CSV/JSON
- Verificação de tipos em APIs
- Lógica condicional baseada em tipos numéricos

## Testes

Execute os testes com:

```bash
npm test
```

## Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request no [GitHub](https://github.com/biancadcastro/isDecimal).

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
