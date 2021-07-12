import { DevelopmentMethod } from '../development-method/development-method';
import { Artifact } from '../method-elements/artifact/artifact';
import { Stakeholder } from '../method-elements/stakeholder/stakeholder';
import { Tool } from '../method-elements/tool/tool';
import { MethodElement } from '../method-elements/method-element';
import { MultipleSelection } from '../development-method/multiple-selection';

export class GroupSummary<T extends MethodElement> {
  elements: {
    list: string,
    elements: T[],
    multiple: boolean,
    multipleElements: boolean,
  }[];
}

export class GroupSelection<T extends MethodElement> {
  selectedGroup: number = null;
  elements: T[][] = null;

  constructor(groupSelection: Partial<GroupSelection<T>>, createElement: (element: Partial<T>) => T) {
    this.update(groupSelection, createElement);
  }

  update(groupSelection: Partial<GroupSelection<T>>, createElement: (element: Partial<T>) => T) {
    Object.assign(this, groupSelection);
    this.elements = this.elements
      ? this.elements.map((element) =>
        element
          ? element.map((e) =>
            e ? createElement(e) : null
          )
          : null
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

  toPouchDb(): any {
    return {
      selectedGroup: this.selectedGroup,
      elements: this.elements
        ? this.elements.map((element) =>
          element
            ? element.map((e) =>
              e ? e.toPouchDb() : null
            )
            : null
        )
        : null,
    };
  }
}

export class Decision {

  method: DevelopmentMethod;
  inputArtifacts: GroupSelection<Artifact>;
  outputArtifacts: GroupSelection<Artifact>;
  stakeholders: GroupSelection<Stakeholder>;
  tools: GroupSelection<Tool>;

  stepDecisions: any[];

  constructor(decision: Partial<Decision>) {
    this.update(decision);
  }

  update(decision: Partial<Decision>) {
    Object.assign(this, decision);
    this.method = new DevelopmentMethod(this.method);
    this.inputArtifacts = new GroupSelection<Artifact>(this.inputArtifacts, (artifact) => new Artifact(artifact));
    this.outputArtifacts = new GroupSelection<Artifact>(this.outputArtifacts, (artifact) => new Artifact(artifact));
    this.stakeholders = new GroupSelection<Stakeholder>(this.stakeholders, (stakeholder) => new Stakeholder(stakeholder));
    this.tools = new GroupSelection<Tool>(this.tools, (tool) => new Tool(tool));
  }

  isComplete(): boolean {
    return this.inputArtifacts.isComplete(this.method.inputArtifacts) &&
      this.outputArtifacts.isComplete(this.method.outputArtifacts) &&
      this.stakeholders.isComplete(this.method.stakeholders) &&
      this.tools.isComplete(this.method.tools);
  }

  getSummary(): {
    inputArtifacts: GroupSummary<Artifact>,
    outputArtifacts: GroupSummary<Artifact>,
    stakeholders: GroupSummary<Stakeholder>,
    tools: GroupSummary<Tool>
  } {
    return {
      inputArtifacts: this.inputArtifacts.getList(this.method.inputArtifacts),
      outputArtifacts: this.outputArtifacts.getList(this.method.outputArtifacts),
      stakeholders: this.stakeholders.getList(this.method.stakeholders),
      tools: this.tools.getList(this.method.tools),
    };
  }

  toPouchDb(): any {
    return {
      method: this.method.toPouchDb(),
      inputArtifacts: this.inputArtifacts.toPouchDb(),
      outputArtifacts: this.outputArtifacts.toPouchDb(),
      stakeholders: this.stakeholders.toPouchDb(),
      tools: this.tools.toPouchDb(),
      stepDecisions: this.stepDecisions,
    };
  }

}
