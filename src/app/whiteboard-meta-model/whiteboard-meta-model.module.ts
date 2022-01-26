import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { WhiteboardMetaModelService } from './whiteboard-meta-model.service';
import { WhiteboardMetaModelApiService } from './whiteboard-meta-model-api.service';
import { WhiteboardInstanceService } from './whiteboard-instance.service';
import { WhiteboardCanvasService } from './whiteboard-canvas.service';

@NgModule({
  providers: [
    WhiteboardCanvasService,
    WhiteboardInstanceService,
    WhiteboardMetaModelService,
    WhiteboardMetaModelApiService,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (whiteboardMetaModelModule: WhiteboardMetaModelService) => (): void =>
          whiteboardMetaModelModule.init(),
      deps: [WhiteboardMetaModelService],
      multi: true,
    },
  ],
})
export class WhiteboardMetaModelModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(
    @Optional()
    @SkipSelf()
    whiteboardMetaModelModule?: WhiteboardMetaModelModule
  ) {
    if (whiteboardMetaModelModule) {
      throw new Error(
        'WhiteboardMetaModelModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
