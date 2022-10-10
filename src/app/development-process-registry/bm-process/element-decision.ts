import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import {
  DatabaseConstructor,
  DatabaseModelPart,
  EntryType,
  InitType,
} from '../../database/database-model-part';
import { MultipleSelection } from '../development-method/multiple-selection';
import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-elements/method-element';
import { Equality } from '../../shared/equality';
import { equalsList } from '../../shared/utils';

/**
 * Helper to have a selected element and whether it is optional or not.
 */
export interface SelectedElementOptional<T extends MethodElement> {
  element: T;
  optional: boolean;
}

export interface ElementDecisionInit<T extends MethodElementInit>
  extends DatabaseInit {
  element?: T;
  elements?: T[];
}

export interface ElementDecisionEntry<T extends MethodElementEntry>
  extends DatabaseEntry {
  element?: T;
  elements?: T[];
}

/**
 * Decides on exactly one (multiple) selection
 */
export class ElementDecision<T extends MethodElement>
  implements DatabaseInit, DatabaseModelPart, Equality<ElementDecision<T>>
{
  element?: T;
  elements?: T[];

  constructor(
    entry: ElementDecisionEntry<EntryType<T>> | undefined,
    init: ElementDecisionInit<InitType<T>> | undefined,
    databaseConstructor: DatabaseConstructor<T>,
    readonly selection: Readonly<MultipleSelection<T>>
  ) {
    if (entry != null) {
      if (selection.multiple) {
        this.elements =
          entry.elements?.map(
            (element) => new databaseConstructor(element, undefined)
          ) ?? [];
      } else if (selection.element == null) {
        this.element = entry.element
          ? new databaseConstructor(entry.element, undefined)
          : undefined;
      }
    } else if (init != null) {
      if (selection.multiple) {
        this.elements =
          init.elements?.map(
            (element) => new databaseConstructor(undefined, element)
          ) ?? [];
      } else if (selection.element == null) {
        this.element = init.element
          ? new databaseConstructor(undefined, init.element)
          : undefined;
      }
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  /**
   * Get all selected elements.
   *
   * @return all selected elements. Cases:
   * - 0 elements if no element is selected or multiple is allowed and no elements are selected.
   * - 1 element if one element is selected or multiple is allowed and one element is selected.
   * - n elements if multiple is allowed and n elements are selected.
   */
  getSelectedElements(): T[] {
    if (this.selection.multiple) {
      return this.elements ?? [];
    } else {
      const element = this.selection.element ?? this.element;
      if (element == null) {
        return [];
      } else {
        return [element];
      }
    }
  }

  /**
   * Get all selected elements and whether they are optional or not.
   * The optional value is the same for all elements in the array.
   *
   * @return all selected elements. Cases:
   * - 0 elements if no element is selected or multiple is allowed and no elements are selected.
   * - 1 element if one element is selected or multiple is allowed and one element is selected.
   * - n elements if multiple is allowed and n elements are selected.
   */
  getSelectedElementsOptional(): SelectedElementOptional<T>[] {
    return this.getSelectedElements().map((element) => {
      return {
        element: element,
        optional: this.selection.optional,
      };
    });
  }

  /**
   * Whether the decision fulfills all constraints.
   */
  isComplete(): boolean {
    return (
      this.selection.element != null ||
      (this.selection.multiple && (this.elements?.length ?? 0) > 0) ||
      this.selection.optional ||
      this.element != null
    );
  }

  equals(other: ElementDecision<T> | undefined): boolean {
    if (other == null) {
      return false;
    }
    if (this.elements != null) {
      return (
        other.elements != null && equalsList(this.elements, other.elements)
      );
    } else if (this.element != null) {
      return other.element != null && this.element.equals(other.element);
    } else if (other.element != null || other.elements != null) {
      return false;
    }
    return true;
  }

  toDb(): ElementDecisionEntry<EntryType<T>> {
    return {
      element: this.element?.toDb() as EntryType<T>,
      elements: this.elements?.map((element) => element.toDb() as EntryType<T>),
    };
  }
}
