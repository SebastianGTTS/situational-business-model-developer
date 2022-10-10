import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { ExampleArtifactService } from './example-artifact.service';
import { ExampleArtifactApiService } from './example-artifact-api.service';
import { ExampleService } from './example.service';

@NgModule({
  providers: [
    ExampleArtifactService,
    ExampleArtifactApiService,
    ExampleService,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (exampleArtifactService: ExampleArtifactService) => (): void =>
          exampleArtifactService.init(),
      deps: [ExampleArtifactService],
      multi: true,
    },
  ],
})
export class ExampleArtifactModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(
    @Optional() @SkipSelf() exampleArtifactModule?: ExampleArtifactModule
  ) {
    if (exampleArtifactModule != null) {
      throw new Error(
        'ExampleArtifactModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
