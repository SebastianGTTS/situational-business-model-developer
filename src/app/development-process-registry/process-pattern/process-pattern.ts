import { PouchdbModel } from '../../database/pouchdb-model';
import { Author } from '../../model/author';
import { SituationalFactor } from '../method-elements/situational-factor/situational-factor';
import { Type } from '../method-elements/type/type';

export class ProcessPattern extends PouchdbModel {

  static readonly typeName = 'ProcessPattern';

  name: string;
  description: string;
  author: Author;

  pattern: string;

  types: { list: string, element: Type }[] = [];
  situationalFactors: { list: string, element: SituationalFactor }[] = [];

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
      (element) => {
        return {
          list: element.list,
          element: element.element ? new Type(element.element) : null,
        };
      }
    );
    this.situationalFactors = this.situationalFactors.map(
      (factor) => {
        return {
          list: factor.list,
          element: factor.element ? new SituationalFactor(factor.element) : null,
        };
      }
    );
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
      name: this.name,
      description: this.description,
      author: this.author.toPouchDb(),
      pattern: this.pattern,
      types: this.types.map((element) => {
        return {
          list: element.list,
          element: element.element ? element.element.toPouchDb() : null,
        };
      }),
      situationalFactors: this.situationalFactors.map((factor) => {
        return {
          list: factor.list,
          element: factor.element ? factor.element.toPouchDb() : null,
        };
      }),
    };
  }

}
