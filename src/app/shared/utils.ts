import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Equality } from './equality';

export function getTypeaheadInputPipe(input: Observable<string>) {
  return input.pipe(debounceTime(150), distinctUntilChanged());
}

/**
 * Check whether list of lists is equal to another list of lists
 *
 * @param listsA the first list of lists
 * @param listsB the second list of lists
 * @return true if the lists are both null/undefined or have the same amount of elements and all elements are equal at the same index
 */
export function equalsListOfLists<T>(
  listsA: Equality<T>[][],
  listsB: T[][]
): boolean {
  return equalsListGeneric<Equality<T>[], T[]>(listsA, listsB, (a, b) =>
    equalsList(a, b)
  );
}

/**
 * Check whether is a list is equal to another list
 *
 * @param listA the first list
 * @param listB the second list
 * @return true if the lists are both null/undefined or have the same amount of elements and all elements are equal at the same index
 */
export function equalsList<T>(listA: Equality<T>[], listB: T[]): boolean {
  return equalsListGeneric<Equality<T>, T>(listA, listB, (a, b) => a.equals(b));
}

/**
 * Check whether a list of strings is equal to another list of strings
 *
 * @param listA the first list of strings
 * @param listB the second list of strings
 * @return true if the lists are both null/undefined or have the same amount of elements and all elements are equal at the same index
 */
export function equalsListString(listA: string[], listB: string[]): boolean {
  return equalsListGeneric<string, string>(listA, listB, (a, b) => a === b);
}

/**
 * Check whether a list is equal to another list
 *
 * @param listA the first list
 * @param listB the second list
 * @param compare the function used to compare the elements
 * @return true if the lists are both null/undefined or have the same amount of elements and all elements are equal at the same index
 */
export function equalsListGeneric<T, S>(
  listA: T[],
  listB: S[],
  compare: (a: T, b: S) => boolean
): boolean {
  if (listA == null && listB == null) {
    return true;
  }
  if (listA == null || listB == null) {
    return false;
  }
  return (
    listA.length === listB.length &&
    listB.every((itemB, index) => {
      const itemA = listA[index];
      if (itemA == null && itemB == null) {
        return true;
      }
      if (itemA == null || itemB == null) {
        return false;
      }
      return compare(itemA, itemB);
    })
  );
}
