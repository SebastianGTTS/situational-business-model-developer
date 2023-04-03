import {
  DatabaseEntry,
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../database/database-entry';
import { DatabaseModel } from '../database/database-model';

export interface StatsInit extends DatabaseRootInit {
  username?: string;
  stats?: { [key: string]: DatabaseEntry };
}

export interface StatsEntry extends DatabaseRootEntry {
  username?: string;
  stats: { [key: string]: DatabaseEntry };
}

export class Stats extends DatabaseModel implements StatsInit {
  static readonly typeName = 'Stats';

  username?: string;
  stats: { [key: string]: DatabaseEntry } = {};

  constructor(entry: StatsEntry | undefined, init: StatsInit | undefined) {
    super(entry, init, Stats.typeName);
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.username = element.username;
    this.stats = element.stats ?? this.stats;
  }

  getStat(key: string): DatabaseEntry | undefined {
    return this.stats[key];
  }

  updateStat(key: string, value: DatabaseEntry): void {
    this.stats[key] = value;
  }

  removeStat(key: string): void {
    delete this.stats[key];
  }

  toDb(): StatsEntry {
    return {
      ...super.toDb(),
      username: this.username,
      stats: this.stats,
    };
  }
}
