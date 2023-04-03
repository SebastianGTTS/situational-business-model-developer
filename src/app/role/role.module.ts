import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RoleRoutingModule } from './role-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RoleSwitchComponent } from './role-switch/role-switch.component';

@NgModule({
  declarations: [RoleSwitchComponent],
  imports: [SharedModule, RoleRoutingModule],
})
export class RoleModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(@Optional() @SkipSelf() roleModule?: RoleModule) {
    if (roleModule) {
      throw new Error(
        'RoleModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
