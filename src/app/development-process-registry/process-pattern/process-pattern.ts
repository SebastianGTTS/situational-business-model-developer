import { DatabaseModel } from '../../database/database-model';
import { Author } from '../../model/author';
import { SituationalFactor } from '../method-elements/situational-factor/situational-factor';
import { Type } from '../method-elements/type/type';
import { Selection } from '../development-method/selection';

export class ProcessPattern extends DatabaseModel {
  static readonly typeName = 'ProcessPattern';

  name: string;
  description: string;
  author: Author;

  pattern: string;

  types: Selection<Type>[] = [];
  situationalFactors: Selection<SituationalFactor>[] = [];

  constructor(processPattern: Partial<ProcessPattern>) {
    super(ProcessPattern.typeName);
    this.update(processPattern);
  }

  /**
   * Update this process pattern with new values
   *
   * @param processPattern the new values of this process pattern (values will be copied to the current object)
   */
  update(processPattern: Partial<ProcessPattern>) {
    Object.assign(this, processPattern);
    this.author = new Author(this.author);
    this.types = this.types.map(
      (selection) => new Selection(selection, (element) => new Type(element))
    );
    this.situationalFactors = this.situationalFactors.map(
      (selection) =>
        new Selection(selection, (element) => new SituationalFactor(element))
    );
  }

  toDb(): any {
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
