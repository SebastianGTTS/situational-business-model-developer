import { Injectable } from '@angular/core';
import { MetaModelService } from '../../../development-process-registry/meta-model.service';
import {
  MetaModelApi,
  MetaModelDefinition,
  MetaModelIdentifier,
} from '../../../development-process-registry/meta-model-definition';
import { ExampleArtifactApiService } from './example-artifact-api.service';
import { Example } from './example';

@Injectable()
export class ExampleArtifactService {
  readonly exampleArtifactIdentifier: Readonly<MetaModelIdentifier> = {
    name: 'Example',
    type: Example.typeName,
  };

  constructor(
    private exampleArtifactApiService: ExampleArtifactApiService,
    private metaModelService: MetaModelService
  ) {}

  init(): void {
    const definition: MetaModelDefinition = {
      ...this.exampleArtifactIdentifier,
      api: this.exampleArtifactApiService,
    };
    this.metaModelService.registerMetaModel(definition);
    console.log('Registered ' + definition.name + ' Meta Model');
  }

  registerCreateMethod(create: MetaModelApi['create']): void {
    this.exampleArtifactApiService.createMethod = create;
  }

  registerEditMethod(edit: MetaModelApi['edit']): void {
    this.exampleArtifactApiService.editMethod = edit;
  }

  registerViewMethod(view: MetaModelApi['view']): void {
    this.exampleArtifactApiService.viewMethod = view;
  }
}
