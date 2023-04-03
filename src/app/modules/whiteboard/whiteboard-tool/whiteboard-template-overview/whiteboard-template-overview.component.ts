import { Component } from '@angular/core';
import { WhiteboardTemplate } from '../../whiteboard-meta-artifact/whiteboard-template';
import { WhiteboardTemplateLoaderService } from '../shared/whiteboard-template-loader.service';

@Component({
  selector: 'app-whiteboard-template-overview',
  templateUrl: './whiteboard-template-overview.component.html',
  styleUrls: ['./whiteboard-template-overview.component.scss'],
})
export class WhiteboardTemplateOverviewComponent {
  constructor(
    private whiteboardTemplateLoaderService: WhiteboardTemplateLoaderService
  ) {}

  get whiteboardTemplate(): WhiteboardTemplate | undefined {
    return this.whiteboardTemplateLoaderService.whiteboardTemplate;
  }
}
