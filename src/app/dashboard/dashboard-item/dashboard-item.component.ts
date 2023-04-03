import { Component, Input } from '@angular/core';
import { Icon, IconEntry } from '../../model/icon';

@Component({
  selector: 'app-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss'],
})
export class DashboardItemComponent {
  @Input() elementName!: string;
  @Input() elementDescription!: string;
  @Input() elementIcon!: Icon | IconEntry;
  @Input() elementLink!: string[];
  @Input() numberOfElements?: number;
}
