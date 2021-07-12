import { Injectable } from '@angular/core';
import { PouchdbService } from '../../database/pouchdb.service';
import { ProcessPattern } from './process-pattern';
import PouchDB from 'pouchdb-browser';
import { Type } from '../method-elements/type/type';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule
})
export class ProcessPatternService {

  constructor(
    private pouchdbService: PouchdbService,
  ) {
  }

  /**
   * Get the list of the process patterns.
   */
  getProcessPatternList() {
    return this.pouchdbService.find<ProcessPattern>(ProcessPattern.typeName, {
      selector: {},
    });
  }

  /**
   * Get a list of process patterns that have the needed types, but not the forbidden ones.
   *
   * @param needed needed types
   * @param forbidden forbidden types
   */
  getValidProcessPatterns(
    needed: { list: string, element: { _id: string, name: string } }[],
    forbidden: { list: string, element: { _id: string, name: string } }[],
  ) {
    return this.pouchdbService.find<ProcessPattern>(ProcessPattern.typeName, {
      selector: {},
    }).then((patterns) => {
      patterns.docs = patterns.docs.filter((pattern) => Type.validTypes(pattern.types, needed, forbidden));
      return patterns;
    });
  }

  /**
   * Add new process pattern.
   *
   * @param name name of the process pattern
   */
  addProcessPattern(name: string) {
    return this.pouchdbService.post(new ProcessPattern({name}));
  }

  /**
   * Update the process pattern.
   *
   * @param id id of the process pattern
   * @param processPattern the new values of the object (values will be copied)
   */
  updateProcessPattern(id: string, processPattern: Partial<ProcessPattern>) {
    return this.getProcessPattern(id).then((pattern) => {
      pattern.update(processPattern);
      return this.saveProcessPattern(pattern);
    });
  }

  /**
   * Get the process pattern.
   *
   * @param id id of the process pattern
   */
  getProcessPattern(id: string): Promise<ProcessPattern> {
    return this.pouchdbService.get<ProcessPattern>(id).then((e) => new ProcessPattern(e));
  }

  /**
   * Get process patterns by their ids
   *
   * @param ids the ids to query
   */
  getProcessPatterns(ids: string[]): Promise<ProcessPattern[]> {
    return this.pouchdbService.find<ProcessPattern>(ProcessPattern.typeName, {
      selector: {
        _id: {
          $in: ids,
        }
      },
    }).then((res) => res.docs.map((doc) => new ProcessPattern(doc)));
  }

  /**
   * Remove the process pattern.
   *
   * @param id id of the process pattern
   */
  deleteProcessPattern(id: string) {
    return this.pouchdbService.get(id).then(result => {
      return this.pouchdbService.remove(result);
    });
  }

  private saveProcessPattern(processPattern: ProcessPattern): Promise<PouchDB.Core.Response> {
    return this.pouchdbService.put(processPattern);
  }

}
