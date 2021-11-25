import { Injectable } from '@angular/core';
import { PouchdbService } from './pouchdb.service';
import { Observable } from 'rxjs';
import { ElementService } from './element.service';
import { DatabaseModel } from './database-model';

@Injectable()
export abstract class DefaultElementService<T extends DatabaseModel>
  implements ElementService<T>
{
  protected abstract get typeName(): string;

  protected constructor(protected pouchdbService: PouchdbService) {}

  async add(element: Partial<T>): Promise<void> {
    await this.pouchdbService.post(this.createElement(element));
  }

  async getList(): Promise<T[]> {
    return this.pouchdbService.find<T>(this.typeName, {
      selector: {},
    });
  }

  async get(id: string): Promise<T> {
    return this.createElement(await this.pouchdbService.get<T>(id));
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

  protected abstract createElement(element: Partial<T>): T;
}
