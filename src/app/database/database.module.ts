import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { PouchdbService } from './pouchdb.service';
import { HttpClientModule } from '@angular/common/http';
import { CouchdbAuthService } from './couchdb-auth.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { LocalAuthService } from './local-auth.service';
import { LoginGuard } from './login.guard';

@NgModule({
  providers: [
    AuthGuard,
    LoginGuard,
    PouchdbService,
    {
      provide: AuthService,
      useClass: environment.localDatabase
        ? LocalAuthService
        : CouchdbAuthService,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.init(),
      deps: [AuthService],
      multi: true,
    },
  ],
  imports: [HttpClientModule],
})
export class DatabaseModule {
  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(@Optional() @SkipSelf() databaseModule?: DatabaseModule) {
    if (databaseModule) {
      throw new Error(
        'DatabaseModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
