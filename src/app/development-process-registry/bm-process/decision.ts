import {
  DevelopmentMethod,
  DevelopmentMethodEntry,
} from '../development-method/development-method';
import { Artifact, ArtifactEntry } from '../method-elements/artifact/artifact';
import {
  Stakeholder,
  StakeholderEntry,
} from '../method-elements/stakeholder/stakeholder';
import { Tool, ToolEntry } from '../method-elements/tool/tool';
import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-elements/method-element';
import { MultipleSelection } from '../development-method/multiple-selection';
import { Equality } from '../../shared/equality';
import { equalsList } from '../../shared/utils';
import {
  DatabaseConstructor,
  DatabaseModelPart,
  EntryType,
  InitType,
} from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface ElementSummary<T extends MethodElement> {
  list: string;
  elements: T[];
  multiple: boolean;
  multipleElements: boolean;
}

export class GroupSummary<T extends MethodElement> {
  elements: ElementSummary<T>[];
}

export interface GroupSelectionInit<T extends MethodElementInit>
  extends DatabaseInit {
  selectedGroup?: number;
  elements?: T[][];
}

export interface GroupSelectionEntry<T extends MethodElementEntry>
  extends DatabaseEntry {
  selectedGroup: number;
  elements: T[][];
}

export class GroupSelection<T extends MethodElement>
  implements
    GroupSelectionInit<T>,
    Equality<GroupSelection<T>>,
    DatabaseModelPart
{
  selectedGroup: number = null;
  elements: T[][] = null;

  constructor(
    entry: GroupSelectionEntry<EntryType<T>>,
    init: GroupSelectionInit<InitType<T> & MethodElementInit>,
    databaseConstructor: DatabaseConstructor<T>
  ) {
    this.selectedGroup = (entry ?? init).selectedGroup ?? this.selectedGroup;
    if (entry != null) {
      this.elements =
        entry.elements?.map(
          (element) =>
            element?.map((e) =>
              e ? new databaseConstructor(e, undefined) : undefined
            ) ?? undefined
        ) ?? this.elements;
    } else if (init != null) {
      this.elements =
        init.elements?.map(
          (element) =>
            element?.map((e) =>
              e ? new databaseConstructor(undefined, e) : undefined
            ) ?? undefined
        ) ?? this.elements;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  update(
    groupSelection: Partial<GroupSelection<T>>,
    createElement: (element: Partial<T>) => T
  ): void {
    Object.assign(this, groupSelection);
    this.elements = this.elements
      ? this.elements.map((element) =>
          element ? element.map((e) => (e ? createElement(e) : null)) : null
        )
      : null;
  }

  isComplete(providedByMethod: MultipleSelection<T>[][]): boolean {
    if (providedByMethod.length === 0) {
      return true;
    }
    if (this.selectedGroup === null || this.selectedGroup === undefined) {
      return false;
    }
    const group = providedByMethod[this.selectedGroup];
    return group.every((element, index) => {
      if (element.element || element.multiple) {
        return true;
      }
      return this.elements[index] && !!this.elements[index][0];
    });
  }

  getList(providedByMethod: MultipleSelection<T>[][]): GroupSummary<T> {
    const summary: GroupSummary<T> = {
      elements: [],
    };
    if (this.selectedGroup === null || this.selectedGroup === undefined) {
      return summary;
    }
    const group = providedByMethod[this.selectedGroup];
    summary.elements = group.map((element, index) => {
      const part = {
        list: element.list,
        elements: [],
        multiple: element.multiple,
        multipleElements: element.multipleElements,
      };
      if (element.element) {
        part.elements = [element.element];
      } else if (this.elements) {
        part.elements = this.elements[index];
      }
      return part;
    });
    return summary;
  }

  toDb(): GroupSelectionEntry<ReturnType<T['toDb']>> {
    return {
      selectedGroup: this.selectedGroup,
      elements: this.elements
        ? this.elements.map((element) =>
            element
              ? element.map((e) =>
                  e ? (e.toDb() as ReturnType<T['toDb']>) : null
                )
              : null
          )
        : null,
    };
  }

  /**
   * Checks whether this group selection equals another
   *
   * @param other the other group selection
   * @return whether they are equal
   */
  equals(other: GroupSelection<T>): boolean {
    if (other == null || other.selectedGroup !== this.selectedGroup) {
      return false;
    }
    if (other.elements === null && this.elements === null) {
      return true;
    }
    if (other.elements === null || this.elements === null) {
      return false;
    }
    for (let i = 0; i < this.elements.length; i++) {
      const thisElementGroup = this.elements[i];
      const otherElementGroup = other.elements[i];
      if (!equalsList(thisElementGroup, otherElementGroup)) {
        return false;
      }
    }
    return true;
  }
}

export interface DecisionInit extends DatabaseInit {
  method: DevelopmentMethod;
  inputArtifacts: GroupSelectionInit<Artifact>;
  outputArtifacts: GroupSelectionInit<Artifact>;
  stakeholders: GroupSelectionInit<Stakeholder>;
  tools: GroupSelectionInit<Tool>;

  stepDecisions: any[];
}

export interface DecisionEntry extends DatabaseEntry {
  method: DevelopmentMethodEntry;
  inputArtifacts: GroupSelectionEntry<ArtifactEntry>;
  outputArtifacts: GroupSelectionEntry<ArtifactEntry>;
  stakeholders: GroupSelectionEntry<StakeholderEntry>;
  tools: GroupSelectionEntry<ToolEntry>;
  stepDecisions: any[];
}

export class Decision implements DatabaseModelPart {
  method: DevelopmentMethod;
  inputArtifacts: GroupSelection<Artifact>;
  outputArtifacts: GroupSelection<Artifact>;
  stakeholders: GroupSelection<Stakeholder>;
  tools: GroupSelection<Tool>;

  stepDecisions: any[];

  constructor(entry: DecisionEntry, init: DecisionInit) {
    if (entry != null) {
      this.method = new DevelopmentMethod(entry.method, undefined);
      this.inputArtifacts = new GroupSelection<Artifact>(
        entry.inputArtifacts,
        undefined,
        Artifact
      );
      this.outputArtifacts = new GroupSelection<Artifact>(
        entry.outputArtifacts,
        undefined,
        Artifact
      );
      this.stakeholders = new GroupSelection<Stakeholder>(
        entry.stakeholders,
        undefined,
        Stakeholder
      );
      this.tools = new GroupSelection<Tool>(entry.tools, undefined, Tool);
    } else if (init != null) {
      this.method = new DevelopmentMethod(undefined, init.method);
      this.inputArtifacts = new GroupSelection<Artifact>(
        undefined,
        init.inputArtifacts,
        Artifact
      );
      this.outputArtifacts = new GroupSelection<Artifact>(
        undefined,
        init.outputArtifacts,
        Artifact
      );
      this.stakeholders = new GroupSelection<Stakeholder>(
        undefined,
        init.stakeholders,
        Stakeholder
      );
      this.tools = new GroupSelection<Tool>(undefined, init.tools, Tool);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.stepDecisions = (entry ?? init).stepDecisions;
  }

  update(decision: Partial<Decision>): void {
    Object.assign(this, decision);
    this.method = new DevelopmentMethod(undefined, this.method);
    this.inputArtifacts = new GroupSelection<Artifact>(
      undefined,
      this.inputArtifacts,
      Artifact
    );
    this.outputArtifacts = new GroupSelection<Artifact>(
      undefined,
      this.outputArtifacts,
      Artifact
    );
    this.stakeholders = new GroupSelection<Stakeholder>(
      undefined,
      this.stakeholders,
      Stakeholder
    );
    this.tools = new GroupSelection<Tool>(undefined, this.tools, Tool);
  }

  isComplete(): boolean {
    return (
      this.inputArtifacts.isComplete(this.method.inputArtifacts) &&
      this.outputArtifacts.isComplete(this.method.outputArtifacts) &&
      this.stakeholders.isComplete(this.method.stakeholders) &&
      this.tools.isComplete(this.method.tools)
    );
  }

  getSummary(): {
    inputArtifacts: GroupSummary<Artifact>;
    outputArtifacts: GroupSummary<Artifact>;
    stakeholders: GroupSummary<Stakeholder>;
    tools: GroupSummary<Tool>;
  } {
    return {
      inputArtifacts: this.inputArtifacts.getList(this.method.inputArtifacts),
      outputArtifacts: this.outputArtifacts.getList(
        this.method.outputArtifacts
      ),
      stakeholders: this.stakeholders.getList(this.method.stakeholders),
      tools: this.tools.getList(this.method.tools),
    };
  }

  toDb(): DecisionEntry {
    return {
      method: this.method.toDb(),
      inputArtifacts: this.inputArtifacts.toDb(),
      outputArtifacts: this.outputArtifacts.toDb(),
      stakeholders: this.stakeholders.toDb(),
      tools: this.tools.toDb(),
      stepDecisions: this.stepDecisions,
    };
  }
}
