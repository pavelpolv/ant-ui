const Module = require('node:module');

const resolveFilename = Module._resolveFilename;

// eslint-disable-next-line no-restricted-syntax
Module._resolveFilename = function (request, parent, ...rest) {
  const fromTypescriptEslint = /[\\/]node_modules[\\/](@typescript-eslint[\\/]|typescript-eslint[\\/]|ts-api-utils[\\/])/
    .test(parent?.filename ?? '');
  const target = fromTypescriptEslint && (request === 'typescript' || request.startsWith('typescript/'))
    ? request.replace(/^typescript/, 'typescript-eslint-ts')
    : request;
  return resolveFilename.call(this, target, parent, ...rest);
};
