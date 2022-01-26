import { Component } from '@angular/core';
import {
  Artifact,
  ArtifactInit,
} from '../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactService } from '../../development-process-registry/method-elements/artifact/artifact.service';
import { MethodElementLoaderService } from '../shared/method-element-loader.service';
import { MethodElementService } from '../../development-process-registry/method-elements/method-element.service';

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.css'],
  providers: [
    MethodElementLoaderService,
    { provide: MethodElementService, useExisting: ArtifactService },
  ],
})
export class ArtifactComponent {
  constructor(
    private artifactLoaderService: MethodElementLoaderService<
      Artifact,
      ArtifactInit
    >,
    private artifactService: ArtifactService
  ) {}

  async updateValue(value: any): Promise<void> {
    await this.artifactService.update(this.artifact._id, value);
  }

  get artifact(): Artifact {
    return this.artifactLoaderService.methodElement;
  }

  get listNames(): string[] {
    return this.artifactLoaderService.listNames;
  }
}
