import { Injectable } from '@angular/core';
import { MethodElement, MethodElementInit } from './method-element';
import { DefaultElementService } from '../../database/default-element.service';
import { EntryType } from '../../database/database-model-part';
import { IconInit } from 'src/app/model/icon';

@Injectable()
export abstract class MethodElementService<
  T extends MethodElement,
  S extends MethodElementInit
> extends DefaultElementService<T, S> {
  async getList(): Promise<EntryType<T>[]> {
    const list = await super.getList();
    list.sort((a, b) => a.list.localeCompare(b.list));
    return list;
  }

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
   * Get all list names used by at least one item
   */
  async getListNames(): Promise<string[]> {
    const items: EntryType<T>[] = await super.getList();
    const listNames: Set<string> = new Set<string>();
    items.forEach((item) => listNames.add(item.list));
    return Array.from(listNames);
  }

  /**
   * Update a method element
   *
   * @param id the id of the method element to update
   * @param element the new data of the element
   */
  async update(id: string, element: S): Promise<void> {
    try {
      const currentElement = await this.getWrite(id);
      currentElement.update(element);
      await this.save(currentElement);
    } finally {
      this.freeWrite(id);
    }
  }

  async updateIcon(id: string, icon: IconInit): Promise<void> {
    try {
      const methodElement = await this.getWrite(id);
      methodElement.updateIcon(icon);
      await this.save(methodElement);
    } finally {
      this.freeWrite(id);
    }
  }
}
