import { Feature } from './feature';
import { PouchdbModel } from '../database/pouchdb-model';
import { CanvasDefinitionCell } from './canvas-definition-cell';

export class CanvasDefinition extends PouchdbModel {

  static readonly typeName = 'CanvasDefinition';

  name: string;

  rows: CanvasDefinitionCell[][] = [];

  constructor(canvasDefinition: Partial<CanvasDefinition>) {
    super(CanvasDefinition.typeName);
    Object.assign(this, canvasDefinition);
    this.rows = this.rows.map((row) => row.map((cell) => new CanvasDefinitionCell(cell)));
  }

  get rootFeatures(): Feature[] {
    const rootFeatures: Feature[] = [];
    this.rows.forEach((row) => row.filter((cell) => !cell.isSpacer).forEach((cell) => {
      rootFeatures.push(new Feature(cell.id, null, {name: cell.name}));
    }));
    return rootFeatures;
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
      name: this.name,
      rows: this.rows,
    };
  }

  toJSON() {
    return {
      name: this.name,
      rows: this.rows.map((row) => row.map((cell) => cell.toPouchDb())),
    };
  }

}
