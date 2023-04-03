import { Component, ViewChild } from '@angular/core';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { RunningProcessService } from '../../../../../development-process-registry/running-process/running-process.service';
import { WhiteboardToolResolveService } from '../../whiteboard-tool-resolve.service';
import { WhiteboardInstance } from '../../../whiteboard-meta-artifact/whiteboard-instance';
import { WhiteboardCanvasComponent } from '../../whiteboard-canvas/whiteboard-canvas.component';
import { WhiteboardCanvasControls } from '../../whiteboard-canvas/whiteboard-canvas-controls';
import { WhiteboardInstanceService } from '../../../whiteboard-meta-artifact/whiteboard-instance.service';
import { WhiteboardInstanceLoaderService } from '../../shared/whiteboard-instance-loader.service';
import { WhiteboardEditComponent } from '../../shared/whiteboard-edit-component';
import { RunningProcessMethodCommentsMixin } from '../../../../../development-process-view/shared/running-process-method-comments.mixin';
import { EmptyClass } from '../../../../../shared/utils';
import { ProcessApiMixin } from '../../../../../development-process-view/shared/process-api.mixin';

@Component({
  selector: 'app-edit-whiteboard-instance',
  templateUrl: './edit-whiteboard-instance.component.html',
  styleUrls: ['./edit-whiteboard-instance.component.css'],
  providers: [ProcessApiService, WhiteboardInstanceLoaderService],
})
export class EditWhiteboardInstanceComponent
  extends ProcessApiMixin(RunningProcessMethodCommentsMixin(EmptyClass))
  implements WhiteboardEditComponent
{
  @ViewChild(WhiteboardCanvasComponent)
  whiteboardCanvasControls!: WhiteboardCanvasControls;

  private changesSaved = false;
  deactivate = false;

  constructor(
    protected processApiService: ProcessApiService,
    protected runningProcessService: RunningProcessService,
    private whiteboardInstanceLoaderService: WhiteboardInstanceLoaderService,
    private whiteboardInstanceService: WhiteboardInstanceService,
    private whiteboardResolveService: WhiteboardToolResolveService
  ) {
    super();
  }

  async finish(): Promise<void> {
    if (await this.whiteboardChanged()) {
      await this.saveWhiteboard();
      this.changesSaved = true;
    }
    if (
      this.whiteboardInstance != null &&
      this.processApiService.stepInfo != null &&
      this.processApiService.stepInfo.step != null
    ) {
      this.whiteboardResolveService.resolve(
        this.processApiService.stepInfo,
        this.whiteboardInstance._id
      );
    } else if (
      this.runningProcess != null &&
      this.processApiService.artifactVersionId != null
    ) {
      await this.whiteboardResolveService.resolveEditWhiteboardInstanceManually(
        this.runningProcess._id,
        this.processApiService.artifactVersionId
      );
    }
  }

  async saveWhiteboard(): Promise<void> {
    if (
      this.whiteboardInstance != null &&
      ((this.runningMethod != null && this.isCorrectStep()) ||
        (this.runningProcess != null &&
          this.processApiService.artifactVersionId != null))
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

  get isInFullscreenMode(): boolean {
    return document.fullscreenElement != null;
  }
}
