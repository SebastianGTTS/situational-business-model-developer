import { Component, QueryList, ViewChildren } from '@angular/core';
import {
  Artifact,
  ArtifactInit,
} from '../../../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactService } from '../../../../development-process-registry/method-elements/artifact/artifact.service';
import { MethodElementLoaderService } from '../../../shared/method-element-loader.service';
import { MethodElementService } from '../../../../development-process-registry/method-elements/method-element.service';
import { IconInit } from 'src/app/model/icon';
import { Updatable, UPDATABLE } from 'src/app/shared/updatable';

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.css'],
  providers: [
    MethodElementLoaderService,
    { provide: MethodElementService, useExisting: ArtifactService },
    { provide: UPDATABLE, useExisting: ArtifactComponent },
  ],
})
export class ArtifactComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(
    private artifactLoaderService: MethodElementLoaderService<
      Artifact,
      ArtifactInit
    >,
    private artifactService: ArtifactService
  ) {}

  async updateValue(value: ArtifactInit): Promise<void> {
    if (this.artifact != null) {
      await this.artifactService.update(this.artifact._id, value);
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.artifact != null) {
      await this.artifactService.updateIcon(this.artifact._id, icon);
    }
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get artifact(): Artifact | undefined {
    return this.artifactLoaderService.methodElement;
  }

  get listNames(): string[] {
    return this.artifactLoaderService.listNames;
  }
}
