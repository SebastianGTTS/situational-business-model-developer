import { Component } from '@angular/core';
import { WhiteboardInstance } from '../../../whiteboard-meta-artifact/whiteboard-instance';
import { WhiteboardInstanceLoaderService } from '../../shared/whiteboard-instance-loader.service';
import { ProcessApiService } from '../../../../../development-process-registry/module-api/process-api.service';
import { WhiteboardToolResolveService } from '../../whiteboard-tool-resolve.service';
import { ArtifactApiService } from '../../../../../development-process-registry/module-api/artifact-api.service';

@Component({
  selector: 'app-view-whiteboard-instance',
  templateUrl: './view-whiteboard-instance.component.html',
  styleUrls: ['./view-whiteboard-instance.component.css'],
  providers: [
    ArtifactApiService,
    ProcessApiService,
    WhiteboardInstanceLoaderService,
  ],
})
export class ViewWhiteboardInstanceComponent {
  constructor(
    private processApiService: ProcessApiService,
    private whiteboardInstanceLoaderService: WhiteboardInstanceLoaderService,
    private whiteboardResolveService: WhiteboardToolResolveService
  ) {}

  finish(): void {
    if (
      this.whiteboardInstance != null &&
      this.processApiService.stepInfo != null
    ) {
      this.whiteboardResolveService.resolve(
        this.processApiService.stepInfo,
        this.whiteboardInstance._id
      );
    }
  }

  get whiteboardInstance(): WhiteboardInstance | undefined {
    return this.whiteboardInstanceLoaderService.whiteboardInstance;
  }

  isCorrectStep(): boolean {
    return (
      this.processApiService.runningMethod != null &&
      this.processApiService.isCorrectStep()
    );
  }

  get isInFullscreenMode(): boolean {
    return document.fullscreenElement != null;
  }
}
