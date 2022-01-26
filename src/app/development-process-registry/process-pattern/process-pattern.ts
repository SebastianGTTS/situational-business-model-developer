import { DatabaseModel } from '../../database/database-model';
import { Author, AuthorEntry, AuthorInit } from '../../model/author';
import {
  SituationalFactor,
  SituationalFactorEntry,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import { Type, TypeEntry, TypeInit } from '../method-elements/type/type';
import {
  Selection,
  SelectionEntry,
  SelectionInit,
} from '../development-method/selection';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';

export interface ProcessPatternInit extends DatabaseRootInit {
  name: string;
  description?: string;
  author?: AuthorInit;

  pattern?: string;

  types?: SelectionInit<TypeInit>[];
  situationalFactors?: SelectionInit<SituationalFactorInit>[];
}

export interface ProcessPatternEntry extends DatabaseRootEntry {
  name: string;
  description: string;
  author: AuthorEntry;

  pattern: string;

  types: SelectionEntry<TypeEntry>[];
  situationalFactors: SelectionEntry<SituationalFactorEntry>[];
}

export class ProcessPattern
  extends DatabaseModel
  implements ProcessPatternInit
{
  static readonly typeName = 'ProcessPattern';

  name: string;
  description: string;
  author: Author;

  pattern: string;

  types: Selection<Type>[] = [];
  situationalFactors: Selection<SituationalFactor>[] = [];

  constructor(
    entry: ProcessPatternEntry | undefined,
    init: ProcessPatternInit | undefined
  ) {
    super(entry, init, ProcessPattern.typeName);
    const element = entry ?? init;
    this.name = element.name;
    this.description = element.description;
    this.pattern = element.pattern;

    if (entry != null) {
      this.author = new Author(entry.author, undefined);
      this.types =
        entry.types?.map(
          (selection) => new Selection<Type>(selection, undefined, Type)
        ) ?? this.types;
      this.situationalFactors =
        entry.situationalFactors?.map(
          (selection) =>
            new Selection<SituationalFactor>(
              selection,
              undefined,
              SituationalFactor
            )
        ) ?? this.situationalFactors;
    } else {
      this.author = new Author(undefined, init.author ?? {});
      this.types =
        init.types?.map(
          (selection) => new Selection<Type>(undefined, selection, Type)
        ) ?? this.types;
      this.situationalFactors =
        init.situationalFactors?.map(
          (selection) =>
            new Selection<SituationalFactor>(
              undefined,
              selection,
              SituationalFactor
            )
        ) ?? this.situationalFactors;
    }
  }

  /**
   * Update this process pattern with new values
   *
   * @param processPattern the new values of this process pattern (values will be copied to the current object)
   */
  update(processPattern: Partial<ProcessPattern>): void {
    Object.assign(this, processPattern);
    this.author = new Author(undefined, this.author);
    this.types = this.types.map(
      (selection) => new Selection(undefined, selection, Type)
    );
    this.situationalFactors = this.situationalFactors.map(
      (selection) => new Selection(undefined, selection, SituationalFactor)
    );
  }

  toDb(): ProcessPatternEntry {
    return {
      ...super.toDb(),
      name: this.name,
      description: this.description,
      author: this.author.toDb(),
      pattern: this.pattern,
      types: this.types.map((selection) => selection.toDb()),
      situationalFactors: this.situationalFactors.map((selection) =>
        selection.toDb()
      ),
    };
  }
}
