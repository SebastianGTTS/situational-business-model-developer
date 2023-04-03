import { Component, ViewChild } from '@angular/core';
import { WhiteboardTemplateLoaderService } from '../shared/whiteboard-template-loader.service';
import { WhiteboardTemplate } from '../../whiteboard-meta-artifact/whiteboard-template';
import { WhiteboardTemplateService } from '../../whiteboard-meta-artifact/whiteboard-template.service';
import { WhiteboardCanvasComponent } from '../whiteboard-canvas/whiteboard-canvas.component';
import { WhiteboardCanvasControls } from '../whiteboard-canvas/whiteboard-canvas-controls';
import { WhiteboardEditComponent } from '../shared/whiteboard-edit-component';

@Component({
  selector: 'app-whiteboard-template-edit',
  templateUrl: './whiteboard-template-edit.component.html',
  styleUrls: ['./whiteboard-template-edit.component.scss'],
})
export class WhiteboardTemplateEditComponent
  implements WhiteboardEditComponent
{
  @ViewChild(WhiteboardCanvasComponent)
  whiteboardCanvasControls!: WhiteboardCanvasControls;

  deactivate = false;

  constructor(
    private whiteboardTemplateLoaderService: WhiteboardTemplateLoaderService,
    private whiteboardTemplateService: WhiteboardTemplateService
  ) {}

  async saveWhiteboard(): Promise<void> {
    if (this.whiteboardTemplate != null) {
      const whiteboard = this.whiteboardCanvasControls.save();
      await this.whiteboardTemplateService.saveWhiteboardCanvas(
        this.whiteboardTemplate._id,
        whiteboard
      );
    }
  }

  async whiteboardChanged(): Promise<boolean> {
    if (this.whiteboardTemplate != null) {
      return (
        this.whiteboardCanvasControls.save() !==
        this.whiteboardTemplate.whiteboard
      );
    }
    return false;
  }

  get isInFullscreenMode(): boolean {
    return document.fullscreenElement != null;
  }

  get whiteboardTemplate(): WhiteboardTemplate | undefined {
    return this.whiteboardTemplateLoaderService.whiteboardTemplate;
  }
}
