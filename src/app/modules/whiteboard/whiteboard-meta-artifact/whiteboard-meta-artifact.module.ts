import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { WhiteboardMetaArtifactService } from './whiteboard-meta-artifact.service';
import { WhiteboardMetaArtifactApiService } from './whiteboard-meta-artifact-api.service';
import { WhiteboardInstanceService } from './whiteboard-instance.service';
import { WhiteboardCanvasService } from './whiteboard-canvas.service';
import { SelectWhiteboardTemplateComponent } from './select-whiteboard-template/select-whiteboard-template.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { WhiteboardTemplateService } from './whiteboard-template.service';

@NgModule({
  providers: [
    WhiteboardCanvasService,
    WhiteboardInstanceService,
    WhiteboardMetaArtifactService,
    WhiteboardMetaArtifactApiService,
    WhiteboardTemplateService,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (whiteboardMetaArtifactService: WhiteboardMetaArtifactService) =>
        (): void =>
          whiteboardMetaArtifactService.init(),
      deps: [WhiteboardMetaArtifactService],
      multi: true,
    },
  ],
  declarations: [SelectWhiteboardTemplateComponent],
  imports: [BrowserModule, ReactiveFormsModule],
})
export class WhiteboardMetaArtifactModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(
    @Optional()
    @SkipSelf()
    whiteboardMetaArtifactModule?: WhiteboardMetaArtifactModule
  ) {
    if (whiteboardMetaArtifactModule != null) {
      throw new Error(
        'WhiteboardMetaArtifactModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
