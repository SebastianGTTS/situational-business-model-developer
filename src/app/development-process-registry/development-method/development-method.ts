import { DatabaseModel } from '../../database/database-model';
import { Author, AuthorEntry, AuthorInit } from '../../model/author';
import {
  SituationalFactor,
  SituationalFactorEntry,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import {
  Artifact,
  ArtifactEntry,
  ArtifactInit,
} from '../method-elements/artifact/artifact';
import { Type, TypeEntry, TypeInit } from '../method-elements/type/type';
import {
  Stakeholder,
  StakeholderEntry,
  StakeholderInit,
} from '../method-elements/stakeholder/stakeholder';
import { Tool, ToolEntry, ToolInit } from '../method-elements/tool/tool';
import {
  MultipleSelection,
  MultipleSelectionEntry,
  MultipleSelectionInit,
} from './multiple-selection';
import {
  ExecutionStep,
  ExecutionStepEntry,
  ExecutionStepInit,
} from './execution-step';
import {
  MultipleMappingSelection,
  MultipleMappingSelectionEntry,
  MultipleMappingSelectionInit,
} from './multiple-mapping-selection';
import { Selection, SelectionEntry, SelectionInit } from './selection';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';

export interface DevelopmentMethodInit extends DatabaseRootInit {
  name: string;
  description?: string;
  examples?: string[];
  author: AuthorInit;

  types?: SelectionInit<TypeInit>[];
  situationalFactors?: SelectionInit<SituationalFactorInit>[];

  inputArtifacts?: MultipleMappingSelectionInit<ArtifactInit>[][];
  outputArtifacts?: MultipleSelectionInit<ArtifactInit>[][];
  stakeholders?: MultipleSelectionInit<StakeholderInit>[][];
  tools?: MultipleSelectionInit<ToolInit>[][];

  executionSteps?: ExecutionStepInit[];
}

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

export class DevelopmentMethod
  extends DatabaseModel
  implements DevelopmentMethodInit
{
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

  constructor(
    entry: DevelopmentMethodEntry | undefined,
    init: DevelopmentMethodInit | undefined
  ) {
    super(entry, init, DevelopmentMethod.typeName);
    const element = entry ?? init;
    this.name = element.name;
    this.description = element.description;
    this.examples = element.examples ?? this.examples;
    if (entry != null) {
      this.author = new Author(entry.author, undefined);
      this.types =
        entry.types?.map(
          (selection) => new Selection<Type>(selection, undefined, Type)
        ) ?? this.types;
      this.situationalFactors =
        entry.situationalFactors?.map(
          (selection) =>
            new Selection<SituationalFactor>(
              selection,
              undefined,
              SituationalFactor
            )
        ) ?? this.situationalFactors;
      this.inputArtifacts =
        entry.inputArtifacts?.map((group) =>
          group.map(
            (inputArtifact) =>
              new MultipleMappingSelection(inputArtifact, undefined, Artifact)
          )
        ) ?? this.inputArtifacts;
      this.outputArtifacts =
        entry.outputArtifacts?.map((group) =>
          group.map(
            (outputArtifact) =>
              new MultipleSelection(outputArtifact, undefined, Artifact)
          )
        ) ?? this.outputArtifacts;
      this.stakeholders =
        entry.stakeholders?.map((group) =>
          group.map(
            (stakeholder) =>
              new MultipleSelection(stakeholder, undefined, Stakeholder)
          )
        ) ?? this.stakeholders;
      this.tools =
        entry.tools?.map((group) =>
          group.map((tool) => new MultipleSelection(tool, undefined, Tool))
        ) ?? this.tools;
      this.executionSteps =
        entry.executionSteps?.map(
          (executionStep) => new ExecutionStep(executionStep, undefined)
        ) ?? this.executionSteps;
    } else {
      this.author = new Author(undefined, init.author);
      this.types =
        init.types?.map(
          (selection) => new Selection<Type>(undefined, selection, Type)
        ) ?? this.types;
      this.situationalFactors =
        init.situationalFactors?.map(
          (selection) =>
            new Selection<SituationalFactor>(
              undefined,
              selection,
              SituationalFactor
            )
        ) ?? this.situationalFactors;
      this.inputArtifacts =
        init.inputArtifacts?.map((group) =>
          group.map(
            (inputArtifact) =>
              new MultipleMappingSelection(undefined, inputArtifact, Artifact)
          )
        ) ?? this.inputArtifacts;
      this.outputArtifacts =
        init.outputArtifacts?.map((group) =>
          group.map(
            (outputArtifact) =>
              new MultipleSelection(undefined, outputArtifact, Artifact)
          )
        ) ?? this.outputArtifacts;
      this.stakeholders =
        init.stakeholders?.map((group) =>
          group.map(
            (stakeholder) =>
              new MultipleSelection(undefined, stakeholder, Stakeholder)
          )
        ) ?? this.stakeholders;
      this.tools =
        init.tools?.map((group) =>
          group.map((tool) => new MultipleSelection(undefined, tool, Tool))
        ) ?? this.tools;
      this.executionSteps =
        init.executionSteps?.map(
          (executionStep) => new ExecutionStep(undefined, executionStep)
        ) ?? this.executionSteps;
    }
  }

  /**
   * Update this development method with new values
   *
   * @param developmentMethod the new values of this development method (values will be copied to the current object)
   */
  update(developmentMethod: Partial<DevelopmentMethod>): void {
    Object.assign(this, developmentMethod);
    this.author = new Author(undefined, this.author);
    this.types = this.types.map(
      (selection) => new Selection(undefined, selection, Type)
    );
    this.situationalFactors = this.situationalFactors.map(
      (selection) => new Selection(undefined, selection, SituationalFactor)
    );
    this.inputArtifacts = this.inputArtifacts.map((group) =>
      group.map(
        (artifact) =>
          new MultipleMappingSelection<Artifact>(undefined, artifact, Artifact)
      )
    );
    this.outputArtifacts = this.outputArtifacts.map((group) =>
      group.map(
        (artifact) =>
          new MultipleSelection<Artifact>(undefined, artifact, Artifact)
      )
    );
    this.stakeholders = this.stakeholders.map((group) =>
      group.map(
        (stakeholder) =>
          new MultipleSelection<Stakeholder>(
            undefined,
            stakeholder,
            Stakeholder
          )
      )
    );
    this.tools = this.tools.map((group) =>
      group.map((tool) => new MultipleSelection<Tool>(undefined, tool, Tool))
    );
    this.executionSteps = this.executionSteps.map(
      (step) => new ExecutionStep(undefined, step)
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
