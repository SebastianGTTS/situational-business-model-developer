import { PouchdbModel } from '../../database/pouchdb-model';

export class Domain extends PouchdbModel {

  static readonly typeName = 'Domain';

  constructor(domain: Partial<Domain>) {
    super(Domain.typeName);
    Object.assign(this, domain);
  }

  name: string;
  description: string;

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
      name: this.name,
      description: this.description,
    };
  }

}
