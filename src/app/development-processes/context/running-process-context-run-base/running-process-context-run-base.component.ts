import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  RunningFullProcess,
  RunningFullProcessInit,
} from '../../../development-process-registry/running-process/running-full-process';
import { RunningMethodInfo } from '../../../development-process-registry/running-process/running-method-info';
import { RunningArtifact } from '../../../development-process-registry/running-process/running-artifact';
import { ArtifactVersion } from '../../../development-process-registry/running-process/artifact-version';
import { RunningProcessContextServiceBase } from '../../../development-process-registry/running-process/running-process-context.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Artifact } from '../../../development-process-registry/method-elements/artifact/artifact';
import { OutputArtifactMapping } from '../../../development-process-registry/running-process/output-artifact-mapping';
import { ConcreteArtifactService } from '../../../development-process-registry/running-process/concrete-artifact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-running-process-context-run-base',
  templateUrl: './running-process-context-run-base.component.html',
  styleUrls: ['./running-process-context-run-base.component.css'],
})
export class RunningProcessContextRunBaseComponent<
  T extends RunningFullProcess,
  S extends RunningFullProcessInit
> {
  @Input() runningProcess!: T;
  @Input() missingArtifacts: {
    elementId: string;
    name: string;
    artifacts: Artifact[];
  }[] = [];
  @Input() isComplexModel!: boolean;
  @Output() focusNode = new EventEmitter<string>();

  private modalReference?: NgbModalRef;
  modalRunningMethodInfo?: RunningMethodInfo;
  modalRunningMethodInfoArtifacts?: {
    artifact: RunningArtifact;
    versions: ArtifactVersion[];
  }[];

  @ViewChild('commentsModal', { static: true }) commentsModal: unknown;
  @ViewChild('methodArtifactsModal', { static: true })
  methodArtifactsModal: unknown;
  @ViewChild('removeExecutedMethodModal', { static: true })
  removeExecutedMethodModal: unknown;

  constructor(
    private concreteArtifactService: ConcreteArtifactService,
    private modalService: NgbModal,
    private router: Router,
    private runningProcessContextServiceBase: RunningProcessContextServiceBase<
      T,
      S
    >
  ) {}

  async addArtifact(
    artifact: Artifact,
    output: OutputArtifactMapping
  ): Promise<void> {
    await this.runningProcessContextServiceBase.addArtifact(
      this.runningProcess._id,
      artifact,
      output
    );
  }

  async importArtifact(artifactId: string): Promise<void> {
    const artifact = await this.concreteArtifactService.get(artifactId);
    const copiedArtifact = await this.concreteArtifactService.copy(artifact);
    await this.runningProcessContextServiceBase.importArtifact(
      this.runningProcess._id,
      copiedArtifact
    );
  }

  createArtifact(artifact: Artifact): void {
    this.runningProcessContextServiceBase.createInternalArtifact(
      this.runningProcess._id,
      artifact
    );
  }

  async editArtifact(artifact: RunningArtifact): Promise<void> {
    await this.runningProcessContextServiceBase.editInternalArtifact(
      this.runningProcess._id,
      artifact._id
    );
  }

  async viewArtifactVersion(version: ArtifactVersion): Promise<void> {
    await this.runningProcessContextServiceBase.viewInternalArtifact(
      this.runningProcess._id,
      version.id
    );
  }

  viewArtifacts(executionId: string): void {
    this.modalRunningMethodInfo =
      this.runningProcess?.getExecutedMethod(executionId);
    this.modalRunningMethodInfoArtifacts =
      this.runningProcess?.getArtifactsOfExecutedMethod(executionId);
    this.modalReference = this.modalService.open(this.methodArtifactsModal, {
      size: 'lg',
    });
  }

  async exportArtifact(
    identifier: string,
    artifact: RunningArtifact
  ): Promise<void> {
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

  async renameArtifact(
    identifier: string,
    artifact: RunningArtifact
  ): Promise<void> {
    await this.runningProcessContextServiceBase.renameArtifact(
      this.runningProcess._id,
      artifact._id,
      identifier
    );
  }

  async removeArtifact(artifact: RunningArtifact): Promise<void> {
    await this.runningProcessContextServiceBase.removeArtifact(
      this.runningProcess._id,
      artifact._id
    );
  }

  openRemoveExecutionModal(executionId: string): void {
    this.modalRunningMethodInfo = this.runningProcess.getMethod(executionId);
    this.modalReference = this.modalService.open(
      this.removeExecutedMethodModal,
      {
        size: 'lg',
      }
    );
  }

  async removeExecutedMethod(executionId: string): Promise<void> {
    await this.runningProcessContextServiceBase.removeExecutedMethod(
      this.runningProcess._id,
      executionId
    );
  }

  openCommentsModal(executionId: string): void {
    this.modalRunningMethodInfo = this.runningProcess.getMethod(executionId);
    this.modalReference = this.modalService.open(this.commentsModal, {
      size: 'lg',
    });
  }
}
