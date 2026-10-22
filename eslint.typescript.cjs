// Проект собирается TypeScript 7 (компилятор на Go), у которого нет JavaScript API.
// typescript-eslint разбирает код через этот API, поэтому ему подсовывается TypeScript 5.9,
// установленный под именем typescript-eslint-ts. На tsc и сборку это не влияет.
// Подключается первым импортом в eslint.config.js — до загрузки typescript-eslint.

const Module = require('node:module');

const resolveFilename = Module._resolveFilename;

// обычная функция, а не стрелка: нужен this исходного resolveFilename
// eslint-disable-next-line no-restricted-syntax
Module._resolveFilename = function (request, parent, ...rest) {
  const fromTypescriptEslint = /[\\/]node_modules[\\/](@typescript-eslint[\\/]|typescript-eslint[\\/]|ts-api-utils[\\/])/
    .test(parent?.filename ?? '');
  const target = fromTypescriptEslint && (request === 'typescript' || request.startsWith('typescript/'))
    ? request.replace(/^typescript/, 'typescript-eslint-ts')
    : request;
  return resolveFilename.call(this, target, parent, ...rest);
};
