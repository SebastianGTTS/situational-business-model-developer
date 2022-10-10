import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { HypoMoMapTreeService } from './hypo-mo-map-tree.service';
import { HypoMoMapMetaModelService } from './hypo-mo-map-meta-model.service';
import { HypoMoMapMetaModelApiService } from './hypo-mo-map-meta-model-api.service';

@NgModule({
  providers: [
    HypoMoMapMetaModelApiService,
    HypoMoMapMetaModelService,
    HypoMoMapTreeService,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (hypoMoMapMetaModelService: HypoMoMapMetaModelService) => (): void =>
          hypoMoMapMetaModelService.init(),
      deps: [HypoMoMapMetaModelService],
      multi: true,
    },
  ],
})
export class HypoMoMapMetaModelModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(
    @Optional()
    @SkipSelf()
    hypoMoMapMetaModelModule?: HypoMoMapMetaModelModule
  ) {
    if (hypoMoMapMetaModelModule) {
      throw new Error(
        'HypoMoMapMetaModelModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
