import { Injectable } from '@angular/core';
import { MethodElement } from './method-element';
import { DefaultElementService } from '../../database/default-element.service';

@Injectable()
export abstract class MethodElementService<
  T extends MethodElement
> extends DefaultElementService<T> {
  /**
   * Get all method elements in their lists
   */
  getLists(): Promise<{ listName: string; elements: T[] }[]> {
    return this.getList().then((list) => {
      const elementListMap: { [listName: string]: MethodElement[] } = {};
      list.forEach((element) => {
        if (element.list in elementListMap) {
          elementListMap[element.list].push(element);
        } else {
          elementListMap[element.list] = [element];
        }
      });
      const elementLists = [];
      Object.entries(elementListMap).forEach(([listName, elements]) => {
        elementLists.push({ listName, elements });
      });
      return elementLists;
    });
  }

  /**
   * Update a method element
   *
   * @param id the id of the method element to update
   * @param element the new data of the element
   */
  async update(id: string, element: Partial<T>) {
    const currentElement = await this.get(id);
    currentElement.update(element);
    return this.save(currentElement);
  }
}
