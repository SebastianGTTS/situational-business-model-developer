import { MethodElement } from '../method-elements/method-element';

export class MultipleSelection<T extends MethodElement> {

  list: string;
  element: T;
  multiple = false;
  multipleElements = false;

  constructor(selection: MultipleSelection<T>, createElement: (element: Partial<T>) => T) {
    this.update(selection, createElement);
  }

  update(selection: MultipleSelection<T>, createElement: (element: Partial<T>) => T) {
    Object.assign(this, selection);
    this.element = this.element ? createElement(this.element) : null;
  }

  toPouchDb(): any {
    return {
      list: this.list,
      element: this.element ? this.element.toPouchDb() : null,
      multiple: this.multiple,
      multipleElements: this.multipleElements,
    };
  }

}
