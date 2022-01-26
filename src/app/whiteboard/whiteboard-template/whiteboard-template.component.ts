import { Component, ViewChild } from '@angular/core';
import { WhiteboardTemplateLoaderService } from '../shared/whiteboard-template-loader.service';
import { WhiteboardTemplate } from '../../whiteboard-meta-model/whiteboard-template';
import { WhiteboardCanvasComponent } from '../whiteboard-canvas/whiteboard-canvas.component';
import { WhiteboardCanvasControls } from '../whiteboard-canvas/whiteboard-canvas-controls';
import { WhiteboardTemplateService } from '../../whiteboard-meta-model/whiteboard-template.service';
import { WhiteboardEditComponent } from '../shared/whiteboard-edit-component';

@Component({
  selector: 'app-whiteboard-template',
  templateUrl: './whiteboard-template.component.html',
  styleUrls: ['./whiteboard-template.component.css'],
  providers: [WhiteboardTemplateLoaderService],
})
export class WhiteboardTemplateComponent implements WhiteboardEditComponent {
  @ViewChild(WhiteboardCanvasComponent)
  whiteboardCanvasControls!: WhiteboardCanvasControls;

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

  get whiteboardTemplate(): WhiteboardTemplate | undefined {
    return this.whiteboardTemplateLoaderService.whiteboardTemplate;
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
}
