import { DatabaseEntry, DatabaseInit } from './database-entry';

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
export type InitType<T extends DatabaseModelPart> = NonNullable<any>;

/**
 * Used to get the entry type of database model part.
 */
export type EntryType<T extends DatabaseModelPart> = ReturnType<T['toDb']>;

/**
 * Used to create models from entries or initialization.
 */
export interface DatabaseConstructor<
  T extends DatabaseModelPart,
  S extends InitType<T> = InitType<T>
> {
  new (entry: EntryType<T> | undefined, init: S | undefined): T;
}

/**
 * A part of a database model. Extends Database init to use it to
 * copy models.
 */
export interface DatabaseModelPart extends DatabaseInit {
  toDb(): DatabaseEntry;
}
