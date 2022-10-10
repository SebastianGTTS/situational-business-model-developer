import { Injectable } from '@angular/core';
import {
  MetaModelApi,
  Reference,
} from '../../../development-process-registry/meta-model-definition';
import { HypoMoMapTreeService } from './hypo-mo-map-tree.service';
import { Router } from '@angular/router';
import { DbId } from '../../../database/database-entry';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { HypoMoMapTree } from './hypo-mo-map-tree';

@Injectable()
export class HypoMoMapMetaModelApiService implements MetaModelApi {
  createMethod?: MetaModelApi['create'];
  editMethod?: MetaModelApi['edit'];
  viewMethod?: MetaModelApi['view'];

  constructor(private hypoMoMapTreeService: HypoMoMapTreeService) {}

  create(router: Router, reference: Reference, artifactId: DbId): void {
    if (this.createMethod == null) {
      console.warn('No module to create HypoMoMaps added');
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
      console.warn('No module to edit HypoMoMaps added');
    } else {
      this.editMethod(model, router, reference);
    }
  }

  async copy(model: ArtifactDataReference): Promise<ArtifactDataReference> {
    const instance = await this.hypoMoMapTreeService.get(model.id);
    instance.resetDatabaseState();
    await this.hypoMoMapTreeService.add(instance);
    return {
      id: instance._id,
      type: HypoMoMapTree.typeName,
    };
  }

  async getName(model: ArtifactDataReference): Promise<string | undefined> {
    const instance = await this.hypoMoMapTreeService.get(model.id);
    return instance.rootHypoMoMap.name;
  }

  async remove(model: ArtifactDataReference): Promise<void> {
    await this.hypoMoMapTreeService.delete(model.id);
  }

  view(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): void {
    if (this.viewMethod == null) {
      console.warn('No module to view HypoMoMaps added');
    } else {
      this.viewMethod(model, router, reference);
    }
  }
}
