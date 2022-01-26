import {
  MethodElement,
  MethodElementEntry,
} from '../method-elements/method-element';
import { Equality } from '../../shared/equality';
import {
  DatabaseConstructor,
  DatabaseModelPart,
  EntryType,
  InitType,
} from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface MultipleSelectionInit<T extends DatabaseInit>
  extends DatabaseInit {
  list: string;
  element?: T;
  multiple?: boolean;
  multipleElements?: boolean;
}

export interface MultipleSelectionEntry<T extends MethodElementEntry>
  extends DatabaseEntry {
  list: string;
  element?: T;
  multiple: boolean;
  multipleElements: boolean;
}

export class MultipleSelection<T extends MethodElement>
  implements
    MultipleSelectionInit<T>,
    Equality<MultipleSelection<T>>,
    DatabaseModelPart
{
  list: string;
  element?: T;
  multiple = false;
  multipleElements = false;

  constructor(
    entry: MultipleSelectionEntry<EntryType<T>> | undefined,
    init: MultipleSelectionInit<InitType<T>> | undefined,
    databaseConstructor: DatabaseConstructor<T>
  ) {
    const element = entry ?? init;
    this.list = element.list;
    this.multiple = element.multiple ?? this.multiple;
    this.multipleElements = element.multipleElements ?? this.multipleElements;
    if (entry != null) {
      this.element =
        entry.element != null
          ? new databaseConstructor(entry.element, undefined)
          : undefined;
    } else if (init != null) {
      this.element =
        init.element != null
          ? new databaseConstructor(undefined, init.element)
          : undefined;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  update(
    selection: MultipleSelection<T>,
    createElement: (element: Partial<T>) => T
  ): void {
    Object.assign(this, selection);
    this.element = this.element ? createElement(this.element) : null;
  }

  toDb(): MultipleSelectionEntry<ReturnType<T['toDb']>> {
    return {
      list: this.list,
      element: this.element
        ? (this.element.toDb() as ReturnType<T['toDb']>)
        : null,
      multiple: this.multiple,
      multipleElements: this.multipleElements,
    };
  }

  equals(other: MultipleSelection<T>): boolean {
    if (other == null || this.list !== other.list) {
      return false;
    }
    if (this.element == null && other.element == null) {
      return true;
    }
    if (this.element == null || other.element == null) {
      return false;
    }
    return (
      this.element.equals(other.element) &&
      this.multiple === other.multiple &&
      this.multipleElements === other.multipleElements
    );
  }
}
