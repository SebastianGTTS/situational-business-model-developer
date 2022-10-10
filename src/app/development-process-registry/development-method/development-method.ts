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
import { Selection, SelectionEntry, SelectionInit } from './selection';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';
import { Groups, GroupsEntry, GroupsInit } from './groups';
import {
  ArtifactGroups,
  ArtifactGroupsEntry,
  ArtifactGroupsInit,
} from './artifact-groups';
import {
  createExecutionStep,
  ExecutionStep,
  ExecutionStepEntry,
  ExecutionStepInit,
  isMethodExecutionStep,
} from './execution-step';

export interface DevelopmentMethodInit extends DatabaseRootInit {
  name: string;
  description?: string;
  examples?: string[];
  author: AuthorInit;

  types?: SelectionInit<TypeInit>[];
  situationalFactors?: SelectionInit<SituationalFactorInit>[];

  inputArtifacts?: ArtifactGroupsInit;
  outputArtifacts?: GroupsInit<ArtifactInit>;
  stakeholders?: GroupsInit<StakeholderInit>;
  tools?: GroupsInit<ToolInit>;

  executionSteps?: ExecutionStepInit[];
}

export interface DevelopmentMethodEntry extends DatabaseRootEntry {
  name: string;
  description: string;
  examples: string[];
  author: AuthorEntry;

  types: SelectionEntry<TypeEntry>[];
  situationalFactors: SelectionEntry<SituationalFactorEntry>[];

  inputArtifacts: ArtifactGroupsEntry;
  outputArtifacts: GroupsEntry<ArtifactEntry>;
  stakeholders: GroupsEntry<StakeholderEntry>;
  tools: GroupsEntry<ToolEntry>;

  executionSteps: ExecutionStepEntry[];
}

export class DevelopmentMethod
  extends DatabaseModel
  implements DevelopmentMethodInit
{
  static readonly typeName = 'DevelopmentMethod';

  name: string;
  description = '';
  examples: string[] = [];
  author: Author;

  types: Selection<Type>[] = [];
  situationalFactors: Selection<SituationalFactor>[] = [];

  inputArtifacts: ArtifactGroups;
  outputArtifacts: Groups<Artifact>;
  stakeholders: Groups<Stakeholder>;
  tools: Groups<Tool>;

  executionSteps: ExecutionStep[] = [];

  constructor(
    entry: DevelopmentMethodEntry | undefined,
    init: DevelopmentMethodInit | undefined
  ) {
    super(entry, init, DevelopmentMethod.typeName);
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.name = element.name;
    this.description = element.description ?? this.description;
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
      this.inputArtifacts = new ArtifactGroups(entry.inputArtifacts, undefined);
      this.outputArtifacts = new Groups<Artifact>(
        entry.outputArtifacts,
        undefined,
        Artifact
      );
      this.stakeholders = new Groups<Stakeholder>(
        entry.stakeholders,
        undefined,
        Stakeholder
      );
      this.tools = new Groups<Tool>(entry.tools, undefined, Tool);
      this.executionSteps =
        entry.executionSteps?.map((executionStep) =>
          createExecutionStep(executionStep, undefined)
        ) ?? this.executionSteps;
    } else if (init != null) {
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
      this.inputArtifacts = new ArtifactGroups(
        undefined,
        init.inputArtifacts ?? {}
      );
      this.outputArtifacts = new Groups<Artifact>(
        undefined,
        init.outputArtifacts ?? {},
        Artifact
      );
      this.stakeholders = new Groups<Stakeholder>(
        undefined,
        init.stakeholders ?? {},
        Stakeholder
      );
      this.tools = new Groups<Tool>(undefined, init.tools ?? {}, Tool);
      this.executionSteps =
        init.executionSteps?.map((executionStep) =>
          createExecutionStep(undefined, executionStep)
        ) ?? this.executionSteps;
    } else {
      throw new Error('Either entry or init must be provided.');
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
    this.inputArtifacts = new ArtifactGroups(undefined, this.inputArtifacts);
    this.outputArtifacts = new Groups<Artifact>(
      undefined,
      this.outputArtifacts,
      Artifact
    );
    this.stakeholders = new Groups<Stakeholder>(
      undefined,
      this.stakeholders,
      Stakeholder
    );
    this.tools = new Groups<Tool>(undefined, this.tools, Tool);
    this.executionSteps = this.executionSteps.map((step) =>
      createExecutionStep(undefined, step)
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
      if (isMethodExecutionStep(executionStep)) {
        for (let j = 0; j < executionStep.outputMappings.length; j++) {
          const outputArtifact = executionStep.outputMappings[j];
          for (const mapping of outputArtifact) {
            if (
              !mapping.output &&
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
    }

    // check input groups
    for (let i = 0; i < this.inputArtifacts.groups.length; i++) {
      const inputGroup = this.inputArtifacts.groups[i];
      for (let j = 0; j < inputGroup.items.length; j++) {
        const artifact = inputGroup.items[j];
        for (const mapping of artifact.mapping) {
          if (
            !mapping.output &&
            mapping.step === step &&
            mapping.artifact < artifactDefined.length
          ) {
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
    this.tools.groups.forEach((toolGroup) =>
      toolGroup.items.forEach((tool) => {
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
      inputArtifacts: this.inputArtifacts.toDb(),
      outputArtifacts: this.outputArtifacts.toDb(),
      stakeholders: this.stakeholders.toDb(),
      tools: this.tools.toDb(),
      executionSteps: this.executionSteps.map((step) => step.toDb()),
    };
  }
}
