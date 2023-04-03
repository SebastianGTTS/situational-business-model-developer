import { Experiment, ExperimentEntry, ExperimentInit } from './experiment';
import { Author, AuthorEntry, AuthorInit } from '../../../model/author';
import { DatabaseModel } from '../../../database/database-model';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../../database/database-entry';
import { IconInit } from '../../../model/icon';

export interface ExperimentDefinitionInit extends DatabaseRootInit {
  author: AuthorInit;
  experiment: ExperimentInit;
}

export interface ExperimentDefinitionEntry extends DatabaseRootEntry {
  author: AuthorEntry;
  experiment: ExperimentEntry;
}

export class ExperimentDefinition
  extends DatabaseModel
  implements ExperimentDefinitionInit
{
  static readonly typeName = 'ExperimentDefinition';

  author: Author;
  experiment: Experiment;

  constructor(
    entry: ExperimentDefinitionEntry | undefined,
    init: ExperimentDefinitionInit | undefined
  ) {
    super(entry, init, ExperimentDefinition.typeName);
    if (entry != null) {
      this.author = new Author(entry.author, undefined);
      this.experiment = new Experiment(entry.experiment, undefined, undefined);
    } else if (init != null) {
      this.author = new Author(undefined, init.author);
      this.experiment = new Experiment(undefined, init.experiment, undefined);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  /**
   * Update the author of this experiment definition with new values
   *
   * @param author the new values of the author (values will be copied to the current object)
   */
  updateAuthor(author: Partial<Author>): void {
    this.author.update(author);
  }

  /**
   * Add experiment to this experiment definition
   *
   * @param experiment the experiment to add (values will be copied to new object)
   * @param parentId the id of the parent experiment
   * @return the added experiment
   */
  addExperiment(experiment: ExperimentInit, parentId: string): Experiment {
    const parent = this.experiment.getExperiment(parentId);
    if (experiment.id == null) {
      experiment.id = this.experiment.getExperimentId(experiment.name);
    }
    return parent.addSubexperiment(experiment);
  }

  /**
   * Update an experiment of this experiment definition
   *
   * @param experimentId the id of the experiment
   * @param parentExperimentId the experiment id of the parent experiment
   * @param experiment the new values of the experiment (values will be copied to the current object)
   */
  updateExperiment(
    experimentId: string,
    parentExperimentId: string | undefined,
    experiment: Partial<Experiment>
  ): void {
    const currentExperiment = this.experiment.getExperiment(experimentId);
    const currentParent = currentExperiment.parent;
    currentExperiment.update(experiment);
    if (currentParent == null && parentExperimentId != null) {
      throw new Error('Can not move root experiment');
    }
    if (currentParent != null && parentExperimentId == null) {
      throw new Error('Can not move to root experiment');
    }
    if (
      currentParent != null &&
      parentExperimentId != null &&
      currentParent.id !== parentExperimentId
    ) {
      const newParent = this.experiment.getExperiment(parentExperimentId);
      currentParent.removeSubexperiment(experimentId);
      newParent.addSubexperiment(currentExperiment);
    }
  }

  updateIcon(experimentId: string, icon: IconInit): void {
    const experiment = this.experiment.getExperiment(experimentId);
    experiment.updateIcon(icon);
  }

  /**
   * Remove an experiment
   *
   * @param experimentId the id of the experiment
   */
  removeExperiment(experimentId: string): void {
    const experiment = this.experiment.getExperiment(experimentId);
    if (experiment.parent == null) {
      throw new Error('Can not remove the root experiment');
    }
    experiment.parent.removeSubexperiment(experiment.id);
  }

  toDb(): ExperimentDefinitionEntry {
    return {
      ...super.toDb(),
      author: this.author.toDb(),
      experiment: this.experiment.toDb(),
    };
  }
}
