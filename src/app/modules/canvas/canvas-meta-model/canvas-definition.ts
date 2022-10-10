import { Feature } from './feature';
import { DatabaseModel } from '../../../database/database-model';
import {
  CanvasDefinitionCell,
  CanvasDefinitionCellEntry,
  CanvasDefinitionCellInit,
} from './canvas-definition-cell';
import { getId } from '../../../model/utils';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../../database/database-entry';

export interface CanvasDefinitionInit extends DatabaseRootInit {
  name: string;
  description?: string;
  rows?: CanvasDefinitionCellInit[][];
  relationshipTypes?: string[];
}

export interface CanvasDefinitionEntry extends DatabaseRootEntry {
  name: string;
  description?: string;
  rows: CanvasDefinitionCellEntry[][];
  relationshipTypes: string[];
}

interface CanvasDefinitionJsonSchema {
  name: string;
  description?: string;
  rows: CanvasDefinitionCellEntry[][];
  relationshipTypes: string[];
}

export class CanvasDefinition
  extends DatabaseModel
  implements CanvasDefinitionInit
{
  static readonly typeName = 'CanvasDefinition';

  name: string;
  description?: string;

  rows: CanvasDefinitionCell[][] = [];

  relationshipTypes: string[] = [];

  constructor(
    entry: CanvasDefinitionEntry | undefined,
    init: CanvasDefinitionInit | undefined
  ) {
    super(entry, init, CanvasDefinition.typeName);
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.name = element.name;
    this.description = element.description;
    this.relationshipTypes =
      element.relationshipTypes ?? this.relationshipTypes;
    if (entry != null) {
      this.rows =
        entry.rows?.map((row) =>
          row.map((cell) => new CanvasDefinitionCell(cell, undefined))
        ) ?? this.rows;
    } else if (init != null) {
      this.rows =
        init.rows?.map((row) =>
          row.map((cell) => new CanvasDefinitionCell(undefined, cell))
        ) ?? this.rows;
    }
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
          if (cell.name == null) {
            throw new Error('Cell without name that is not a spacer');
          }
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
          if (cell.name == null) {
            throw new Error('Cell without name that is not a spacer');
          }
          if (cell.id == null) {
            throw new Error('Cell has no id');
          }
          rootFeatures.push(
            new Feature(
              undefined,
              {
                name: cell.name,
                guidingQuestions: cell.guidingQuestions,
                examples: cell.examples,
              },
              cell.id,
              undefined
            )
          );
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
