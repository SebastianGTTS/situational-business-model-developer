import { DatabaseModelPart } from './database-model-part';
import { Equality } from '../shared/equality';

export class DatabaseModel
  implements DatabaseModelPart, Equality<DatabaseModel>
{
  _id: string;
  _rev: string;

  readonly type: string;

  protected constructor(type: string) {
    this.type = type;
  }

  toDb(): any {
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
  resetDatabaseState(): void {
    this._id = String(Date.now());
    this._rev = undefined;
  }

  /**
   * Check if two pouchdb models are equal by their id and revision
   *
   * @param other the other pouchdb model
   * @return true if the id and revision are equal
   */
  equals(other: DatabaseModel): boolean {
    if (other == null) {
      return false;
    }
    return this._id === other._id && this._rev === other._rev;
  }
}
