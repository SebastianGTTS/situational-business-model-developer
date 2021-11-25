import { DatabaseModelPart } from '../database/database-model-part';
import { Equality } from '../shared/equality';
import { DatabaseEntry } from '../database/database-entry';

export interface CanvasDefinitionCellEntry extends DatabaseEntry {
  isSpacer: boolean;
  id?: string;
  name?: string;
  rowspan: number;
  colspan: number;
}

export class CanvasDefinitionCell
  implements DatabaseModelPart, Equality<CanvasDefinitionCell>
{
  isSpacer: boolean;
  id?: string;
  name?: string;
  rowspan: number;
  colspan: number;

  constructor(canvasDefinitionCell: Partial<CanvasDefinitionCell>) {
    Object.assign(this, canvasDefinitionCell);
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
