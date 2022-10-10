import {
  DevelopmentMethod,
  DevelopmentMethodEntry,
  DevelopmentMethodInit,
} from '../development-method/development-method';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import { Artifact, ArtifactEntry } from '../method-elements/artifact/artifact';
import {
  Stakeholder,
  StakeholderEntry,
} from '../method-elements/stakeholder/stakeholder';
import { Tool, ToolEntry } from '../method-elements/tool/tool';
import {
  GroupDecision,
  GroupDecisionEntry,
  GroupDecisionInit,
} from './group-decision';
import { StepDecision } from '../module-api/module-method';
import {
  ArtifactGroupDecision,
  ArtifactGroupDecisionEntry,
  ArtifactGroupDecisionInit,
} from './artifact-group-decision';

export interface MethodDecisionInit extends DatabaseInit {
  method: Readonly<DevelopmentMethodInit>;
  inputArtifacts?: ArtifactGroupDecisionInit;
  outputArtifacts?: GroupDecisionInit<Artifact>;
  stakeholders?: GroupDecisionInit<Stakeholder>;
  tools?: GroupDecisionInit<Tool>;

  stepDecisions?: (StepDecision | undefined)[];
}

export interface MethodDecisionEntry extends DatabaseEntry {
  method: DevelopmentMethodEntry;
  inputArtifacts: ArtifactGroupDecisionEntry;
  outputArtifacts: GroupDecisionEntry<ArtifactEntry>;
  stakeholders: GroupDecisionEntry<StakeholderEntry>;
  tools: GroupDecisionEntry<ToolEntry>;

  stepDecisions: (StepDecision | undefined)[];
}

/**
 * Only used to update the method decision
 */
export interface MethodDecisionUpdate {
  inputArtifacts?: ArtifactGroupDecisionInit;
  outputArtifacts?: GroupDecisionInit<Artifact>;
  stakeholders?: GroupDecisionInit<Stakeholder>;
  tools?: GroupDecisionInit<Tool>;

  stepDecisions?: (StepDecision | undefined)[];
}

/**
 * Decides on one method.
 */
export class MethodDecision implements MethodDecisionInit, DatabaseModelPart {
  method: Readonly<DevelopmentMethod>;
  inputArtifacts: ArtifactGroupDecision;
  outputArtifacts: GroupDecision<Artifact>;
  stakeholders: GroupDecision<Stakeholder>;
  tools: GroupDecision<Tool>;

  stepDecisions: (StepDecision | undefined)[];

  constructor(
    entry: MethodDecisionEntry | undefined,
    init: MethodDecisionInit | undefined
  ) {
    if (entry != null) {
      this.method = new DevelopmentMethod(entry.method, undefined);
      this.inputArtifacts = new ArtifactGroupDecision(
        entry.inputArtifacts,
        undefined,
        this.method.inputArtifacts
      );
      this.outputArtifacts = new GroupDecision<Artifact>(
        entry.outputArtifacts,
        undefined,
        Artifact,
        this.method.outputArtifacts
      );
      this.stakeholders = new GroupDecision<Stakeholder>(
        entry.stakeholders,
        undefined,
        Stakeholder,
        this.method.stakeholders
      );
      this.tools = new GroupDecision<Tool>(
        entry.tools,
        undefined,
        Tool,
        this.method.tools
      );
      this.stepDecisions = entry.stepDecisions;
    } else if (init != null) {
      this.method = new DevelopmentMethod(undefined, init.method);
      this.inputArtifacts = new ArtifactGroupDecision(
        undefined,
        init.inputArtifacts ?? {},
        this.method.inputArtifacts
      );
      this.outputArtifacts = new GroupDecision<Artifact>(
        undefined,
        init.outputArtifacts ?? {},
        Artifact,
        this.method.outputArtifacts
      );
      this.stakeholders = new GroupDecision<Stakeholder>(
        undefined,
        init.stakeholders ?? {},
        Stakeholder,
        this.method.stakeholders
      );
      this.tools = new GroupDecision<Tool>(
        undefined,
        init.tools ?? {},
        Tool,
        this.method.tools
      );
      if (
        init.stepDecisions != null &&
        init.stepDecisions.length === this.method.executionSteps.length
      ) {
        this.stepDecisions = init.stepDecisions;
      } else {
        this.stepDecisions = this.method.executionSteps.map(() => undefined);
      }
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  update(methodDecision: MethodDecisionUpdate): void {
    if (methodDecision.inputArtifacts != null) {
      this.inputArtifacts = new ArtifactGroupDecision(
        undefined,
        methodDecision.inputArtifacts,
        this.method.inputArtifacts
      );
    }
    if (methodDecision.outputArtifacts != null) {
      this.outputArtifacts = new GroupDecision<Artifact>(
        undefined,
        methodDecision.outputArtifacts,
        Artifact,
        this.method.outputArtifacts
      );
    }
    if (methodDecision.stakeholders != null) {
      this.stakeholders = new GroupDecision<Stakeholder>(
        undefined,
        methodDecision.stakeholders,
        Stakeholder,
        this.method.stakeholders
      );
    }
    if (methodDecision.tools != null) {
      this.tools = new GroupDecision<Tool>(
        undefined,
        methodDecision.tools,
        Tool,
        this.method.tools
      );
    }
    if (methodDecision.stepDecisions != null) {
      this.stepDecisions = methodDecision.stepDecisions;
    }
  }

  /**
   * Whether the decision fulfills all constraints.
   */
  isComplete(): boolean {
    return (
      this.inputArtifacts.isComplete() &&
      this.outputArtifacts.isComplete() &&
      this.stakeholders.isComplete() &&
      this.tools.isComplete()
    );
  }

  toDb(): MethodDecisionEntry {
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
