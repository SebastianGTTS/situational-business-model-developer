import { Feature } from './feature';
import { DatabaseModel } from '../database/database-model';
import {
  CanvasDefinitionCell,
  CanvasDefinitionCellEntry,
} from './canvas-definition-cell';
import { getId } from '../model/utils';
import { DatabaseRootEntry } from '../database/database-entry';

export interface CanvasDefinitionEntry extends DatabaseRootEntry {
  name: string;
  description: string;
  rows: CanvasDefinitionCellEntry[][];
  relationshipTypes: string[];
}

interface CanvasDefinitionJsonSchema {
  name: string;
  description: string;
  rows: CanvasDefinitionCellEntry[][];
  relationshipTypes: string[];
}

export class CanvasDefinition extends DatabaseModel {
  static readonly typeName = 'CanvasDefinition';

  name: string;
  description: string;

  rows: CanvasDefinitionCell[][] = [];

  relationshipTypes: string[] = [];

  constructor(canvasDefinition: Partial<CanvasDefinition>) {
    super(CanvasDefinition.typeName);
    Object.assign(this, canvasDefinition);
    this.rows = this.rows.map((row) =>
      row.map((cell) => new CanvasDefinitionCell(cell))
    );
  }

  update(canvasDefinition: Partial<CanvasDefinition>): void {
    Object.assign(this, canvasDefinition);
  }

  /**
   * Update the rows of this canvas definition and give them correct ids
   *
   * @param newRows the new rows
   */
  updateRows(newRows: CanvasDefinitionCell[][]): void {
    const ids = new Set<string>();
    newRows.forEach((row) =>
      row
        .filter((cell) => !cell.isSpacer)
        .forEach((cell) => {
          if (!cell.id) {
            cell.id = getId(cell.name, Array.from(ids));
          } else if (ids.has(cell.id)) {
            cell.id = getId(cell.name, Array.from(ids));
          }
          ids.add(cell.id);
        })
    );
    this.rows = newRows;
  }

  get rootFeatures(): Feature[] {
    const rootFeatures: Feature[] = [];
    this.rows.forEach((row) =>
      row
        .filter((cell) => !cell.isSpacer)
        .forEach((cell) => {
          rootFeatures.push(new Feature(cell.id, null, { name: cell.name }));
        })
    );
    return rootFeatures;
  }

  toDb(): CanvasDefinitionEntry {
    return {
      ...super.toDb(),
      name: this.name,
      description: this.description,
      rows: this.rows.map((row) => row.map((cell) => cell.toDb())),
      relationshipTypes: this.relationshipTypes,
    };
  }

  toJSON(): CanvasDefinitionJsonSchema {
    return {
      name: this.name,
      description: this.description,
      rows: this.rows.map((row) => row.map((cell) => cell.toDb())),
      relationshipTypes: this.relationshipTypes,
    };
  }
}
