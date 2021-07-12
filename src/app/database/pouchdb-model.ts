import { PouchdbModelPart } from './pouchdb-model-part';

export class PouchdbModel implements PouchdbModelPart {

  // tslint:disable-next-line:variable-name needed by PouchDB
  _id: string;
  // tslint:disable-next-line:variable-name needed by PouchDB
  _rev: string;

  readonly type: string;

  protected constructor(type: string) {
    this.type = type;
  }

  toPouchDb(): any {
    if (!this._id) {
      this._id = String(Date.now());
    }
    return {
      type: this.type,
      _id: this._id,
      _rev: this._rev,
    };
  }

  /**
   * Reset the models database state and add it as a new model if pushed to pouchdb
   */
  resetDatabaseState() {
    this._id = String(Date.now());
    this._rev = undefined;
  }

}
