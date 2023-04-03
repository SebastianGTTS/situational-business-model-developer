import { Component, Input } from '@angular/core';
import { MethodElement } from '../../../development-process-registry/method-elements/method-element';
import { Groups } from '../../../development-process-registry/development-method/groups';

@Component({
  selector: 'app-development-method-overview-group',
  templateUrl: './development-method-overview-group.component.html',
  styleUrls: ['./development-method-overview-group.component.css'],
})
export class DevelopmentMethodOverviewGroupComponent<T extends MethodElement> {
  @Input() editId?: string;
  @Input() panelTitle!: string;
  @Input() groups!: Groups<T>;
  @Input() editLink?: string[];
  @Input() fragment?: string;
  @Input() hasErrors = false;
}
