import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-element';
import { IconInit } from '../../../model/icon';

export type TypeInit = MethodElementInit;

export type TypeEntry = MethodElementEntry;

export class Type extends MethodElement {
  static readonly typeName = 'Type';
  static readonly defaultIcon: IconInit = { icon: 'bi-collection' };

  static validTypes(
    types: { list: string; element?: Type | TypeEntry }[],
    needed: { list: string; element?: { _id: string; name: string } }[],
    forbidden: { list: string; element?: { _id: string; name: string } }[]
  ): boolean {
    const hasType = (type: {
      list: string;
      element?: { _id: string; name: string };
    }): boolean => {
      if (type.element) {
        const ids = types
          .map((t) => t.element)
          .filter((t) => t != null)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map((t) => t!._id);
        return ids.includes(type.element._id);
      } else {
        const listNames = types.map((t) => t.list).filter((l) => l);
        return listNames.includes(type.list);
      }
    };
    const hasNeeded = needed.some(hasType);
    const hasForbidden = forbidden.some(hasType);
    return hasNeeded && !hasForbidden;
  }

  constructor(entry: TypeEntry | undefined, init: TypeInit | undefined) {
    if (init != null && init.icon == null) {
      init.icon = Type.defaultIcon;
    }
    super(entry, init, Type.typeName);
  }

  /**
   * Update this type with new values
   *
   * @param type the new values of this type (values will be copied to the current object)
   */
  update(type: Partial<Type>): void {
    Object.assign(this, type);
  }

  toDb(): TypeEntry {
    return {
      ...super.toDb(),
    };
  }
}
