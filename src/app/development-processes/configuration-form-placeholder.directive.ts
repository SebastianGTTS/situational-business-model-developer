import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appConfigurationFormPlaceholder]',
})
export class ConfigurationFormPlaceholderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
