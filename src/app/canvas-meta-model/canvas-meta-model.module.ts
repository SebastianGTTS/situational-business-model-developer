import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { CanvasMetaModelService } from './canvas-meta-model.service';
import { CanvasMetaModelApiService } from './canvas-meta-model-api.service';

@NgModule({
  providers: [
    CanvasMetaModelService,
    CanvasMetaModelApiService,
    {
      provide: APP_INITIALIZER,
      useFactory: (canvasMetaModelService: CanvasMetaModelService) => () =>
        canvasMetaModelService.init(),
      deps: [CanvasMetaModelService],
      multi: true,
    },
  ],
})
export class CanvasMetaModelModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(@Optional() @SkipSelf() databaseModule?: CanvasMetaModelModule) {
    if (databaseModule) {
      throw new Error(
        'CanvasMetaModelModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
