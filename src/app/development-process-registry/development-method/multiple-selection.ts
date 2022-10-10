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
  optional?: boolean;
}

export interface MultipleSelectionEntry<T extends MethodElementEntry>
  extends DatabaseEntry {
  list: string;
  element?: T;
  multiple: boolean;
  optional: boolean;
}

/**
 * Represents a selection of a method element, which is later used for the
 * method (Stakeholder, Tool, Artifact).
 */
export class MultipleSelection<T extends MethodElement>
  implements
    MultipleSelectionInit<T>,
    Equality<MultipleSelection<T>>,
    DatabaseModelPart
{
  list: string;
  element?: T;
  /**
   * If multiple is true, element must be undefined. Later multiple elements
   * can be selected.
   */
  multiple = false;
  /**
   * Specifies whether the element later must be selected or can be undefined.
   * If true element can be undefined or defined. Whether it is used is decided in the enaction.
   * If multiple is true, it decides whether the method engineer must select at least one element or not.
   */
  optional = false;

  constructor(
    entry: MultipleSelectionEntry<EntryType<T>> | undefined,
    init: MultipleSelectionInit<InitType<T>> | undefined,
    databaseConstructor: DatabaseConstructor<T>
  ) {
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.list = element.list;
    this.multiple = element.multiple ?? this.multiple;
    this.optional = element.optional ?? this.optional;
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
    }
  }

  /**
   * @deprecated
   *
   * @param selection
   * @param createElement
   */
  update(
    selection: MultipleSelection<T>,
    createElement: (element: Partial<T>) => T
  ): void {
    Object.assign(this, selection);
    this.element = this.element ? createElement(this.element) : undefined;
  }

  toDb(): MultipleSelectionEntry<ReturnType<T['toDb']>> {
    return {
      list: this.list,
      element: this.element
        ? (this.element.toDb() as ReturnType<T['toDb']>)
        : undefined,
      multiple: this.multiple,
      optional: this.optional,
    };
  }

  equals(other: MultipleSelection<T> | undefined): boolean {
    if (
      other == null ||
      this.list !== other.list ||
      this.multiple !== other.multiple ||
      this.optional !== other.optional
    ) {
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
