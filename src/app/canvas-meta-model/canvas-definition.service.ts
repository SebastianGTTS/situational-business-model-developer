import { Injectable } from '@angular/core';
import { PouchdbService } from '../database/pouchdb.service';
import PouchDB from 'pouchdb-browser';
import { CanvasDefinition } from './canvas-definition';
import { CanvasDefinitionCell } from './canvas-definition-cell';
import { getId } from '../model/utils';

@Injectable({
  providedIn: 'root'
})
export class CanvasDefinitionService {

  constructor(
    private pouchdbService: PouchdbService,
  ) {
  }

  add(canvasDefinition: Partial<CanvasDefinition>) {
    return this.pouchdbService.post(new CanvasDefinition(canvasDefinition));
  }

  getList() {
    return this.pouchdbService.find<CanvasDefinition>(CanvasDefinition.typeName, {selector: {}});
  }

  get(id: string) {
    return this.pouchdbService.get(id).then((definition) => new CanvasDefinition(definition));
  }

  updateRows(canvasDefinition: CanvasDefinition, newRows: CanvasDefinitionCell[][]) {
    const ids = new Set<string>();
    newRows.forEach((row) => row.filter((cell) => !cell.isSpacer).forEach((cell) => {
      if (!cell.id) {
        cell.id = getId(cell.name, Array.from(ids));
      } else if (ids.has(cell.id)) {
        cell.id = getId(cell.name, Array.from(ids));
      }
      ids.add(cell.id);
    }));
    canvasDefinition.rows = newRows;
  }

  delete(id: string) {
    return this.pouchdbService.get(id).then(result => this.pouchdbService.remove(result));
  }

  save(canvasDefinition: CanvasDefinition): Promise<PouchDB.Core.Response> {
    return this.pouchdbService.put(canvasDefinition);
  }
}
