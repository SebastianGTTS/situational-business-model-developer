import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FullRunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningProcessViewerService } from '../../development-process-view/shared/running-process-viewer.service';
import { RunningProcessViewerEditService } from '../../development-process-view/shared/running-process-viewer-edit.service';
import { RunningProcessContextService } from '../../development-process-registry/running-process/running-process-context.service';
import { RunningProcessViewerComponent } from '../../development-process-view/running-process-viewer/running-process-viewer.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RunningMethodInfo } from '../../development-process-registry/running-process/running-method-info';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { ArtifactVersion } from '../../development-process-registry/running-process/artifact-version';
import { RunningProcessContextFakeExecuteModalComponent } from '../running-process-context-fake-execute-modal/running-process-context-fake-execute-modal.component';
import { RunningProcessContextFakeExecuteModal } from '../running-process-context-fake-execute-modal/running-process-context-fake-execute-modal';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { OutputArtifactMapping } from '../../development-process-registry/running-process/output-artifact-mapping';
import { ConcreteArtifactService } from '../../development-process-registry/running-process/concrete-artifact.service';
import { Router } from '@angular/router';
import { MissingArtifactsNodesList } from '../../development-process-registry/bm-process/bm-process-diagram-artifacts';

@Component({
  selector: 'app-running-process-context-run',
  templateUrl: './running-process-context-run.component.html',
  styleUrls: ['./running-process-context-run.component.css'],
  providers: [
    {
      provide: RunningProcessViewerService,
      useExisting: RunningProcessViewerEditService,
    },
  ],
})
export class RunningProcessContextRunComponent implements OnChanges {
  @Input() runningProcess!: FullRunningProcess;

  modalRunningMethodInfo?: RunningMethodInfo;
  modalRunningMethodInfoArtifacts?: {
    artifact: RunningArtifact;
    versions: ArtifactVersion[];
  }[];
  private modalReference?: NgbModalRef;

  unreachableNodeIds?: Set<string>;
  missingArtifactsNodeIds?: Set<string>;

  missingArtifacts: {
    elementId: string;
    name: string;
    artifacts: Artifact[];
  }[] = [];

  @ViewChild('commentsModal', { static: true }) commentsModal: unknown;
  @ViewChild('removeExecutedMethodModal', { static: true })
  removeExecutedMethodModal: unknown;
  @ViewChild('methodArtifactsModal', { static: true })
  methodArtifactsModal: unknown;
  @ViewChild(RunningProcessViewerComponent)
  viewer!: RunningProcessViewerComponent;

  constructor(
    private concreteArtifactService: ConcreteArtifactService,
    private modalService: NgbModal,
    private router: Router,
    private runningProcessContextService: RunningProcessContextService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runningProcess) {
      void this.checkArtifacts();
    }
  }

  async startExecution(nodeId: string): Promise<void> {
    await this.runningProcessContextService.resetExecutionToPosition(
      this.runningProcess._id,
      nodeId
    );
  }

  openFakeExecuteModal(nodeId: string): void {
    this.modalReference = this.modalService.open(
      RunningProcessContextFakeExecuteModalComponent,
      {
        size: 'lg',
      }
    );
    const modal: RunningProcessContextFakeExecuteModal =
      this.modalReference.componentInstance;
    modal.artifacts = this.runningProcess.artifacts;
    modal.methodDecision = this.runningProcess.process.decisions[nodeId];
    modal.addFakeExecution.subscribe(async (outputMapping) => {
      await this.runningProcessContextService.fakeMethodExecution(
        this.runningProcess._id,
        nodeId,
        outputMapping.filter((mapping) => mapping.artifact != null) as {
          artifact: number;
          version: number;
        }[]
      );
      this.modalReference?.close();
    });
    modal.onAllInputsSet();
  }

  async skipExecution(nodeId: string): Promise<void> {
    await this.runningProcessContextService.skipExecution(
      this.runningProcess._id,
      nodeId
    );
  }

  focus(nodeId: string): void {
    this.viewer.focus(nodeId);
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

  openCommentsModal(executionId: string): void {
    this.modalRunningMethodInfo = this.runningProcess.getMethod(executionId);
    this.modalReference = this.modalService.open(this.commentsModal, {
      size: 'lg',
    });
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
    await this.runningProcessContextService.removeExecutedMethod(
      this.runningProcess._id,
      executionId
    );
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

  async importArtifact(artifactId: string): Promise<void> {
    const artifact = await this.concreteArtifactService.get(artifactId);
    const copiedArtifact = await this.concreteArtifactService.copy(artifact);
    await this.runningProcessContextService.importArtifact(
      this.runningProcess._id,
      copiedArtifact
    );
  }

  async renameArtifact(
    identifier: string,
    artifact: RunningArtifact
  ): Promise<void> {
    await this.runningProcessContextService.renameArtifact(
      this.runningProcess,
      artifact,
      identifier
    );
  }

  async removeArtifact(artifact: RunningArtifact): Promise<void> {
    await this.runningProcessContextService.removeArtifact(
      this.runningProcess._id,
      artifact._id
    );
  }

  async addArtifact(
    artifact: Artifact,
    output: OutputArtifactMapping
  ): Promise<void> {
    await this.runningProcessContextService.addArtifact(
      this.runningProcess._id,
      artifact,
      output
    );
  }

  createArtifact(artifact: Artifact): void {
    this.runningProcessContextService.createInternalArtifact(
      this.runningProcess._id,
      artifact
    );
  }

  async editArtifact(artifact: RunningArtifact): Promise<void> {
    await this.runningProcessContextService.editInternalArtifact(
      this.runningProcess,
      artifact
    );
  }

  async viewArtifactVersion(version: ArtifactVersion): Promise<void> {
    await this.runningProcessContextService.viewInternalArtifact(
      this.runningProcess._id,
      version.id
    );
  }

  private async checkArtifacts(): Promise<void> {
    const list: MissingArtifactsNodesList =
      await this.runningProcessContextService.checkExecution(
        this.runningProcess._id
      );
    this.unreachableNodeIds = new Set<string>(
      list
        .filter((node) => node.missingArtifacts === null)
        .map((node) => node.node.id)
    );
    this.missingArtifactsNodeIds = new Set<string>(
      list
        .filter((node) => node.missingArtifacts != null)
        .map((node) => node.node.id)
    );
    this.missingArtifacts = list
      .filter(
        (node) =>
          node.missingArtifacts != null &&
          node.node.id in this.runningProcess.process.decisions
      )
      .map((node) => {
        return {
          elementId: node.node.id,
          name: this.runningProcess.process.decisions[node.node.id].method.name,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          artifacts: node.missingArtifacts!,
        };
      });
  }
}
