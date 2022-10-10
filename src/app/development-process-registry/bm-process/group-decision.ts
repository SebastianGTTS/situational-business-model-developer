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
} from '../method-elements/method-element';
import { Groups } from '../development-method/groups';
import { Group } from '../development-method/group';
import {
  ElementDecision,
  ElementDecisionEntry,
  ElementDecisionInit,
  SelectedElementOptional,
} from './element-decision';
import { Equality } from '../../shared/equality';

export interface GroupDecisionInit<T extends MethodElement>
  extends DatabaseInit {
  group?: Readonly<Group<T>> | null;
  groupIndex?: number | null;
  elementDecisions?: ElementDecisionInit<T>[];
}

export interface GroupDecisionEntry<T extends MethodElementEntry>
  extends DatabaseEntry {
  group?: number;
  elementDecisions?: ElementDecisionEntry<T>[];
}

/**
 * Decides which group to select and stores element decisions for the items
 * of that group
 */
export class GroupDecision<T extends MethodElement>
  implements
    GroupDecisionInit<T>,
    DatabaseModelPart,
    Equality<GroupDecision<T>>
{
  /**
   * The selected group of groups.
   * If undefined then elementDecisions is also undefined.
   */
  group?: Readonly<Group<T>> | null;
  /**
   * The decisions for the items of the selected group.
   * If undefined then group is also undefined.
   * Should have the same length as items in group.
   */
  elementDecisions?: ElementDecision<T>[];

  constructor(
    entry: GroupDecisionEntry<EntryType<T>> | undefined,
    init: GroupDecisionInit<InitType<T>> | undefined,
    private readonly databaseConstructor: DatabaseConstructor<T>,
    readonly groups: Readonly<Groups<T>>
  ) {
    if (entry != null) {
      if (entry.group != null) {
        this.group = this.groups.groups[entry.group];
        if (
          entry.elementDecisions != null &&
          entry.elementDecisions.length === this.group.items.length
        ) {
          this.elementDecisions = entry.elementDecisions.map(
            (decision, index) =>
              new ElementDecision<T>(
                decision,
                undefined,
                databaseConstructor,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.group!.items[index]
              )
          );
        } else {
          throw new Error('Group Decision Entry is broken');
        }
      }
    } else if (init != null) {
      if (
        this.groups.allowNone &&
        (init.groupIndex === null || init.group === null)
      ) {
        this.group = null;
      } else if (init.groupIndex != null) {
        this.group = this.groups.groups[init.groupIndex];
      } else if (init.group != null) {
        const index = this.groups.groups.indexOf(init.group as Group<T>);
        if (index != -1) {
          this.group = this.groups.groups[index];
        } else {
          throw new Error('Group Init specifies invalid group');
        }
      } else if (this.groups.defaultGroup != null) {
        this.group = this.groups.defaultGroup;
      }
      if (this.group != null) {
        if (
          init.elementDecisions != null &&
          init.elementDecisions.length === this.group.items.length
        ) {
          this.elementDecisions = init.elementDecisions.map(
            (decision, index) =>
              new ElementDecision<T>(
                undefined,
                decision,
                databaseConstructor,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.group!.items[index]
              )
          );
        } else {
          this.elementDecisions = this.group.items.map(
            (item, index) =>
              new ElementDecision<T>(
                undefined,
                {},
                databaseConstructor,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.group!.items[index]
              )
          );
        }
      }
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  set groupIndex(index: number | undefined | null) {
    if (this.groups.allowNone && index === null) {
      this.group = null;
      this.elementDecisions = undefined;
    } else if (index == null) {
      this.group = undefined;
      this.elementDecisions = undefined;
    } else {
      this.group = this.groups.groups[index];
      this.elementDecisions = this.group.items.map(
        (item, itemIndex) =>
          new ElementDecision<T>(
            undefined,
            {},
            this.databaseConstructor,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.group!.items[itemIndex]
          )
      );
    }
  }

  get groupIndex(): number | undefined | null {
    if (this.group != null) {
      return this.groups.groups.indexOf(this.group as Group<T>);
    } else if (this.groups.allowNone && this.group === null) {
      return null;
    } else {
      return undefined;
    }
  }

  /**
   * Get the selected elements of every item of this group.
   *
   * @return the selected elements or an empty list if no group is selected
   * or no elements are selected.
   */
  getSelectedElements(): T[] {
    if (this.group == null || this.elementDecisions == null) {
      return [];
    }
    return this.elementDecisions.reduce(
      (elements: T[], elementDecision: ElementDecision<T>) =>
        elements.concat(elementDecision.getSelectedElements()),
      []
    );
  }

  /**
   * Get the selected elements of every item of this group and per item whether it is optional or not.
   *
   * @return the selected elements or an empty list if no group is selected
   * or no elements are selected.
   */
  getSelectedElementsOptional(): SelectedElementOptional<T>[] {
    if (this.group == null || this.elementDecisions == null) {
      return [];
    }
    return this.elementDecisions.reduce(
      (
        elements: SelectedElementOptional<T>[],
        elementDecision: ElementDecision<T>
      ) => elements.concat(elementDecision.getSelectedElementsOptional()),
      []
    );
  }

  /**
   * Whether the decision fulfills all constraints.
   */
  isComplete(): boolean {
    if (this.groups.groups.length === 0) {
      return true;
    }
    if (this.group == null || this.elementDecisions == null) {
      return this.groups.allowNone;
    }
    return this.elementDecisions.every((decision) => decision.isComplete());
  }

  equals(other: GroupDecision<T> | undefined): boolean {
    if (other == null) {
      return false;
    }
    if (this.group != null && this.elementDecisions != null) {
      return (
        this.group.equals(other.group as Group<T>) &&
        this.elementDecisions.every((decision, index) =>
          decision.equals(other.elementDecisions?.[index])
        )
      );
    } else {
      return other.group == null && other.elementDecisions == null;
    }
  }

  toDb(): GroupDecisionEntry<EntryType<T>> {
    return {
      group:
        this.group != null
          ? this.groups.groups.indexOf(this.group as Group<T>)
          : undefined,
      elementDecisions: this.elementDecisions?.map((decision) =>
        decision.toDb()
      ),
    };
  }
}
