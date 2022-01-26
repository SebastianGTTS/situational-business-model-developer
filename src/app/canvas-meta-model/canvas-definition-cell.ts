import { DatabaseModelPart } from '../database/database-model-part';
import { Equality } from '../shared/equality';
import { DatabaseEntry, DatabaseInit } from '../database/database-entry';

export interface CanvasDefinitionCellInit extends DatabaseInit {
  isSpacer: boolean;
  id?: string;
  name?: string;
  rowspan: number;
  colspan: number;
}

export interface CanvasDefinitionCellEntry extends DatabaseEntry {
  isSpacer: boolean;
  id?: string;
  name?: string;
  rowspan: number;
  colspan: number;
}

export class CanvasDefinitionCell
  implements
    CanvasDefinitionCellInit,
    DatabaseModelPart,
    Equality<CanvasDefinitionCell>
{
  isSpacer: boolean;
  id?: string;
  name?: string;
  rowspan: number;
  colspan: number;

  constructor(
    entry: CanvasDefinitionCellEntry | undefined,
    init: CanvasDefinitionCellInit | undefined
  ) {
    const element = entry ?? init;
    this.isSpacer = element.isSpacer;
    this.id = element.id;
    this.name = element.name;
    this.rowspan = element.rowspan;
    this.colspan = element.colspan;
  }

  toDb(): CanvasDefinitionCellEntry {
    return {
      isSpacer: this.isSpacer,
      id: this.id,
      name: this.name,
      rowspan: this.rowspan,
      colspan: this.colspan,
    };
  }

  equals(other: CanvasDefinitionCell): boolean {
    if (other == null) {
      return false;
    }
    return (
      this.isSpacer === other.isSpacer &&
      this.name === other.name &&
      this.rowspan === other.rowspan &&
      this.colspan === other.colspan
    );
  }
}
