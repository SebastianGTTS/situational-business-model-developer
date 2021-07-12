import { NgModule, Optional, SkipSelf } from '@angular/core';


@NgModule()
export class DevelopmentProcessRegistryModule {

  // see https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(@Optional() @SkipSelf() developmentProcessRegistryModule: DevelopmentProcessRegistryModule) {
    if (developmentProcessRegistryModule) {
      throw new Error('DevelopmentProcessRegistryModule is already loaded. Import it in the AppModule only.');
    }
  }

}
