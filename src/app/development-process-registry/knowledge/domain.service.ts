import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import PouchDB from 'pouchdb-browser';
import { Domain } from './domain';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule
})
export class DomainService {

  constructor(
    private pouchdbService: PouchdbService,
  ) {
  }

  add(domain: Partial<Domain>) {
    return this.pouchdbService.post(new Domain(domain));
  }

  getList() {
    return this.pouchdbService.find<Domain>(Domain.typeName, {selector: {}});
  }

  async get(id: string): Promise<Domain> {
    return new Domain(await this.pouchdbService.get<Domain>(id));
  }

  async delete(id: string) {
    const result = await this.pouchdbService.get(id);
    return this.pouchdbService.remove(result);
  }

  save(element: Domain): Promise<PouchDB.Core.Response> {
    return this.pouchdbService.put(element);
  }
}
