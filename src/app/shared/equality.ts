export interface Equality<T> {
  /**
   * Check whether this object and the other object are equal
   *
   * @param other the other object
   * @return true if they are equal
   */
  equals(other: T): boolean;
}
