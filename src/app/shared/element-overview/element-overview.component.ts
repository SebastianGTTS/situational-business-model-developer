import { Component, Input } from '@angular/core';
import { Icon } from '../../model/icon';

@Component({
  selector: 'app-element-overview',
  templateUrl: './element-overview.component.html',
  styleUrls: ['./element-overview.component.css'],
})
export class ElementOverviewComponent {
  @Input() item!: { name: string; description: string; icon: Icon };
  @Input() editLink?: string[];
  @Input() fragment?: string;
}
