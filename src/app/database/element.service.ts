import { DatabaseModel } from './database-model';
import { Observable } from 'rxjs';
import { EntryType } from './database-model-part';
import { DatabaseRootInit, DbId } from './database-entry';

export interface ElementService<
  T extends DatabaseModel,
  S extends DatabaseRootInit
> {
  /**
   * Get a list of all elements of this type in the database
   */
  getList(): Promise<EntryType<T>[]>;

  /**
   * Add an element to the database
   *
   * @param element the element to add
   */
  add(element: S): Promise<T>;

  /**
   * Update an element in the database
   *
   * @param id the id of the element
   * @param element the new data of the element
   */
  update?(id: DbId, element: Partial<T>): Promise<void>;

  /**
   * Get an element from the database
   *
   * @param id the id of the element to get
   * @return the element from the database
   */
  get(id: DbId): Promise<T>;

  /**
   * Get an element for write access. Call free after done with writing.
   * All other clients calling getWrite will be delayed until free is called.
   *
   * @param id the id of the element to get
   * @return the element from the database
   */
  getWrite?(id: DbId): Promise<T>;

  /**
   * Give the lock on an element back.
   *
   * @param id
   */
  freeWrite?(id: DbId): void;

  /**
   * Get the changes of an element
   *
   * @param id the id of the element
   * @return the changes feed
   */
  getChangesFeed(id: DbId): Observable<void>;

  /**
   * Remove an element from the database
   *
   * @param id the id of the element
   */
  delete(id: DbId): Promise<void>;
}
