import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-elements/method-element';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import {
  MultipleSelection,
  MultipleSelectionEntry,
  MultipleSelectionInit,
} from './multiple-selection';
import {
  DatabaseConstructor,
  DatabaseModelPart,
  EntryType,
  InitType,
} from '../../database/database-model-part';
import { Equality } from '../../shared/equality';
import { equalsList } from '../../shared/utils';

export interface GroupInit<T extends MethodElementInit> extends DatabaseInit {
  items?: MultipleSelectionInit<T>[];
}

export interface GroupEntry<T extends MethodElementEntry>
  extends DatabaseEntry {
  items: MultipleSelectionEntry<T>[];
}

/**
 * Represents a selection group that can be selected in the building process
 * of the bm process (composed method).
 */
export class Group<T extends MethodElement>
  implements GroupInit<T>, DatabaseModelPart, Equality<Group<T>>
{
  items: MultipleSelection<T>[] = [];

  constructor(
    entry: GroupEntry<EntryType<T>> | undefined,
    init: GroupInit<InitType<T>> | undefined,
    databaseConstructor: DatabaseConstructor<T>
  ) {
    if (entry != null) {
      this.items = entry.items.map((item) =>
        this.createMultipleSelection(item, undefined, databaseConstructor)
      );
    } else if (init != null) {
      this.items =
        init.items?.map((item) =>
          this.createMultipleSelection(undefined, item, databaseConstructor)
        ) ?? this.items;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): GroupEntry<EntryType<T>> {
    return {
      items: this.items.map((item) => item.toDb()),
    };
  }

  protected createMultipleSelection(
    entry: MultipleSelectionEntry<EntryType<T>> | undefined,
    init: MultipleSelectionInit<InitType<T>> | undefined,
    databaseConstructor: DatabaseConstructor<T>
  ): MultipleSelection<T> {
    return new MultipleSelection<T>(entry, init, databaseConstructor);
  }

  equals(other: Group<T> | undefined): boolean {
    if (other == null) {
      return false;
    }
    if (other.items.length !== this.items.length) {
      return false;
    }
    return equalsList(this.items, other.items);
  }
}
