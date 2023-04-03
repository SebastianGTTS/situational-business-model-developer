import { DatabaseModel } from '../../database/database-model';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
  DbType,
} from '../../database/database-entry';
import { Icon, IconEntry, IconInit } from '../../model/icon';

export interface MethodElementUpdate {
  list?: string;
  name?: string;
  description?: string;
}

export interface MethodElementInit extends DatabaseRootInit {
  list: string;
  name: string;
  description?: string;
  icon?: IconInit;
}

export interface MethodElementEntry extends DatabaseRootEntry {
  list: string;
  name: string;
  description?: string;
  icon: IconEntry;
}

export abstract class MethodElement
  extends DatabaseModel
  implements MethodElementInit
{
  list: string;
  name: string;
  description = '';
  icon: Icon;

  protected constructor(
    entry: MethodElementEntry | undefined,
    init: MethodElementInit | undefined,
    type: DbType
  ) {
    super(entry, init, type);
    let element;
    if (entry != null) {
      element = entry;
      this.icon = new Icon(entry.icon ?? {}, undefined);
    } else if (init != null) {
      element = init;
      this.icon = new Icon(undefined, init.icon ?? {});
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.list = element.list;
    this.name = element.name;
    this.description = element.description ?? this.description;
  }

  abstract update(element: MethodElementUpdate): void;

  updateIcon(icon: IconInit): void {
    this.icon.update(icon);
  }

  toDb(): MethodElementEntry {
    return {
      ...super.toDb(),
      list: this.list,
      name: this.name,
      description: this.description,
      icon: this.icon.toDb(),
    };
  }
}
