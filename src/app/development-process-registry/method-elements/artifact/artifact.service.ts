import { Injectable } from '@angular/core';
import { MethodElementService } from '../method-element.service';
import { Artifact } from './artifact';
import { DevelopmentProcessRegistryModule } from '../../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ArtifactService extends MethodElementService<Artifact> {
  protected createElement(element: Partial<Artifact>): Artifact {
    return new Artifact(element);
  }

  protected get typeName(): string {
    return Artifact.typeName;
  }
}
