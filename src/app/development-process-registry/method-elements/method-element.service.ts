import { Injectable } from '@angular/core';
import { MethodElement, MethodElementInit } from './method-element';
import { DefaultElementService } from '../../database/default-element.service';
import { EntryType } from '../../database/database-model-part';

@Injectable()
export abstract class MethodElementService<
  T extends MethodElement,
  S extends MethodElementInit
> extends DefaultElementService<T, S> {
  /**
   * Get all method elements in their lists
   */
  async getLists(): Promise<{ listName: string; elements: EntryType<T>[] }[]> {
    const list = await this.getList();
    const elementListMap: { [listName: string]: EntryType<T>[] } = {};
    list.forEach((element) => {
      if (element.list in elementListMap) {
        elementListMap[element.list].push(element);
      } else {
        elementListMap[element.list] = [element];
      }
    });
    const elementLists: { listName: string; elements: EntryType<T>[] }[] = [];
    Object.entries(elementListMap).forEach(([listName, elements]) => {
      elementLists.push({ listName, elements });
    });
    return elementLists;
  }

  /**
   * Update a method element
   *
   * @param id the id of the method element to update
   * @param element the new data of the element
   */
  async update(id: string, element: S): Promise<void> {
    const currentElement = await this.get(id);
    currentElement.update(element);
    return this.save(currentElement);
  }
}
