import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { HypoMoMapTreeService } from './hypo-mo-map-tree.service';
import { HypoMoMapMetaArtifactService } from './hypo-mo-map-meta-artifact.service';
import { HypoMoMapMetaArtifactApiService } from './hypo-mo-map-meta-artifact-api.service';

@NgModule({
  providers: [
    HypoMoMapMetaArtifactApiService,
    HypoMoMapMetaArtifactService,
    HypoMoMapTreeService,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (hypoMoMapMetaArtifactService: HypoMoMapMetaArtifactService) =>
        (): void =>
          hypoMoMapMetaArtifactService.init(),
      deps: [HypoMoMapMetaArtifactService],
      multi: true,
    },
  ],
})
export class HypoMoMapMetaArtifactModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(
    @Optional()
    @SkipSelf()
    hypoMoMapMetaArtifactModule?: HypoMoMapMetaArtifactModule
  ) {
    if (hypoMoMapMetaArtifactModule != null) {
      throw new Error(
        'HypoMoMapMetaArtifactModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
