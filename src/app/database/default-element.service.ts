import { Injectable } from '@angular/core';
import { PouchdbService } from './pouchdb.service';
import { Observable } from 'rxjs';
import { ElementService } from './element.service';
import { DatabaseModel } from './database-model';
import { DatabaseRevision, DatabaseRootInit } from './database-entry';
import { DatabaseConstructor, EntryType } from './database-model-part';

@Injectable()
export abstract class DefaultElementService<
  T extends DatabaseModel,
  S extends DatabaseRootInit
> implements ElementService<T, S>
{
  protected abstract get typeName(): string;

  protected abstract get elementConstructor(): DatabaseConstructor<T, S>;

  constructor(protected pouchdbService: PouchdbService) {}

  async add(element: S): Promise<void> {
    await this.pouchdbService.post(
      new this.elementConstructor(undefined, element)
    );
  }

  async getList(): Promise<EntryType<T>[]> {
    return this.pouchdbService.find<EntryType<T>>(this.typeName, {
      selector: {},
    });
  }

  async get(id: string): Promise<T & DatabaseRevision> {
    return new this.elementConstructor(
      await this.pouchdbService.get<EntryType<T>>(id),
      undefined
    ) as T & DatabaseRevision;
  }

  /**
   * Get the changes of a domain
   *
   * @param id the id of the domain
   * @return the changes feed
   */
  getChangesFeed(id: string): Observable<void> {
    return this.pouchdbService.getChangesFeed(id);
  }

  async delete(id: string): Promise<void> {
    await this.pouchdbService.remove(await this.get(id));
  }

  protected async save(element: T): Promise<void> {
    await this.pouchdbService.put(element);
  }
}
