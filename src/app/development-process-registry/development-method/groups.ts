import {
  DatabaseConstructor,
  DatabaseModelPart,
  EntryType,
  InitType,
} from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-elements/method-element';
import { Group, GroupEntry, GroupInit } from './group';
import { Equality } from '../../shared/equality';
import { equalsList } from '../../shared/utils';

export interface GroupsInit<T extends MethodElementInit> extends DatabaseInit {
  allowNone?: boolean;
  groups?: GroupInit<T>[];
  defaultGroup?: GroupInit<T>;
}

export interface GroupsEntry<T extends MethodElementEntry>
  extends DatabaseEntry {
  allowNone: boolean;
  groups: GroupEntry<T>[];
  defaultGroup?: number;
}

/**
 * Represents multiple groups of which one can be later selected in the
 * building process of the bm process (composed method). One group can be
 * the default group, which is selected by default.
 */
export class Groups<T extends MethodElement>
  implements GroupsInit<T>, DatabaseModelPart, Equality<Groups<T>>
{
  allowNone = false;
  groups: Group<T>[] = [];
  defaultGroup?: Group<T>;

  constructor(
    entry: GroupsEntry<EntryType<T>> | undefined,
    init: GroupsInit<InitType<T>> | undefined,
    databaseConstructor: DatabaseConstructor<T>
  ) {
    if (entry != null) {
      this.allowNone = entry.allowNone;
      this.groups = entry.groups.map((group) =>
        this.createGroup(group, undefined, databaseConstructor)
      );
      if (entry.defaultGroup != null) {
        this.defaultGroup = this.groups[entry.defaultGroup];
      }
    } else if (init != null) {
      this.allowNone = init.allowNone ?? this.allowNone;
      this.groups =
        init.groups?.map((group) =>
          this.createGroup(undefined, group, databaseConstructor)
        ) ?? this.groups;
      if (init.defaultGroup != null) {
        const index = init.groups?.indexOf(init.defaultGroup);
        if (index != null && index != -1) {
          this.defaultGroup = this.groups[index];
        }
      }
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  get defaultGroupIndex(): number | undefined {
    if (this.defaultGroup != null) {
      return this.groups.indexOf(this.defaultGroup);
    } else {
      return undefined;
    }
  }

  equals(other: Groups<T> | undefined): boolean {
    if (other == null) {
      return false;
    }
    if (other.groups.length !== this.groups.length) {
      return false;
    }
    if (this.defaultGroup == null && other.defaultGroup != null) {
      return false;
    }
    if (
      this.defaultGroup != null &&
      !this.defaultGroup.equals(other.defaultGroup)
    ) {
      return false;
    }
    return (
      this.allowNone === other.allowNone &&
      equalsList(this.groups, other.groups)
    );
  }

  toDb(): GroupsEntry<EntryType<T>> {
    return {
      allowNone: this.allowNone,
      groups: this.groups.map((group) => group.toDb()),
      defaultGroup:
        this.defaultGroup != null
          ? this.groups.indexOf(this.defaultGroup)
          : undefined,
    };
  }

  protected createGroup(
    entry: GroupEntry<EntryType<T>> | undefined,
    init: GroupInit<InitType<T>> | undefined,
    databaseConstructor: DatabaseConstructor<T>
  ): Group<T> {
    return new Group<T>(entry, init, databaseConstructor);
  }
}
