import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { CanvasMetaArtifactService } from './canvas-meta-artifact.service';
import { CanvasMetaArtifactApiService } from './canvas-meta-artifact-api.service';
import { SelectCanvasDefinitionComponent } from './select-canvas-definition/select-canvas-definition.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  providers: [
    CanvasMetaArtifactService,
    CanvasMetaArtifactApiService,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (canvasMetaArtifactService: CanvasMetaArtifactService) => (): void =>
          canvasMetaArtifactService.init(),
      deps: [CanvasMetaArtifactService],
      multi: true,
    },
  ],
  declarations: [SelectCanvasDefinitionComponent],
  imports: [BrowserModule, ReactiveFormsModule],
})
export class CanvasMetaArtifactModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(
    @Optional() @SkipSelf() canvasMetaArtifactModule?: CanvasMetaArtifactModule
  ) {
    if (canvasMetaArtifactModule != null) {
      throw new Error(
        'CanvasMetaArtifactModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
