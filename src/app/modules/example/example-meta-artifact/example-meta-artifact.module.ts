import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { ExampleMetaArtifactService } from './example-meta-artifact.service';
import { ExampleMetaArtifactApiService } from './example-meta-artifact-api.service';
import { ExampleService } from './example.service';

@NgModule({
  providers: [
    ExampleMetaArtifactService,
    ExampleMetaArtifactApiService,
    ExampleService,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (exampleMetaArtifactService: ExampleMetaArtifactService) => (): void =>
          exampleMetaArtifactService.init(),
      deps: [ExampleMetaArtifactService],
      multi: true,
    },
  ],
})
export class ExampleMetaArtifactModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(
    @Optional()
    @SkipSelf()
    exampleMetaArtifactModule?: ExampleMetaArtifactModule
  ) {
    if (exampleMetaArtifactModule != null) {
      throw new Error(
        'ExampleArtifactModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
