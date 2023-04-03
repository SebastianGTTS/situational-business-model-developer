import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { RunningPatternProcess } from '../../../development-process-registry/running-process/running-pattern-process';
import { ContextChangeRunningProcess } from '../../../development-process-registry/running-process/running-full-process';
import { RunningPatternProcessContextService } from '../../../development-process-registry/running-process/running-pattern-process-context.service';
import { RunningProcessContextFakeExecuteModalComponent } from '../running-process-context-fake-execute-modal/running-process-context-fake-execute-modal.component';
import { RunningProcessContextFakeExecuteModal } from '../running-process-context-fake-execute-modal/running-process-context-fake-execute-modal';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RunningProcessViewerComponent } from '../../../development-process-view/running-process-viewer/running-process-viewer.component';
import { MissingArtifactsNodesList } from '../../../development-process-registry/bm-process/bm-process-diagram-artifacts';
import { Artifact } from '../../../development-process-registry/method-elements/artifact/artifact';
import { RunningProcessViewerService } from '../../../development-process-view/shared/running-process-viewer.service';
import { RunningProcessViewerEditService } from '../../../development-process-view/shared/running-process-viewer-edit.service';

@Component({
  selector: 'app-running-pattern-process-context-run',
  templateUrl: './running-pattern-process-context-run.component.html',
  styleUrls: ['./running-pattern-process-context-run.component.css'],
  providers: [
    {
      provide: RunningProcessViewerService,
      useExisting: RunningProcessViewerEditService,
    },
  ],
})
export class RunningPatternProcessContextRunComponent implements OnChanges {
  @Input() runningProcess!: RunningPatternProcess & ContextChangeRunningProcess;

  private modalReference?: NgbModalRef;

  unreachableNodeIds?: Set<string>;
  missingArtifactsNodeIds?: Set<string>;
  missingArtifacts: {
    elementId: string;
    name: string;
    artifacts: Artifact[];
  }[] = [];

  @ViewChild(RunningProcessViewerComponent)
  viewer?: RunningProcessViewerComponent;

  constructor(
    private modalService: NgbModal,
    private runningPatternProcessContextService: RunningPatternProcessContextService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runningProcess) {
      void this.checkArtifacts();
    }
  }

  focus(nodeId: string): void {
    this.viewer?.focus(nodeId);
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
      await this.runningPatternProcessContextService.fakeMethodExecution(
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

  async startExecution(nodeId: string): Promise<void> {
    await this.runningPatternProcessContextService.resetExecutionToPosition(
      this.runningProcess._id,
      nodeId
    );
  }

  async skipExecution(nodeId: string): Promise<void> {
    await this.runningPatternProcessContextService.skipExecution(
      this.runningProcess._id,
      nodeId
    );
  }

  private async checkArtifacts(): Promise<void> {
    const list: MissingArtifactsNodesList =
      await this.runningPatternProcessContextService.checkExecution(
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
