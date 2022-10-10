import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { SimulationArtifactArtifactService } from './simulation-artifact-artifact.service';
import { SimulationArtifactArtifactApiService } from './simulation-artifact-artifact-api.service';

@NgModule({
  providers: [
    SimulationArtifactArtifactService,
    SimulationArtifactArtifactApiService,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (simulationArtifactArtifactService: SimulationArtifactArtifactService) => (): void =>
          simulationArtifactArtifactService.init(),
      deps: [SimulationArtifactArtifactService],
      multi: true,
    },
  ],
})
export class SimulationArtifactArtifactModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(@Optional() @SkipSelf() simulationArtifactArtifactModule?: SimulationArtifactArtifactModule) {
    if (simulationArtifactArtifactModule != null) {
      throw new Error(
        'SimulationArtifactArtifactModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
