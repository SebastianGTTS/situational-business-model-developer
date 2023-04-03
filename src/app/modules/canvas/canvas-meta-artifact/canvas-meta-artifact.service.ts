import { Injectable } from '@angular/core';
import { MetaArtifactService } from '../../../development-process-registry/meta-artifact.service';
import { CompanyModel } from './company-model';
import {
  MetaArtifactApi,
  MetaArtifactDefinition,
} from '../../../development-process-registry/meta-artifact-definition';
import { CanvasMetaArtifactApiService } from './canvas-meta-artifact-api.service';

@Injectable()
export class CanvasMetaArtifactService {
  constructor(
    private canvasMetaArtifactApiService: CanvasMetaArtifactApiService,
    private metaArtifactService: MetaArtifactService
  ) {}

  init(): void {
    const definition: MetaArtifactDefinition = {
      name: 'Canvas',
      type: CompanyModel.typeName,
      api: this.canvasMetaArtifactApiService,
    };
    this.metaArtifactService.registerMetaArtifact(definition);
    console.log('Registered Canvas Meta Artifact');
  }

  registerCreateMethod(create: MetaArtifactApi['create']): void {
    this.canvasMetaArtifactApiService.createMethod = create;
  }

  registerEditMethod(edit: MetaArtifactApi['edit']): void {
    this.canvasMetaArtifactApiService.editMethod = edit;
  }

  registerViewMethod(view: MetaArtifactApi['view']): void {
    this.canvasMetaArtifactApiService.viewMethod = view;
  }
}
