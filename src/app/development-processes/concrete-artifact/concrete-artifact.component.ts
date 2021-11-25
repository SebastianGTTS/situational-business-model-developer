import { Component, ViewChild } from '@angular/core';
import { ConcreteArtifactLoaderService } from '../shared/concrete-artifact-loader.service';
import { ConcreteArtifactService } from '../../development-process-registry/running-process/concrete-artifact.service';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { ArtifactVersion } from '../../development-process-registry/running-process/artifact-version';
import {
  ArtifactDataReference,
  ArtifactDataType,
} from '../../development-process-registry/running-process/artifact-data';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MetaModelService } from '../../development-process-registry/meta-model.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-concrete-artifact',
  templateUrl: './concrete-artifact.component.html',
  styleUrls: ['./concrete-artifact.component.css'],
  providers: [ConcreteArtifactLoaderService],
})
export class ConcreteArtifactComponent {
  modalVersion: ArtifactVersion;
  private modalReference: NgbModalRef;

  @ViewChild('showArtifactVersionModal', { static: true })
  showArtifactVersionModal: any;

  constructor(
    private concreteArtifactLoaderService: ConcreteArtifactLoaderService,
    private concreteArtifactService: ConcreteArtifactService,
    private metaModelService: MetaModelService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  async update(value: Partial<RunningArtifact>) {
    await this.concreteArtifactService.update(this.artifact._id, value);
  }

  openShowArtifactVersionModal(version: ArtifactVersion) {
    this.modalVersion = version;
    this.modalReference = this.modalService.open(
      this.showArtifactVersionModal,
      { size: 'lg' }
    );
  }

  viewArtifactReference(reference: ArtifactDataReference) {
    this.modalReference.close();
    this.metaModelService
      .getMetaModelApi(reference.type)
      .view(reference, this.router, {
        referenceType: 'Artifact',
        artifactId: this.artifact._id,
        versionId: this.artifact.versions.indexOf(this.modalVersion),
      });
  }

  get artifact() {
    return this.concreteArtifactLoaderService.artifact;
  }

  getArtifactDataTypeString(): ArtifactDataType {
    return ArtifactDataType.STRING;
  }

  getArtifactDataTypeReference(): ArtifactDataType {
    return ArtifactDataType.REFERENCE;
  }
}
