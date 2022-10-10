import { DatabaseModel } from '../../../database/database-model';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../../database/database-entry';

export interface ExampleInit extends DatabaseRootInit {
  name: string;
  description: string;
}

export interface ExampleEntry extends DatabaseRootEntry {
  name: string;
  description: string;
}

export class Example extends DatabaseModel implements ExampleInit {
  static readonly typeName = 'Example';

  name: string;
  description: string;

  constructor(entry: ExampleEntry | undefined, init: ExampleInit | undefined) {
    super(entry, init, Example.typeName);
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.name = element.name;
    this.description = element.description;
  }

  toDb(): ExampleEntry {
    return {
      ...super.toDb(),
      name: this.name,
      description: this.description,
    };
  }
}
