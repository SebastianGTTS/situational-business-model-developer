import { Component } from '@angular/core';
import { Artifact } from '../../../development-process-registry/method-elements/artifact/artifact';
import { OutputArtifactMapping } from '../../../development-process-registry/running-process/output-artifact-mapping';
import { RunningProcessServiceBase } from '../../../development-process-registry/running-process/running-process.service';
import { RunningProcessLoaderService } from '../../shared/running-process-loader.service';
import {
  RunningProcess,
  RunningProcessInit,
} from '../../../development-process-registry/running-process/running-process';
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';
import { ConcreteArtifactService } from '../../../development-process-registry/running-process/concrete-artifact.service';
import { Router } from '@angular/router';
import { ArtifactVersion } from '../../../development-process-registry/running-process/artifact-version';

@Component({
  selector: 'app-running-process-artifact',
  templateUrl: './running-process-artifact.component.html',
  styleUrls: ['./running-process-artifact.component.scss'],
})
export class RunningProcessArtifactComponent<
  T extends RunningProcess,
  S extends RunningProcessInit
> {
  constructor(
    private concreteArtifactService: ConcreteArtifactService,
    private router: Router,
    private runningProcessService: RunningProcessServiceBase<T, S>,
    private runningProcessLoaderService: RunningProcessLoaderService
  ) {}

  async addArtifact(
    artifact: Artifact,
    output: OutputArtifactMapping
  ): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.addArtifact(
        this.runningProcess._id,
        artifact,
        output
      );
    }
  }

  createArtifact(artifact: Artifact): void {
    if (this.runningProcess != null) {
      this.runningProcessService.createInternalArtifact(
        this.runningProcess._id,
        artifact
      );
    }
  }

  async editArtifact(artifact: RunningArtifact): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.editInternalArtifact(
        this.runningProcess._id,
        artifact._id
      );
    }
  }

  async importArtifact(artifactId: string): Promise<void> {
    if (this.runningProcess != null) {
      const artifact = await this.concreteArtifactService.get(artifactId);
      const copiedArtifact = await this.concreteArtifactService.copy(artifact);
      await this.runningProcessService.importArtifact(
        this.runningProcess._id,
        copiedArtifact
      );
    }
  }

  async exportArtifact(
    identifier: string,
    artifact: RunningArtifact
  ): Promise<void> {
    if (this.runningProcess != null) {
      artifact = await this.concreteArtifactService.export(
        identifier,
        artifact,
        this.runningProcess.name
      );
      await this.router.navigate([
        '/',
        'concreteArtifacts',
        'detail',
        artifact._id,
      ]);
    }
  }

  async renameArtifact(
    identifier: string,
    artifact: RunningArtifact
  ): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.renameArtifact(
        this.runningProcess._id,
        artifact._id,
        identifier
      );
    }
  }

  async removeArtifact(artifact: RunningArtifact): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.removeArtifact(
        this.runningProcess._id,
        artifact._id
      );
    }
  }

  async viewArtifactVersion(version: ArtifactVersion): Promise<void> {
    if (this.runningProcess != null) {
      await this.runningProcessService.viewInternalArtifact(
        this.runningProcess._id,
        version.id
      );
    }
  }

  get runningProcess(): RunningProcess | undefined {
    return this.runningProcessLoaderService.runningProcess;
  }
}
