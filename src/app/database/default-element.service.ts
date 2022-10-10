import { Injectable } from '@angular/core';
import { PouchdbService } from './pouchdb.service';
import { Observable } from 'rxjs';
import { ElementService } from './element.service';
import { DatabaseModel } from './database-model';
import { DatabaseRevision, DatabaseRootInit, DbId } from './database-entry';
import { DatabaseConstructor, EntryType } from './database-model-part';

@Injectable()
export abstract class DefaultElementService<
  T extends DatabaseModel,
  S extends DatabaseRootInit
> implements ElementService<T, S>
{
  private lockedIds: { [id: DbId]: ((element: T) => void)[] } = {};

  protected abstract get typeName(): string;

  protected abstract get elementConstructor(): DatabaseConstructor<T, S>;

  constructor(protected pouchdbService: PouchdbService) {}

  async add(element: S): Promise<T> {
    const add = new this.elementConstructor(undefined, element);
    await this.pouchdbService.post(add);
    return add;
  }

  async getList(): Promise<EntryType<T>[]> {
    return this.pouchdbService.find<EntryType<T>>(this.typeName, {
      selector: {},
    });
  }

  async get(id: DbId): Promise<T & DatabaseRevision> {
    return new this.elementConstructor(
      await this.pouchdbService.get<EntryType<T>>(id),
      undefined
    ) as T & DatabaseRevision;
  }

  getWrite(id: DbId): Promise<T> {
    if (id in this.lockedIds) {
      return new Promise((resolve) => this.lockedIds[id].push(resolve));
    } else {
      this.lockedIds[id] = [];
      return this.get(id);
    }
  }

  freeWrite(id: DbId): void {
    if (id in this.lockedIds) {
      void this.handleNextWrite(id);
    } else {
      throw new Error('Id was not locked');
    }
  }

  private async handleNextWrite(id: DbId): Promise<void> {
    const next = this.lockedIds[id].shift();
    if (next != null) {
      const element = await this.get(id);
      next(element);
    } else {
      delete this.lockedIds[id];
    }
  }

  /**
   * Get the changes of a domain
   *
   * @param id the id of the domain
   * @return the changes feed
   */
  getChangesFeed(id: DbId): Observable<void> {
    return this.pouchdbService.getChangesFeed(id);
  }

  async delete(id: DbId): Promise<void> {
    await this.pouchdbService.remove(await this.get(id));
  }

  protected async save(element: T): Promise<void> {
    await this.pouchdbService.put(element);
  }
}
