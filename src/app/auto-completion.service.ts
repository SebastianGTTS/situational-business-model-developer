import { Injectable } from '@angular/core';
import { PouchdbService } from './database/pouchdb.service';
import { PouchdbModel } from './database/pouchdb-model';
import PouchDB from 'pouchdb-browser';

export class AutoCompletionList extends PouchdbModel {

  static readonly type = 'AutoCompletion';

  key: string;
  values: string[];

  constructor(autoCompletionList: Partial<AutoCompletionList>) {
    super(AutoCompletionList.type);
    Object.assign(this, autoCompletionList);
  }

  /**
   * Add values to this autocompletion list
   *
   * @returns new number of values
   */
  addValues(values: string[]): number {
    const res = this.values.push(...values.filter((value) => !this.values.includes(value)));
    this.values = this.values.sort();
    return res;
  }

  removeValues(values: string[]): number {
    this.values = this.values.filter((value) => !values.includes(value));
    return this.values.length;
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
      key: this.key,
      values: this.values,
    };
  }

}

@Injectable({
  providedIn: 'root'
})
export class AutoCompletionService {

  constructor(
    private pouchdbService: PouchdbService,
  ) {
  }

  /**
   * Add autocompletion values to the list with the key
   *
   * @param key the key of the list
   * @param values the values to add to the list
   */
  add(key: string, values: string[]) {
    return this.get(key).then((list) => {
      if (list === null) {
        return this.saveAutocompletionList(new AutoCompletionList({key, values}));
      } else {
        const numberOfValues = list.values.length;
        const newNumberOfValues = list.addValues(values);
        if (numberOfValues !== newNumberOfValues) {
          return this.saveAutocompletionList(list);
        }
      }
    });
  }

  /**
   * Remove autocompletion values from the list with the key
   *
   * @param key the key of the list
   * @param values the values to remove from the list
   */
  remove(key: string, values: string[]) {
    return this.get(key).then((list) => {
      if (list !== null) {
        const numberOfValues = list.values.length;
        const newNumberOfValues = list.removeValues(values);
        if (numberOfValues !== newNumberOfValues) {
          return this.saveAutocompletionList(list);
        }
      }
    });
  }

  /**
   * Get all autocompletion lists
   */
  getLists(): Promise<AutoCompletionList[]> {
    return this.pouchdbService.find<AutoCompletionList>(AutoCompletionList.type, {
      selector: {},
    }).then((res) => res.docs);
  }

  /**
   * Get all autocompletion values of a list
   *
   * @param key the key of the list
   * @returns an array with the autocompletion values
   */
  getValues(key: string): Promise<string[]> {
    return this.get(key).then((list) => list.values);
  }

  /**
   * Get all values for autocompletion from the list with the key
   *
   * @param key the key of the values
   * @returns the autocompletion list
   */
  private get(key: string): Promise<AutoCompletionList> {
    return this.pouchdbService.find<AutoCompletionList>(AutoCompletionList.type, {
      selector: {key},
    }).then((res) => {
      if (res.docs.length === 1) {
        return new AutoCompletionList(res.docs[0]);
      } else if (res.docs.length === 0) {
        return null;
      } else {
        console.log('Error in AutoCompletionService.get multiple lists returned. Using first one.');
        return new AutoCompletionList(res.docs[0]);
      }
    });
  }

  private saveAutocompletionList(autoCompletionList: AutoCompletionList): Promise<PouchDB.Core.Response> {
    return this.pouchdbService.put(autoCompletionList);
  }
}
