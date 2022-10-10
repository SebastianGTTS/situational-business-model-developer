import { Injectable } from '@angular/core';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import {
  MetaModelApi,
  Reference,
} from '../../../development-process-registry/meta-model-definition';
import { Router } from '@angular/router';
import { DbId } from '../../../database/database-entry';
import { ExampleService } from './example.service';
import { Example } from './example';

@Injectable()
export class ExampleArtifactApiService implements MetaModelApi {
  createMethod?: MetaModelApi['create'];
  editMethod?: MetaModelApi['edit'];
  viewMethod?: MetaModelApi['view'];

  constructor(private exampleService: ExampleService) {}

  create(router: Router, reference: Reference, artifactId: DbId): void {
    if (this.createMethod == null) {
      console.warn('No module for the creation added');
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
      console.warn('No module for editing added');
    } else {
      this.editMethod(model, router, reference);
    }
  }

  view(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): void {
    if (this.viewMethod == null) {
      console.warn('No module for viewing added');
    } else {
      this.viewMethod(model, router, reference);
    }
  }

  async getName(model: ArtifactDataReference): Promise<string | undefined> {
    const example = await this.exampleService.get(model.id);
    return example.name;
  }

  async copy(model: ArtifactDataReference): Promise<ArtifactDataReference> {
    const example = await this.exampleService.get(model.id);
    example.resetDatabaseState();
    await this.exampleService.add(example);
    return {
      id: example._id,
      type: Example.typeName,
    };
  }

  async remove(model: ArtifactDataReference): Promise<void> {
    await this.exampleService.delete(model.id);
  }
}
