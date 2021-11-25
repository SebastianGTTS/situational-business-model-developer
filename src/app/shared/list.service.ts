import { Inject, Injectable, InjectionToken } from '@angular/core';
import { DatabaseModel } from '../database/database-model';
import { ElementService } from '../database/element.service';

export const ELEMENT_SERVICE = new InjectionToken<ElementService<any>>(
  'Element service'
);

@Injectable()
export class ListService<T extends DatabaseModel> {
  private _elements: T[];
  get elements(): T[] {
    return this._elements;
  }

  get loading(): boolean {
    return this.elements == null;
  }

  private _reloading: boolean;
  get reloading(): boolean {
    return this._reloading;
  }

  get noResults() {
    return this.elements != null && this.elements.length === 0;
  }

  constructor(
    @Inject(ELEMENT_SERVICE) private elementService: ElementService<T>
  ) {
    void this.load();
  }

  async add(element: Partial<T>) {
    this._reloading = true;
    await this.elementService.add(element);
    await this.load();
  }

  async delete(elementId: string) {
    this._reloading = true;
    const elements = this._elements;
    await this.elementService.delete(elementId);
    // check that no reload happened before updating the local version
    if (elements === this._elements) {
      this._elements = this._elements.filter(
        (element) => element._id !== elementId
      );
    }
    await this.load();
  }

  /**
   * Loads the elements list.
   * Calling this method should be necessary only in some edge cases.
   */
  async load(): Promise<void> {
    this._reloading = true;
    this._elements = await this.elementService.getList();
    this._reloading = false;
  }
}
