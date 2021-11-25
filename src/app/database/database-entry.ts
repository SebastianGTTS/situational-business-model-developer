type DbTypes = string | number | boolean | DatabaseEntry | undefined;
type DbTypesArray = (DbTypes | DbTypesArray)[];

interface _DatabaseEntry {
  [attribute: string]: DbTypes | DbTypesArray;
}

export interface DatabaseMeta {
  type: DbType;
  _id: DbId;
  _rev?: DbRev;
}

interface _DatabaseRootEntry
  extends Readonly<_DatabaseEntry>,
    Readonly<DatabaseMeta> {}

export type DbType = string;
export type DbId = string;
export type DbRev = string;
export type DatabaseEntry = Readonly<_DatabaseEntry>;
export type DatabaseRootEntry = Readonly<_DatabaseRootEntry>;
