import { Component, ViewChild } from '@angular/core';
import { ConcreteArtifactLoaderService } from '../shared/concrete-artifact-loader.service';
import { ConcreteArtifactService } from '../../development-process-registry/running-process/concrete-artifact.service';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { ArtifactVersion } from '../../development-process-registry/running-process/artifact-version';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-concrete-artifact',
  templateUrl: './concrete-artifact.component.html',
  styleUrls: ['./concrete-artifact.component.css'],
  providers: [ConcreteArtifactLoaderService],
})
export class ConcreteArtifactComponent {
  modalVersion?: ArtifactVersion;
  private modalReference?: NgbModalRef;

  @ViewChild('showArtifactVersionModal', { static: true })
  showArtifactVersionModal: unknown;

  constructor(
    private concreteArtifactLoaderService: ConcreteArtifactLoaderService,
    private concreteArtifactService: ConcreteArtifactService,
    private modalService: NgbModal
  ) {}

  async updateIdentifier(identifier: string): Promise<void> {
    if (this.artifact != null) {
      await this.concreteArtifactService.updateIdentifier(
        this.artifact._id,
        identifier
      );
    }
  }

  openShowArtifactVersionModal(version: ArtifactVersion): void {
    this.modalVersion = version;
    this.modalReference = this.modalService.open(
      this.showArtifactVersionModal,
      { size: 'lg' }
    );
  }

  async viewArtifactVersion(): Promise<void> {
    if (this.modalVersion != null && this.artifact != null) {
      this.modalReference?.close();
      await this.concreteArtifactService.view(
        this.artifact._id,
        this.modalVersion.id
      );
    }
  }

  async editArtifactVersion(): Promise<void> {
    if (this.artifact != null) {
      this.modalReference?.close();
      await this.concreteArtifactService.edit(this.artifact._id);
    }
  }

  get artifact(): RunningArtifact | undefined {
    return this.concreteArtifactLoaderService.artifact;
  }
}
