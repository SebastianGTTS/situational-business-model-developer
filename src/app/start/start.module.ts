import { NgModule } from '@angular/core';
import { StartRoutingModule } from './start-routing.module';
import { SharedModule } from '../shared/shared.module';
import { StartComponent } from './start/start.component';
import { StartBusinessDeveloperComponent } from './start-business-developer/start-business-developer.component';
import { StartDomainExpertComponent } from './start-domain-expert/start-domain-expert.component';
import { StartMethodEngineerComponent } from './start-method-engineer/start-method-engineer.component';
import { QuickStartComponent } from './quick-start/quick-start.component';

@NgModule({
  declarations: [
    QuickStartComponent,
    StartBusinessDeveloperComponent,
    StartComponent,
    StartDomainExpertComponent,
    StartMethodEngineerComponent,
  ],
  imports: [SharedModule, StartRoutingModule],
})
export class StartModule {}
