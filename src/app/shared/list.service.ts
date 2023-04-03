import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { DatabaseModel } from '../database/database-model';
import { ElementService } from '../database/element.service';
import { DatabaseRootInit } from '../database/database-entry';
import { EntryType } from '../database/database-model-part';
import { Observable, ReplaySubject, Subject } from 'rxjs';

export const ELEMENT_SERVICE = new InjectionToken<
  ElementService<DatabaseModel, DatabaseRootInit>
>('Element service');

@Injectable()
export class ListService<T extends DatabaseModel, S extends DatabaseRootInit>
  implements OnDestroy
{
  private readonly _loaded: Subject<void> = new ReplaySubject<void>(1);
  private readonly _loadedObservable: Observable<void> =
    this._loaded.asObservable();

  get loaded(): Observable<void> {
    return this._loadedObservable;
  }

  private _elements?: EntryType<T>[];
  get elements(): EntryType<T>[] | undefined {
    return this._elements;
  }

  get loading(): boolean {
    return this.elements == null;
  }

  private _reloading = false;
  get reloading(): boolean {
    return this._reloading;
  }

  get noResults(): boolean {
    return this.elements != null && this.elements.length === 0;
  }

  constructor(
    @Inject(ELEMENT_SERVICE) private elementService: ElementService<T, S>
  ) {
    void this.load();
  }

  ngOnDestroy(): void {
    this._loaded.complete();
  }

  async add(element: S): Promise<T> {
    this._reloading = true;
    const addedElement = await this.elementService.add(element);
    // noinspection ES6MissingAwait
    void this.load();
    return addedElement;
  }

  async delete(elementId: string): Promise<void> {
    if (this._elements == null) {
      return;
    }
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
    this._loaded.next();
  }
}
