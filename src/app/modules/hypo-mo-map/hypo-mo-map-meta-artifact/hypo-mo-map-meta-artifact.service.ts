import { Injectable } from '@angular/core';
import {
  MetaArtifactApi,
  MetaArtifactDefinition,
  MetaArtifactIdentifier,
} from '../../../development-process-registry/meta-artifact-definition';
import { HypoMoMapTree } from './hypo-mo-map-tree';
import { MetaArtifactService } from '../../../development-process-registry/meta-artifact.service';
import { HypoMoMapMetaArtifactApiService } from './hypo-mo-map-meta-artifact-api.service';

@Injectable()
export class HypoMoMapMetaArtifactService {
  readonly hypoMoMapMetaArtifactIdentifier: Readonly<MetaArtifactIdentifier> = {
    name: 'HypoMoMap',
    type: HypoMoMapTree.typeName,
  };

  constructor(
    private hypoMoMapMetaArtifactApiService: HypoMoMapMetaArtifactApiService,
    private metaArtifactService: MetaArtifactService
  ) {}

  init(): void {
    const definition: MetaArtifactDefinition = {
      ...this.hypoMoMapMetaArtifactIdentifier,
      api: this.hypoMoMapMetaArtifactApiService,
    };
    this.metaArtifactService.registerMetaArtifact(definition);
    console.log('Registered HypoMoMap Meta Artifact');
  }

  registerCreateMethod(create: MetaArtifactApi['create']): void {
    this.hypoMoMapMetaArtifactApiService.createMethod = create;
  }

  registerEditMethod(edit: MetaArtifactApi['edit']): void {
    this.hypoMoMapMetaArtifactApiService.editMethod = edit;
  }

  registerViewMethod(view: MetaArtifactApi['view']): void {
    this.hypoMoMapMetaArtifactApiService.viewMethod = view;
  }
}
