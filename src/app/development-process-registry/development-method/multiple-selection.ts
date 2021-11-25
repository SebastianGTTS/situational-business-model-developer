import {
  MethodElement,
  MethodElementEntry,
} from '../method-elements/method-element';
import { Equality } from '../../shared/equality';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry } from '../../database/database-entry';

export interface MultipleSelectionEntry<T extends MethodElementEntry>
  extends DatabaseEntry {
  list: string;
  element: T;
  multiple: boolean;
  multipleElements: boolean;
}

export class MultipleSelection<T extends MethodElement>
  implements Equality<MultipleSelection<T>>, DatabaseModelPart
{
  list: string;
  element: T;
  multiple = false;
  multipleElements = false;

  constructor(
    selection: MultipleSelection<T>,
    createElement: (element: Partial<T>) => T
  ) {
    this.update(selection, createElement);
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
