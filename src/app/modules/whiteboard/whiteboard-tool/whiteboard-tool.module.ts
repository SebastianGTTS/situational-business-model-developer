import { APP_INITIALIZER, NgModule } from '@angular/core';

import { WhiteboardToolRoutingModule } from './whiteboard-tool-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { WhiteboardCanvasComponent } from './whiteboard-canvas/whiteboard-canvas.component';
import { WhiteboardTemplatesComponent } from './whiteboard-templates/whiteboard-templates.component';
import { WhiteboardTemplateComponent } from './whiteboard-template/whiteboard-template.component';
import { CreateWhiteboardInstanceComponent } from './api/create-whiteboard-instance/create-whiteboard-instance.component';
import { SelectWhiteboardTemplateConfigurationComponent } from './api/select-whiteboard-template-configuration/select-whiteboard-template-configuration.component';
import { WhiteboardToolService } from './whiteboard-tool.service';
import { EditWhiteboardInstanceComponent } from './api/edit-whiteboard-instance/edit-whiteboard-instance.component';
import { WhiteboardCanvasViewComponent } from './whiteboard-canvas-view/whiteboard-canvas-view.component';
import { ViewWhiteboardInstanceComponent } from './api/view-whiteboard-instance/view-whiteboard-instance.component';
import { ConfirmLeaveWhiteboardModalComponent } from './confirm-leave-whiteboard-modal/confirm-leave-whiteboard-modal.component';
import { CreateWhiteboardInstanceManuallyComponent } from './api/create-whiteboard-instance-manually/create-whiteboard-instance-manually.component';
import { ImageSelectorModalComponent } from './image-selector-modal/image-selector-modal.component';
import { WhiteboardTemplateOverviewComponent } from './whiteboard-template-overview/whiteboard-template-overview.component';
import { WhiteboardTemplateGeneralComponent } from './whiteboard-template-general/whiteboard-template-general.component';
import { WhiteboardTemplateEditComponent } from './whiteboard-template-edit/whiteboard-template-edit.component';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (whiteboardService: WhiteboardToolService) => (): void =>
        whiteboardService.init(),
      deps: [WhiteboardToolService],
      multi: true,
    },
  ],
  declarations: [
    WhiteboardCanvasComponent,
    WhiteboardTemplatesComponent,
    WhiteboardTemplateComponent,
    CreateWhiteboardInstanceComponent,
    SelectWhiteboardTemplateConfigurationComponent,
    EditWhiteboardInstanceComponent,
    WhiteboardCanvasViewComponent,
    ViewWhiteboardInstanceComponent,
    ConfirmLeaveWhiteboardModalComponent,
    CreateWhiteboardInstanceManuallyComponent,
    ImageSelectorModalComponent,
    WhiteboardTemplateOverviewComponent,
    WhiteboardTemplateGeneralComponent,
    WhiteboardTemplateEditComponent,
  ],
  imports: [SharedModule, WhiteboardToolRoutingModule],
})
export class WhiteboardToolModule {}
