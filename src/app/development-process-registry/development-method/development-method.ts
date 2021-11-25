import { DatabaseModel } from '../../database/database-model';
import { Author, AuthorEntry } from '../../model/author';
import {
  SituationalFactor,
  SituationalFactorEntry,
} from '../method-elements/situational-factor/situational-factor';
import { Artifact, ArtifactEntry } from '../method-elements/artifact/artifact';
import { Type, TypeEntry } from '../method-elements/type/type';
import {
  Stakeholder,
  StakeholderEntry,
} from '../method-elements/stakeholder/stakeholder';
import { Tool, ToolEntry } from '../method-elements/tool/tool';
import {
  MultipleSelection,
  MultipleSelectionEntry,
} from './multiple-selection';
import { ExecutionStep, ExecutionStepEntry } from './execution-step';
import {
  MultipleMappingSelection,
  MultipleMappingSelectionEntry,
} from './multiple-mapping-selection';
import { Selection, SelectionEntry } from './selection';
import { DatabaseRootEntry } from '../../database/database-entry';

export interface DevelopmentMethodEntry extends DatabaseRootEntry {
  name: string;
  description: string;
  examples: string[];
  author: AuthorEntry;

  types: SelectionEntry<TypeEntry>[];
  situationalFactors: SelectionEntry<SituationalFactorEntry>[];

  inputArtifacts: MultipleMappingSelectionEntry<ArtifactEntry>[][];
  outputArtifacts: MultipleSelectionEntry<ArtifactEntry>[][];
  stakeholders: MultipleSelectionEntry<StakeholderEntry>[][];
  tools: MultipleSelectionEntry<ToolEntry>[][];

  executionSteps: ExecutionStepEntry[];
}

export class DevelopmentMethod extends DatabaseModel {
  static readonly typeName = 'DevelopmentMethod';

  name: string;
  description: string;
  examples: string[] = [];
  author: Author;

  types: Selection<Type>[] = [];
  situationalFactors: Selection<SituationalFactor>[] = [];

  inputArtifacts: MultipleMappingSelection<Artifact>[][] = [];
  outputArtifacts: MultipleSelection<Artifact>[][] = [];
  stakeholders: MultipleSelection<Stakeholder>[][] = [];
  tools: MultipleSelection<Tool>[][] = [];

  executionSteps: ExecutionStep[] = [];

  constructor(developmentMethod: Partial<DevelopmentMethod>) {
    super(DevelopmentMethod.typeName);
    this.update(developmentMethod);
  }

  /**
   * Update this development method with new values
   *
   * @param developmentMethod the new values of this development method (values will be copied to the current object)
   */
  update(developmentMethod: Partial<DevelopmentMethod>): void {
    Object.assign(this, developmentMethod);
    this.author = new Author(this.author);
    this.types = this.types.map(
      (selection) => new Selection(selection, (element) => new Type(element))
    );
    this.situationalFactors = this.situationalFactors.map(
      (selection) =>
        new Selection(selection, (element) => new SituationalFactor(element))
    );
    this.inputArtifacts = this.inputArtifacts.map((group) =>
      group.map(
        (artifact) =>
          new MultipleMappingSelection<Artifact>(
            artifact,
            (a) => new Artifact(a)
          )
      )
    );
    this.outputArtifacts = this.outputArtifacts.map((group) =>
      group.map(
        (artifact) =>
          new MultipleSelection<Artifact>(artifact, (a) => new Artifact(a))
      )
    );
    this.stakeholders = this.stakeholders.map((group) =>
      group.map(
        (stakeholder) =>
          new MultipleSelection<Stakeholder>(
            stakeholder,
            (s) => new Stakeholder(s)
          )
      )
    );
    this.tools = this.tools.map((group) =>
      group.map((tool) => new MultipleSelection<Tool>(tool, (t) => new Tool(t)))
    );
    this.executionSteps = this.executionSteps.map(
      (step) => new ExecutionStep(step)
    );
  }

  /**
   * Check whether this step has all input artifacts available
   *
   * @param step the step to check
   * @param size the size of the input artifacts
   */
  checkStepInputArtifacts(
    step: number,
    size: number
  ): { isStep: boolean; index: number; artifact: number }[][] {
    const artifactDefined: {
      isStep: boolean;
      index: number;
      artifact: number;
    }[][] = [];
    artifactDefined.length = size;
    artifactDefined.fill([]);

    // check step mappings
    for (let i = 0; i < this.executionSteps.length; i++) {
      const executionStep = this.executionSteps[i];
      for (let j = 0; j < executionStep.outputMappings.length; j++) {
        const outputArtifact = executionStep.outputMappings[j];
        for (const mapping of outputArtifact) {
          if (
            mapping.output === false &&
            mapping.step === step &&
            mapping.artifact < artifactDefined.length
          ) {
            artifactDefined[mapping.artifact].push({
              isStep: true,
              index: i,
              artifact: j,
            });
          }
        }
      }
    }

    // check input groups
    for (let i = 0; i < this.inputArtifacts.length; i++) {
      const inputGroup = this.inputArtifacts[i];
      for (let j = 0; j < inputGroup.length; j++) {
        const artifact = inputGroup[j];
        for (const mapping of artifact.mapping) {
          if (mapping.output === false && mapping.step === step) {
            artifactDefined[mapping.artifact].push({
              isStep: false,
              index: i,
              artifact: j,
            });
          }
        }
      }
    }

    return artifactDefined;
  }

  /**
   * Get all tool names no matter in which group they are
   */
  getAllToolNames(): Set<string> {
    const tools: Set<string> = new Set<string>();
    this.tools.forEach((toolGroup) =>
      toolGroup.forEach((tool) => {
        if (tool.element != null) {
          tools.add(tool.element.name);
        }
      })
    );
    return tools;
  }

  toDb(): DevelopmentMethodEntry {
    return {
      ...super.toDb(),
      name: this.name,
      description: this.description,
      examples: this.examples,
      author: this.author.toDb(),
      types: this.types.map((type) => type.toDb()),
      situationalFactors: this.situationalFactors.map((factor) =>
        factor.toDb()
      ),
      inputArtifacts: this.inputArtifacts.map((group) =>
        group.map((artifact) => artifact.toDb())
      ),
      outputArtifacts: this.outputArtifacts.map((group) =>
        group.map((artifact) => artifact.toDb())
      ),
      stakeholders: this.stakeholders.map((group) =>
        group.map((element) => element.toDb())
      ),
      tools: this.tools.map((group) => group.map((tool) => tool.toDb())),
      executionSteps: this.executionSteps.map((step) => step.toDb()),
    };
  }
}
