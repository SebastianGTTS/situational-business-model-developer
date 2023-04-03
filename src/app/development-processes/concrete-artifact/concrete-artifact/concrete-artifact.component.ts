import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConcreteArtifactLoaderService } from '../../shared/concrete-artifact-loader.service';
import { ConcreteArtifactService } from '../../../development-process-registry/running-process/concrete-artifact.service';
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';
import { ArtifactVersion } from '../../../development-process-registry/running-process/artifact-version';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IconInit } from '../../../model/icon';
import { Updatable, UPDATABLE } from '../../../shared/updatable';

@Component({
  selector: 'app-concrete-artifact',
  templateUrl: './concrete-artifact.component.html',
  styleUrls: ['./concrete-artifact.component.css'],
  providers: [
    ConcreteArtifactLoaderService,
    { provide: UPDATABLE, useExisting: ConcreteArtifactComponent },
  ],
})
export class ConcreteArtifactComponent implements Updatable {
  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  modalVersion?: ArtifactVersion;
  private modalReference?: NgbModalRef;

  @ViewChild('showArtifactVersionModal', { static: true })
  showArtifactVersionModal: unknown;

  constructor(
    private concreteArtifactLoaderService: ConcreteArtifactLoaderService,
    private concreteArtifactService: ConcreteArtifactService,
    private modalService: NgbModal
  ) {}

  async updateInfo(identifier: string, description: string): Promise<void> {
    if (this.artifact != null) {
      await this.concreteArtifactService.updateInfo(
        this.artifact._id,
        identifier,
        description
      );
    }
  }

  async updateIcon(icon: IconInit): Promise<void> {
    if (this.artifact != null) {
      await this.concreteArtifactService.updateIcon(this.artifact._id, icon);
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

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  get artifact(): RunningArtifact | undefined {
    return this.concreteArtifactLoaderService.artifact;
  }
}
