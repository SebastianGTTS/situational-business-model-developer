import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import PouchDB from 'pouchdb-browser';
import { DevelopmentMethod } from './development-method';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { Type } from '../method-elements/type/type';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule
})
export class DevelopmentMethodService {

  constructor(
    private pouchdbService: PouchdbService,
  ) {
  }

  /**
   * Get the list of the development methods.
   */
  getDevelopmentMethodList() {
    return this.pouchdbService.find<DevelopmentMethod>(DevelopmentMethod.typeName, {
      selector: {},
    });
  }

  /**
   * Get a list of development methods that have the needed types, but not the forbidden ones.
   *
   * @param needed needed types
   * @param forbidden forbidden types
   */
  getValidDevelopmentMethods(
    needed: { list: string, element: { _id: string, name: string } }[],
    forbidden: { list: string, element: { _id: string, name: string } }[],
  ) {
    return this.pouchdbService.find<DevelopmentMethod>(DevelopmentMethod.typeName, {
      selector: {},
    }).then((methods) => {
      methods.docs = methods.docs.filter((method) => Type.validTypes(method.types, needed, forbidden));
      return methods;
    });
  }

  /**
   * Add new development method.
   *
   * @param name name of the development method
   */
  addDevelopmentMethod(name: string) {
    return this.pouchdbService.post(new DevelopmentMethod({name}));
  }

  /**
   * Update the development method.
   *
   * @param id id of the development method
   * @param developmentMethod the new values of the object (values will be copied)
   */
  updateDevelopmentMethod(id: string, developmentMethod: Partial<DevelopmentMethod>) {
    return this.getDevelopmentMethod(id).then((method) => {
      method.update(developmentMethod);
      return this.saveDevelopmentMethod(method);
    });
  }

  /**
   * Get the development method.
   *
   * @param id id of the development method
   */
  getDevelopmentMethod(id: string): Promise<DevelopmentMethod> {
    return this.pouchdbService.get<DevelopmentMethod>(id).then((e) => new DevelopmentMethod(e));
  }

  /**
   * Get development methods by their ids
   *
   * @param ids the ids to query
   */
  getDevelopmentMethods(ids: string[]): Promise<DevelopmentMethod[]> {
    return this.pouchdbService.find<DevelopmentMethod>(DevelopmentMethod.typeName, {
      selector: {
        _id: {
          $in: ids,
        }
      },
    }).then((res) => res.docs.map((doc) => new DevelopmentMethod(doc)));
  }

  /**
   * Remove the development method.
   *
   * @param id id of the development method
   */
  deleteDevelopmentMethod(id: string) {
    return this.pouchdbService.get(id).then(result => {
      return this.pouchdbService.remove(result);
    });
  }

  private saveDevelopmentMethod(developmentMethod: DevelopmentMethod): Promise<PouchDB.Core.Response> {
    return this.pouchdbService.put(developmentMethod);
  }

}
