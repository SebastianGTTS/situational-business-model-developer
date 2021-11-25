import { DatabaseModel } from './database-model';
import { Observable } from 'rxjs';

export interface ElementService<T extends DatabaseModel> {
  /**
   * Get a list of all elements of this type in the database
   */
  getList(): Promise<T[]>;

  /**
   * Add an element to the database
   *
   * @param element the element to add
   */
  add(element: Partial<T>): Promise<any>;

  /**
   * Update an element in the database
   *
   * @param id the id of the element
   * @param element the new data of the element
   */
  update?(id: string, element: Partial<T>): Promise<any>;

  /**
   * Get an element from the database
   *
   * @param id the id of the element to get
   * @return the element from the database
   */
  get(id: string): Promise<T>;

  /**
   * Get the changes of an element
   *
   * @param id the id of the element
   * @return the changes feed
   */
  getChangesFeed(id: string): Observable<void>;

  /**
   * Remove an element from the database
   *
   * @param id the id of the element
   */
  delete(id: string): Promise<void>;
}
