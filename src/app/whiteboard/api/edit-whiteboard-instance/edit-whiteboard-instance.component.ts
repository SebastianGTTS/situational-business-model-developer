import { Component, ViewChild } from '@angular/core';
import { ProcessApiService } from '../../../development-process-registry/module-api/process-api.service';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';
import { Comment } from '../../../development-process-registry/running-process/comment';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../../development-process-registry/running-process/running-method';
import { WhiteboardResolveService } from '../../whiteboard-resolve.service';
import { WhiteboardInstance } from '../../../whiteboard-meta-model/whiteboard-instance';
import { WhiteboardCanvasComponent } from '../../whiteboard-canvas/whiteboard-canvas.component';
import { WhiteboardCanvasControls } from '../../whiteboard-canvas/whiteboard-canvas-controls';
import { WhiteboardInstanceService } from '../../../whiteboard-meta-model/whiteboard-instance.service';
import { WhiteboardInstanceLoaderService } from '../../shared/whiteboard-instance-loader.service';
import { WhiteboardEditComponent } from '../../shared/whiteboard-edit-component';

@Component({
  selector: 'app-edit-whiteboard-instance',
  templateUrl: './edit-whiteboard-instance.component.html',
  styleUrls: ['./edit-whiteboard-instance.component.css'],
  providers: [ProcessApiService, WhiteboardInstanceLoaderService],
})
export class EditWhiteboardInstanceComponent
  implements WhiteboardEditComponent
{
  @ViewChild(WhiteboardCanvasComponent)
  whiteboardCanvasControls!: WhiteboardCanvasControls;

  private changesSaved = false;

  constructor(
    private processApiService: ProcessApiService,
    private runningProcessService: RunningProcessService,
    private whiteboardInstanceLoaderService: WhiteboardInstanceLoaderService,
    private whiteboardInstanceService: WhiteboardInstanceService,
    private whiteboardResolveService: WhiteboardResolveService
  ) {}

  async addComment(comment: Comment): Promise<void> {
    await this.runningProcessService.addComment(
      this.runningProcess._id,
      this.runningMethod.executionId,
      comment
    );
  }

  async updateComment(comment: Comment): Promise<void> {
    await this.runningProcessService.updateComment(
      this.runningProcess._id,
      this.runningMethod.executionId,
      comment
    );
  }

  async removeComment(commentId: string): Promise<void> {
    await this.runningProcessService.removeComment(
      this.runningProcess._id,
      this.runningMethod.executionId,
      commentId
    );
  }

  async finish(): Promise<void> {
    if (await this.whiteboardChanged()) {
      await this.saveWhiteboard();
      this.changesSaved = true;
    }
    if (this.whiteboardInstance != null) {
      this.whiteboardResolveService.resolve(
        this.processApiService.stepInfo,
        this.whiteboardInstance._id
      );
    }
  }

  async saveWhiteboard(): Promise<void> {
    if (
      this.whiteboardInstance != null &&
      this.runningMethod != null &&
      this.isCorrectStep()
    ) {
      const whiteboard = this.whiteboardCanvasControls.save();
      await this.whiteboardInstanceService.saveWhiteboardCanvas(
        this.whiteboardInstance._id,
        whiteboard
      );
    }
  }

  get whiteboardInstance(): WhiteboardInstance | undefined {
    return this.whiteboardInstanceLoaderService.whiteboardInstance;
  }

  private get runningProcess(): RunningProcess {
    return this.processApiService.runningProcess;
  }

  get runningMethod(): RunningMethod {
    return this.processApiService.runningMethod;
  }

  isCorrectStep(): boolean {
    return this.processApiService.isCorrectStep();
  }

  async whiteboardChanged(): Promise<boolean> {
    if (this.changesSaved) {
      return false;
    }
    if (
      this.whiteboardCanvasControls != null &&
      this.whiteboardInstance != null
    ) {
      return (
        this.whiteboardCanvasControls.save() !==
        this.whiteboardInstance.whiteboard
      );
    }
    return false;
  }
}
