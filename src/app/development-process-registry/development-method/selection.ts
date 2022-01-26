import { Equality } from '../../shared/equality';
import {
  DatabaseConstructor,
  DatabaseModelPart,
  EntryType,
  InitType,
} from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface SelectionInit<T extends DatabaseInit> extends DatabaseInit {
  list: string;
  element?: T;
}

export interface SelectionEntry<T extends DatabaseEntry> extends DatabaseEntry {
  list: string;
  element?: T;
}

/**
 * Represents a selection of a situational factor or type.
 */
export class Selection<T extends DatabaseModelPart & Equality<T>>
  implements SelectionInit<T>, Equality<Selection<T>>, DatabaseModelPart
{
  list: string;
  element?: T;

  constructor(
    entry: SelectionEntry<EntryType<T>> | undefined,
    init: SelectionInit<InitType<T>> | undefined,
    databaseConstructor: DatabaseConstructor<T>
  ) {
    if (entry != null) {
      this.list = entry.list;
      this.element =
        entry.element != null
          ? new databaseConstructor(entry.element, undefined)
          : undefined;
    } else if (init != null) {
      this.list = init.list;
      this.element =
        init.element != null
          ? new databaseConstructor(undefined, init.element)
          : undefined;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  update(
    selection: Selection<T>,
    createElement: (element: Partial<T>) => T
  ): void {
    Object.assign(this, selection);
    this.element = this.element ? createElement(this.element) : null;
  }

  toDb(): SelectionEntry<EntryType<T>> {
    return {
      list: this.list,
      element: this.element ? (this.element.toDb() as EntryType<T>) : null,
    };
  }

  equals(other: Selection<T>): boolean {
    if (other == null || this.list !== other.list) {
      return false;
    }
    if (this.element == null && other.element == null) {
      return true;
    }
    if (this.element == null || other.element == null) {
      return false;
    }
    return this.element.equals(other.element);
  }
}
