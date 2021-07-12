import { PouchdbModel } from '../../database/pouchdb-model';

export class MethodElement extends PouchdbModel {

  list: string;
  name: string;
  description: string;

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
      list: this.list,
      name: this.name,
      description: this.description,
    };
  }

}
