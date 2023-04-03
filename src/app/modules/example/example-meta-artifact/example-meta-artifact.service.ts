import { Injectable } from '@angular/core';
import { MetaArtifactService } from '../../../development-process-registry/meta-artifact.service';
import {
  MetaArtifactApi,
  MetaArtifactDefinition,
  MetaArtifactIdentifier,
} from '../../../development-process-registry/meta-artifact-definition';
import { ExampleMetaArtifactApiService } from './example-meta-artifact-api.service';
import { Example } from './example';

@Injectable()
export class ExampleMetaArtifactService {
  readonly exampleMetaArtifactIdentifier: Readonly<MetaArtifactIdentifier> = {
    name: 'Example',
    type: Example.typeName,
  };

  constructor(
    private exampleMetaArtifactApiService: ExampleMetaArtifactApiService,
    private metaArtifactService: MetaArtifactService
  ) {}

  init(): void {
    const definition: MetaArtifactDefinition = {
      ...this.exampleMetaArtifactIdentifier,
      api: this.exampleMetaArtifactApiService,
    };
    this.metaArtifactService.registerMetaArtifact(definition);
    console.log('Registered ' + definition.name + ' Meta Artifact');
  }

  registerCreateMethod(create: MetaArtifactApi['create']): void {
    this.exampleMetaArtifactApiService.createMethod = create;
  }

  registerEditMethod(edit: MetaArtifactApi['edit']): void {
    this.exampleMetaArtifactApiService.editMethod = edit;
  }

  registerViewMethod(view: MetaArtifactApi['view']): void {
    this.exampleMetaArtifactApiService.viewMethod = view;
  }
}
