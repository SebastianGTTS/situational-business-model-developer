import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Icon, IconEntry } from '../../model/icon';

export interface ListItem {
  name: string;
  description?: string;
  icon?: Icon | IconEntry;
}

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent implements OnChanges {
  @Input() item!: ListItem | unknown;
  @Input() mapFunction?: (item: unknown) => ListItem;
  @Input() viewLink!: string[];
  @Input() showView = true;
  @Input() showDelete = true;

  @Output() delete = new EventEmitter<void>();

  private internalItem!: ListItem;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.internalItem =
        this.mapFunction?.(changes.item.currentValue) ??
        changes.item.currentValue;
    }
  }

  get name(): string {
    return this.internalItem.name;
  }

  get description(): string | undefined {
    return this.internalItem.description;
  }

  get iconColor(): string {
    return this.internalItem.icon?.color ?? 'dark';
  }

  get icon(): Icon | IconEntry | undefined {
    return this.internalItem.icon;
  }
}
