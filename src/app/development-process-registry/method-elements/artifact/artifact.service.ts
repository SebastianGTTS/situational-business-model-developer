import { Injectable } from '@angular/core';
import { MethodElementService } from '../method-element.service';
import { Artifact, ArtifactInit } from './artifact';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';
import { PouchdbService } from '../../../database/pouchdb.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ArtifactService extends MethodElementService<
  Artifact,
  ArtifactInit
> {
  protected readonly typeName = Artifact.typeName;

  constructor(pouchdbService: PouchdbService) {
    super(pouchdbService);
  }

  protected readonly elementConstructor = Artifact;
}
