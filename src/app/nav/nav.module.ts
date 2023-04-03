import { NgModule, Optional, SkipSelf } from '@angular/core';
import { NavRoutingModule } from './nav-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';
import { LoginComponent } from './login/login.component';
import { NavSideComponent } from './nav-side/nav-side.component';
import { NavSideListComponent } from './nav-side-list/nav-side-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OptionsComponent } from './options/options.component';
import { NavService } from './nav.service';

@NgModule({
  declarations: [
    ChangePasswordFormComponent,
    LoginComponent,
    NavSideComponent,
    NavSideListComponent,
    NavbarComponent,
    OptionsComponent,
  ],
  providers: [NavService],
  imports: [SharedModule, NavRoutingModule],
  exports: [NavSideComponent, NavbarComponent],
})
export class NavModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(@Optional() @SkipSelf() navModule?: NavModule) {
    if (navModule) {
      throw new Error(
        'NavModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
