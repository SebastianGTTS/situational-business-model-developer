import { Injectable } from '@angular/core';
import { MetaModelService } from '../../../development-process-registry/meta-model.service';
import {
  MetaModelApi,
  MetaModelDefinition,
  MetaModelIdentifier,
} from '../../../development-process-registry/meta-model-definition';
import { WhiteboardInstance } from './whiteboard-instance';
import { WhiteboardMetaModelApiService } from './whiteboard-meta-model-api.service';

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

  registerCreateMethod(create: MetaModelApi['create']): void {
    this.whiteboardMetaModelApiService.createMethod = create;
  }

  registerEditMethod(edit: MetaModelApi['edit']): void {
    this.whiteboardMetaModelApiService.editMethod = edit;
  }

  registerViewMethod(view: MetaModelApi['view']): void {
    this.whiteboardMetaModelApiService.viewMethod = view;
  }
}
