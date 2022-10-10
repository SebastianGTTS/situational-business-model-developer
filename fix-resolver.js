// Fix for https://github.com/uuidjs/uuid/pull/616

module.exports = (path, options) => {
  if (path === 'uuid') {
    return options.defaultResolver(path, {
      ...options,
      conditions: ['require', 'default', 'node'],
    });
  }
  return options.defaultResolver(path, options);
};
