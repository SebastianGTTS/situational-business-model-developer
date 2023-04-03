import { NgModule, Optional, SkipSelf } from '@angular/core';

import { TutorialRoutingModule } from './tutorial-routing.module';
import { TutorialPopoverComponent } from './tutorial-popover/tutorial-popover.component';
import { SharedModule } from '../shared/shared.module';
import { TutorialPopoverWrapperComponent } from './tutorial-popover-wrapper/tutorial-popover-wrapper.component';
import { TutorialButtonComponent } from './tutorial-button/tutorial-button.component';
import { TutorialManagerService } from './tutorial-manager.service';
import { TutorialStatsService } from './tutorial-stats.service';
import { TutorialOverviewComponent } from './tutorial-overview/tutorial-overview.component';
import { TutorialNotFoundModalComponent } from './tutorial-not-found-modal/tutorial-not-found-modal.component';

@NgModule({
  declarations: [
    TutorialButtonComponent,
    TutorialNotFoundModalComponent,
    TutorialOverviewComponent,
    TutorialPopoverComponent,
    TutorialPopoverWrapperComponent,
  ],
  imports: [TutorialRoutingModule, SharedModule],
  exports: [
    TutorialPopoverComponent,
    TutorialPopoverWrapperComponent,
    TutorialButtonComponent,
  ],
  providers: [TutorialManagerService, TutorialStatsService],
})
export class TutorialModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(@Optional() @SkipSelf() tutorialModule?: TutorialModule) {
    if (tutorialModule) {
      throw new Error(
        'TutorialModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
