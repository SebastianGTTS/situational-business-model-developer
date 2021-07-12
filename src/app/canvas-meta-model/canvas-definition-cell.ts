import { PouchdbModelPart } from '../database/pouchdb-model-part';

export class CanvasDefinitionCell implements PouchdbModelPart {

  isSpacer: boolean;
  id?: string;
  name?: string;
  rowspan: number;
  colspan: number;

  constructor(canvasDefinitionCell: Partial<CanvasDefinitionCell>) {
    Object.assign(this, canvasDefinitionCell);
  }

  toPouchDb(): any {
    return {
      isSpacer: this.isSpacer,
      id: this.id,
      name: this.name,
      rowspan: this.rowspan,
      colspan: this.colspan,
    };
  }

}
