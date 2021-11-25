// Workaround for https://github.com/bpmn-io/bpmn-js-example-angular/issues/6
// with https://github.com/angular/angular-cli/issues/14750

const fs = require('fs');

function removeSideEffects(moduleName) {
  const packageJsonName = moduleName + '/package.json';
  const packageJson = require(packageJsonName);
  const path = require.resolve(packageJsonName);
  if (packageJson.hasOwnProperty('sideEffects')) {
    delete packageJson.sideEffects;
    fs.writeFileSync(path, JSON.stringify(packageJson, null, 2) + '\n');
  }
}

const modules = [
  'bpmn-js',
  'bpmn-moddle',
  'diagram-js',
  'moddle',
  'moddle-xml',
];
modules.forEach((moduleName) => removeSideEffects(moduleName));
