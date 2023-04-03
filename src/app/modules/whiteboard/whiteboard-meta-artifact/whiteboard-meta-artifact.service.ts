import { Injectable } from '@angular/core';
import { MetaArtifactService } from '../../../development-process-registry/meta-artifact.service';
import {
  MetaArtifactApi,
  MetaArtifactDefinition,
  MetaArtifactIdentifier,
} from '../../../development-process-registry/meta-artifact-definition';
import { WhiteboardInstance } from './whiteboard-instance';
import { WhiteboardMetaArtifactApiService } from './whiteboard-meta-artifact-api.service';

@Injectable()
export class WhiteboardMetaArtifactService {
  readonly whiteboardMetaArtifactIdentifier: Readonly<MetaArtifactIdentifier> =
    {
      name: 'Whiteboard',
      type: WhiteboardInstance.typeName,
    };

  constructor(
    private metaArtifactService: MetaArtifactService,
    private whiteboardMetaArtifactApiService: WhiteboardMetaArtifactApiService
  ) {}

  init(): void {
    const definition: MetaArtifactDefinition = {
      ...this.whiteboardMetaArtifactIdentifier,
      api: this.whiteboardMetaArtifactApiService,
    };
    this.metaArtifactService.registerMetaArtifact(definition);
    console.log('Registered Whiteboard Meta Artifact');
  }

  registerCreateMethod(create: MetaArtifactApi['create']): void {
    this.whiteboardMetaArtifactApiService.createMethod = create;
  }

  registerEditMethod(edit: MetaArtifactApi['edit']): void {
    this.whiteboardMetaArtifactApiService.editMethod = edit;
  }

  registerViewMethod(view: MetaArtifactApi['view']): void {
    this.whiteboardMetaArtifactApiService.viewMethod = view;
  }
}
