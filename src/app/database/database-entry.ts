type DbTypes = string | number | boolean | DatabaseEntry | undefined;
type DbTypesArray = (DbTypes | DbTypesArray)[];

export interface DatabaseEntry {
  [attribute: string]: DbTypes | DbTypesArray;
}

/**
 * Represents a database revision.
 * Used to specify that _rev is not optional if queried from db.
 */
export interface DatabaseRevision {
  type: DbType;
  _id: DbId;
  _rev: DbRev;
}

export interface DatabaseMeta {
  type: DbType;
  _id: DbId;
  _rev?: DbRev;
}

export interface DatabaseRootEntry extends DatabaseMeta, DatabaseEntry {}

export type DbType = string;
export type DbId = string;
export type DbRev = string;

/**
 * Used to initialize database models
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatabaseInit {}

/**
 * Used to initialize root database models
 */
export interface DatabaseRootInit extends DatabaseInit {
  type?: DbType;
  _id?: DbId;
  _rev?: DbRev;
}
