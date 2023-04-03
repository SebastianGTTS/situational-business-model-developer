import { Component } from '@angular/core';
import { WhiteboardTemplateLoaderService } from '../shared/whiteboard-template-loader.service';
import { WhiteboardTemplate } from '../../whiteboard-meta-artifact/whiteboard-template';

@Component({
  selector: 'app-whiteboard-template',
  templateUrl: './whiteboard-template.component.html',
  styleUrls: ['./whiteboard-template.component.css'],
  providers: [WhiteboardTemplateLoaderService],
})
export class WhiteboardTemplateComponent {
  constructor(
    private whiteboardTemplateLoaderService: WhiteboardTemplateLoaderService
  ) {}

  get whiteboardTemplate(): WhiteboardTemplate | undefined {
    return this.whiteboardTemplateLoaderService.whiteboardTemplate;
  }
}
