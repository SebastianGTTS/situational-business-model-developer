import { DatabaseModelPart } from '../../../database/database-model-part';
import { Equality } from '../../../shared/equality';
import { DatabaseEntry, DatabaseInit } from '../../../database/database-entry';
import { equalsListString } from '../../../shared/utils';

export interface CanvasDefinitionCellInit extends DatabaseInit {
  isSpacer: boolean;
  id?: string;
  name?: string;
  rowspan: number;
  colspan: number;
  guidingQuestions?: string[];
  examples?: string[];
}

export interface CanvasDefinitionCellEntry extends DatabaseEntry {
  isSpacer: boolean;
  id?: string;
  name?: string;
  rowspan: number;
  colspan: number;
  guidingQuestions: string[];
  examples: string[];
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
  guidingQuestions: string[] = [];
  examples: string[] = [];

  constructor(
    entry: CanvasDefinitionCellEntry | undefined,
    init: CanvasDefinitionCellInit | undefined
  ) {
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.isSpacer = element.isSpacer;
    this.id = element.id;
    this.name = element.name;
    this.rowspan = element.rowspan;
    this.colspan = element.colspan;
    this.guidingQuestions = element.guidingQuestions ?? this.guidingQuestions;
    this.examples = element.examples ?? this.examples;
  }

  toDb(): CanvasDefinitionCellEntry {
    return {
      isSpacer: this.isSpacer,
      id: this.id,
      name: this.name,
      rowspan: this.rowspan,
      colspan: this.colspan,
      guidingQuestions: this.guidingQuestions,
      examples: this.examples,
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
      this.colspan === other.colspan &&
      equalsListString(this.guidingQuestions, other.guidingQuestions) &&
      equalsListString(this.examples, other.examples)
    );
  }
}
