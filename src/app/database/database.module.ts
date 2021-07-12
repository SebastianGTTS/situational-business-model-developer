import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { PouchdbService } from './pouchdb.service';


@NgModule({
  providers: [
    PouchdbService,
    {
      provide: APP_INITIALIZER,
      useFactory: (pouchdbService: PouchdbService) => () => pouchdbService.init(),
      deps: [PouchdbService],
      multi: true
    },
  ]
})
export class DatabaseModule {

  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(@Optional() @SkipSelf() databaseModule?: DatabaseModule) {
    if (databaseModule) {
      throw new Error('DatabaseModule is already loaded. Import it in the AppModule only.');
    }
  }

}
