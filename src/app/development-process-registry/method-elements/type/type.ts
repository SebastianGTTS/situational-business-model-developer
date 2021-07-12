import { MethodElement } from '../method-element';

export class Type extends MethodElement {

  static readonly typeName = 'Type';

  static validTypes(
    types: { list: string, element: Type }[],
    needed: { list: string, element: { _id: string, name: string } }[],
    forbidden: { list: string, element: { _id: string, name: string } }[],
  ): boolean {
    const hasType = (type: { list: string, element: { _id: string, name: string } }) => {
      if (type.element) {
        const ids = types.map((t) => t.element).filter((t) => t).map((t) => t._id);
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

  constructor(type: Partial<Type>) {
    super(Type.typeName);
    this.update(type);
  }

  /**
   * Update this type with new values
   *
   * @param type the new values of this type (values will be copied to the current object)
   */
  update(type: Partial<Type>) {
    Object.assign(this, type);
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
    };
  }

}
