import { DatabaseModelPart } from './database-model-part';
import { Equality } from '../shared/equality';
import { DatabaseRootEntry, DatabaseRootInit, DbType } from './database-entry';
import { v4 as uuidv4 } from 'uuid';

export class DatabaseModel
  implements DatabaseRootInit, DatabaseModelPart, Equality<DatabaseModel>
{
  _id: string;
  _rev?: string;

  readonly type: string;

  protected constructor(
    entry: DatabaseRootEntry | undefined,
    init: DatabaseRootInit | undefined,
    type: DbType
  ) {
    if (entry != null) {
      this._id = entry._id;
      this._rev = entry._rev;
      this.type = entry.type;
    } else if (init != null) {
      this._id = init._id ?? DatabaseModel.getId();
      this._rev = init._rev;
      this.type = type;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): DatabaseRootEntry {
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
    this._id = DatabaseModel.getId();
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

  private static getId(): string {
    return String(Date.now()) + uuidv4();
  }
}
