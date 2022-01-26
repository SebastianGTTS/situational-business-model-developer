import { Injectable } from '@angular/core';
import { MetaModelService } from '../development-process-registry/meta-model.service';
import {
  MetaModelDefinition,
  MetaModelIdentifier,
  Reference,
} from '../development-process-registry/meta-model-definition';
import { Whiteboard } from './whiteboard';
import { WhiteboardInstance } from './whiteboard-instance';
import { WhiteboardMetaModelApiService } from './whiteboard-meta-model-api.service';
import { ArtifactDataReference } from '../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';

@Injectable()
export class WhiteboardMetaModelService {
  readonly whiteboardMetaModelIdentifier: Readonly<MetaModelIdentifier> = {
    name: 'Whiteboard',
    type: WhiteboardInstance.typeName,
  };

  constructor(
    private metaModelService: MetaModelService,
    private whiteboardMetaModelApiService: WhiteboardMetaModelApiService
  ) {}

  init(): void {
    const definition: MetaModelDefinition = {
      ...this.whiteboardMetaModelIdentifier,
      api: this.whiteboardMetaModelApiService,
    };
    this.metaModelService.registerMetaModel(definition);
    console.log('Registered Whiteboard Meta Model');
  }

  registerViewMethod(
    view: (
      model: ArtifactDataReference,
      router: Router,
      reference: Reference
    ) => Promise<void>
  ): void {
    this.whiteboardMetaModelApiService.viewMethod = view;
  }
}
