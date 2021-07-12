import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import { MethodElement } from './method-element';
import PouchDB from 'pouchdb-browser';

@Injectable()
export abstract class MethodElementService<T extends MethodElement> {

  constructor(
    protected pouchdbService: PouchdbService,
  ) {
  }

  /**
   * Add a method element
   *
   * @param element the element to add
   */
  add(element: Partial<T>) {
    return this.pouchdbService.post(this.createMethodElement(element));
  }

  /**
   * Get all method elements
   */
  getAll() {
    return this.pouchdbService.find<T>(this.getTypeName(), {selector: {}});
  }

  /**
   * Get all method elements in their lists
   */
  getLists(): Promise<{ listName: string, elements: MethodElement[] }[]> {
    return this.getAll().then((list) => {
        const elementListMap: { [listName: string]: MethodElement[] } = {};
        list.docs.forEach((element) => {
          if (element.list in elementListMap) {
            elementListMap[element.list].push(element);
          } else {
            elementListMap[element.list] = [element];
          }
        });
        const elementLists = [];
        Object.entries(elementListMap).forEach(([listName, elements]) => {
          elementLists.push({listName, elements});
        });
        return elementLists;
      },
    );
  }

  /**
   * Get a single method element
   *
   * @param id the id of the method element
   */
  get(id: string): Promise<T> {
    return this.pouchdbService.get<T>(id).then((e) => this.createMethodElement(e));
  }

  /**
   * Update a method element
   *
   * @param id the id of the method element to update
   * @param updateMethod this method is called to update the element
   */
  update(id: string, updateMethod: (currentElement: T) => T) {
    return this.get(id).then((currentElement) => this.save(updateMethod(currentElement)));
  }

  /**
   * Delete a method element
   *
   * @param id the id of the method element to delete
   */
  delete(id: string) {
    return this.pouchdbService.get(id).then(result => {
      return this.pouchdbService.remove(result);
    });
  }

  /**
   * Create a new method element
   *
   * @param element the element values that will be copied to the new object
   */
  protected abstract createMethodElement(element: Partial<T>): T;

  /**
   * Get the type name
   */
  protected abstract getTypeName(): string;

  private save(element: T): Promise<PouchDB.Core.Response> {
    return this.pouchdbService.put(element);
  }

}
