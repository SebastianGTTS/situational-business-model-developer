import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ArtifactVersion } from '../../development-process-registry/running-process/artifact-version';
import { DbId } from '../../database/database-entry';
import { OutputArtifactMapping } from '../../development-process-registry/running-process/output-artifact-mapping';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';

@Component({
  selector: 'app-running-process-artifacts',
  templateUrl: './running-process-artifacts.component.html',
  styleUrls: ['./running-process-artifacts.component.css'],
})
export class RunningProcessArtifactsComponent implements OnChanges {
  @Input() runningProcess!: RunningProcess;
  @Input() artifactVersions?: {
    artifact: RunningArtifact;
    versions: ArtifactVersion[];
  }[];
  @Input() allowChanges = true;

  @Output() importArtifact = new EventEmitter<DbId>();
  @Output() exportArtifact = new EventEmitter<{
    identifier: string;
    artifact: RunningArtifact;
  }>();
  @Output() renameArtifact = new EventEmitter<{
    identifier: string;
    artifact: RunningArtifact;
  }>();
  @Output() addArtifact = new EventEmitter<{
    artifact: Artifact;
    output: OutputArtifactMapping;
  }>();
  @Output() createArtifact = new EventEmitter<Artifact>();
  @Output() focusNode = new EventEmitter<string>();
  @Output() viewArtifactVersion = new EventEmitter<ArtifactVersion>();
  @Output() editArtifact = new EventEmitter<RunningArtifact>();
  @Output() removeArtifact = new EventEmitter<RunningArtifact>();

  _artifactVersions?: {
    artifact: RunningArtifact;
    versions: ArtifactVersion[];
  }[];

  modalArtifact?: RunningArtifact;
  modalArtifactVersion?: ArtifactVersion;
  private modalReference?: NgbModalRef;

  @ViewChild('artifactShowVersionModal', { static: true })
  artifactShowVersionModal: unknown;
  @ViewChild('artifactExportModal', { static: true })
  artifactExportModal: unknown;
  @ViewChild('artifactImportModal', { static: true })
  artifactImportModal: unknown;
  @ViewChild('artifactRenameModal', { static: true })
  artifactRenameModal: unknown;
  @ViewChild('artifactRemoveModal', { static: true })
  artifactRemoveModal: unknown;
  @ViewChild('addArtifactModal', { static: true })
  addArtifactModal: unknown;

  constructor(private modalService: NgbModal) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runningProcess || changes.artifactVersions) {
      if (this.artifactVersions != null) {
        this._artifactVersions = this.artifactVersions;
      } else {
        this._artifactVersions = this.runningProcess.artifacts.map(
          (artifact) => {
            return {
              artifact: artifact,
              versions: artifact.versions,
            };
          }
        );
      }
    }
  }

  openAddArtifactModal(): void {
    this.modalReference = this.modalService.open(this.addArtifactModal, {
      size: 'lg',
    });
  }

  openArtifactExportModal(artifact: RunningArtifact): void {
    this.modalArtifact = artifact;
    this.modalReference = this.modalService.open(this.artifactExportModal, {
      size: 'lg',
    });
  }

  openArtifactImportModal(): void {
    this.modalReference = this.modalService.open(this.artifactImportModal, {
      size: 'lg',
    });
  }

  openArtifactRenameModal(artifact: RunningArtifact): void {
    this.modalArtifact = artifact;
    this.modalReference = this.modalService.open(this.artifactRenameModal, {
      size: 'lg',
    });
  }

  openArtifactRemoveModal(artifact: RunningArtifact): void {
    this.modalArtifact = artifact;
    this.modalReference = this.modalService.open(this.artifactRemoveModal, {
      size: 'lg',
    });
  }

  openArtifactShowVersionModal(
    artifact: RunningArtifact,
    version: ArtifactVersion
  ): void {
    this.modalArtifact = artifact;
    this.modalArtifactVersion = version;
    this.modalReference = this.modalService.open(
      this.artifactShowVersionModal,
      { size: 'lg' }
    );
  }
}
