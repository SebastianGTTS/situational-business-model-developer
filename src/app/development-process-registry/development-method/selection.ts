import { Equality } from '../../shared/equality';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry } from '../../database/database-entry';

export interface SelectionEntry<T extends DatabaseEntry> extends DatabaseEntry {
  list: string;
  element: T;
}

export class Selection<T extends DatabaseModelPart & Equality<T>>
  implements Equality<Selection<T>>, DatabaseModelPart
{
  list: string;
  element: T;

  constructor(
    selection: Selection<T>,
    createElement: (element: Partial<T>) => T
  ) {
    this.update(selection, createElement);
  }

  update(
    selection: Selection<T>,
    createElement: (element: Partial<T>) => T
  ): void {
    Object.assign(this, selection);
    this.element = this.element ? createElement(this.element) : null;
  }

  toDb(): SelectionEntry<ReturnType<T['toDb']>> {
    return {
      list: this.list,
      element: this.element
        ? (this.element.toDb() as ReturnType<T['toDb']>)
        : null,
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
