import { Injectable } from '@angular/core';
import {
  MetaModelApi,
  Reference,
} from '../development-process-registry/meta-model-definition';
import { ArtifactDataReference } from '../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';
import { WhiteboardInstanceService } from './whiteboard-instance.service';
import { WhiteboardInstance } from './whiteboard-instance';

@Injectable()
export class WhiteboardMetaModelApiService implements MetaModelApi {
  viewMethod?: (
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ) => void;

  constructor(private whiteboardInstanceService: WhiteboardInstanceService) {}

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
