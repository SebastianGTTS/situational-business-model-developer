import { Injectable } from '@angular/core';
import {
  MetaModelApi,
  Reference,
} from '../../../development-process-registry/meta-model-definition';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';
import { WhiteboardInstanceService } from './whiteboard-instance.service';
import { WhiteboardInstance } from './whiteboard-instance';
import { DbId } from '../../../database/database-entry';

@Injectable()
export class WhiteboardMetaModelApiService implements MetaModelApi {
  createMethod?: MetaModelApi['create'];
  editMethod?: MetaModelApi['edit'];
  viewMethod?: MetaModelApi['view'];

  constructor(private whiteboardInstanceService: WhiteboardInstanceService) {}

  create(router: Router, reference: Reference, artifactId: DbId): void {
    if (this.createMethod == null) {
      console.warn('No module to create whiteboards added');
    } else {
      this.createMethod(router, reference, artifactId);
    }
  }

  edit(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): void {
    if (this.editMethod == null) {
      console.warn('No module to edit whiteboards added');
    } else {
      this.editMethod(model, router, reference);
    }
  }

  async copy(model: ArtifactDataReference): Promise<ArtifactDataReference> {
    const instance = await this.whiteboardInstanceService.get(model.id);
    instance.resetDatabaseState();
    await this.whiteboardInstanceService.add(instance);
    return {
      id: instance._id,
      type: WhiteboardInstance.typeName,
    };
  }

  async getName(model: ArtifactDataReference): Promise<string | undefined> {
    const instance = await this.whiteboardInstanceService.get(model.id);
    return instance.name;
  }

  async remove(model: ArtifactDataReference): Promise<void> {
    await this.whiteboardInstanceService.delete(model.id);
  }

  view(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): void {
    if (this.viewMethod == null) {
      console.warn('No module to view whiteboards added');
    } else {
      this.viewMethod(model, router, reference);
    }
  }
}
