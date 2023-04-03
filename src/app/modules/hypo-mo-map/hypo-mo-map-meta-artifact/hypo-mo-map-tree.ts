import { HypoMoMap, HypoMoMapEntry, HypoMoMapInit } from './hypo-mo-map';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../../database/database-entry';
import { DatabaseModel } from '../../../database/database-model';

export interface HypoMoMapTreeInit extends DatabaseRootInit {
  rootHypoMoMap: HypoMoMapInit;
}

export interface HypoMoMapTreeEntry extends DatabaseRootEntry {
  rootHypoMoMap: HypoMoMapEntry;
}

export class HypoMoMapTree extends DatabaseModel implements HypoMoMapTreeInit {
  static readonly typeName = 'HypoMoMapTree';

  rootHypoMoMap: HypoMoMap;

  constructor(
    entry: HypoMoMapTreeEntry | undefined,
    init: HypoMoMapTreeInit | undefined
  ) {
    super(entry, init, HypoMoMapTree.typeName);
    if (entry != null) {
      this.rootHypoMoMap = new HypoMoMap(
        entry.rootHypoMoMap,
        undefined,
        undefined
      );
    } else if (init != null) {
      this.rootHypoMoMap = new HypoMoMap(
        undefined,
        init.rootHypoMoMap,
        undefined
      );
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  /**
   * Get a list of all HypoMoMaps
   */
  getHypoMoMapList(): HypoMoMap[] {
    const stack: HypoMoMap[] = [this.rootHypoMoMap];
    const list: HypoMoMap[] = [];
    let current = stack.pop();
    while (current != null) {
      list.push(current);
      stack.push(...current.adaptions.slice().reverse());
      current = stack.pop();
    }
    return list;
  }

  /**
   * Get a specific HypoMoMap of this HypoMoMapTree
   *
   * @param hypoMoMapId the id of the HypoMoMap
   */
  getHypoMoMap(hypoMoMapId: string | undefined): HypoMoMap | undefined {
    return this.getHypoMoMapList().find(
      (hypoMoMap) => hypoMoMap.id === hypoMoMapId
    );
  }

  /**
   * Get the latest HypoMoMap
   */
  getLatestHypoMoMap(): HypoMoMap {
    return this.rootHypoMoMap.getLatestAdaption();
  }

  /**
   * Delete a HypoMoMap of this HypoMoMapTree
   *
   * @param hypoMoMapId the id of the HypoMoMap to delete
   */
  deleteHypoMoMap(hypoMoMapId: string): void {
    const hypoMoMap = this.getHypoMoMap(hypoMoMapId);
    if (hypoMoMap == null) {
      throw new Error('HypoMoMap does not exist.');
    }
    if (hypoMoMap.parent == null) {
      throw new Error('Can not remove root HypoMoMap.');
    }
    hypoMoMap.parent.removeAdaption(hypoMoMapId);
  }

  toDb(): HypoMoMapTreeEntry {
    return {
      ...super.toDb(),
      rootHypoMoMap: this.rootHypoMoMap.toDb(),
    };
  }
}
