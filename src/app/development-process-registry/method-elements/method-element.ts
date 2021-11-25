import { DatabaseModel } from '../../database/database-model';
import { DatabaseRootEntry } from '../../database/database-entry';

export interface MethodElementEntry extends DatabaseRootEntry {
  list: string;
  name: string;
  description: string;
}

export abstract class MethodElement extends DatabaseModel {
  list: string;
  name: string;
  description: string;

  abstract update(element: Partial<this>);

  toDb(): MethodElementEntry {
    return {
      ...super.toDb(),
      list: this.list,
      name: this.name,
      description: this.description,
    };
  }
}
