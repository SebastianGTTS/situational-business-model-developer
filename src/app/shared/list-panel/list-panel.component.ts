import { Component, Input } from '@angular/core';
import { ListService } from '../list.service';
import { DatabaseModel } from '../../database/database-model';
import { DatabaseInit } from '../../database/database-entry';
import { EntryType } from '../../database/database-model-part';
import { ListItem } from '../list-item/list-item.component';

@Component({
  selector: 'app-list-panel',
  templateUrl: './list-panel.component.html',
  styleUrls: ['./list-panel.component.css'],
})
export class ListPanelComponent<
  T extends DatabaseModel,
  S extends DatabaseInit
> {
  @Input() showView = true;
  @Input() showDelete = true;

  @Input() elementName!: string;
  @Input() elementNamePlural!: string;
  @Input() viewLinkFunction!: (item: EntryType<T>) => string[];
  @Input() mapFunction?: (item: unknown) => ListItem;

  constructor(private listService: ListService<T, S>) {}

  get loading(): boolean {
    return this.listService.loading;
  }

  get reloading(): boolean {
    return this.listService.reloading;
  }
}
