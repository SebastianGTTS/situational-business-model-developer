import { Component, Input } from '@angular/core';
import { Icon, IconEntry, IconTypes } from '../../model/icon';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() icon?: Icon | IconEntry;

  get iconColor(): string {
    return this.icon?.color ?? 'dark';
  }

  get iconIcon(): string {
    return this.icon?.icon ?? 'bi-asterisk';
  }

  get iconImage(): string | undefined {
    return this.icon?.image;
  }

  get iconType(): typeof IconTypes {
    return IconTypes;
  }
}
