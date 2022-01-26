import { DatabaseModel } from '../../database/database-model';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
  DbType,
} from '../../database/database-entry';

export interface MethodElementInit extends DatabaseRootInit {
  list: string;
  name: string;
  description?: string;
}

export interface MethodElementEntry extends DatabaseRootEntry {
  list: string;
  name: string;
  description?: string;
}

export abstract class MethodElement
  extends DatabaseModel
  implements MethodElementInit
{
  list: string;
  name: string;
  description?: string;

  protected constructor(
    entry: MethodElementEntry | undefined,
    init: MethodElementInit | undefined,
    type: DbType
  ) {
    super(entry, init, type);
    const element = entry ?? init;
    this.list = element.list;
    this.name = element.name;
    this.description = element.description;
  }

  abstract update(element: MethodElementInit);

  toDb(): MethodElementEntry {
    return {
      ...super.toDb(),
      list: this.list,
      name: this.name,
      description: this.description,
    };
  }
}
