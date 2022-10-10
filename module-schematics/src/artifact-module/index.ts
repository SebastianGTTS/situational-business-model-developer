import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  url,
} from '@angular-devkit/schematics';

import { normalize, strings } from '@angular-devkit/core';

import { Schema as ArtifactModuleSchema } from './schema';

export function artifactModule(options: ArtifactModuleSchema): Rule {
  return (): Rule => {
    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        camelize: strings.camelize,
        dasherize: strings.dasherize,
        name: options.name,
      }),
      move(normalize('src/app/modules/')),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
