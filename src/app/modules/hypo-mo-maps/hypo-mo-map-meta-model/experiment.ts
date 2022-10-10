import { getId } from '../../../model/utils';
import { DatabaseModelPart } from '../../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../../database/database-entry';

export interface ExperimentInit extends DatabaseInit {
  id: string;
  name: string;
  description?: string;
  subexperiments?: ExperimentInit[];
  artifacts?: string[];
}

export interface ExperimentEntry extends DatabaseEntry {
  id: string;
  name: string;
  description: string;
  subexperiments: ExperimentEntry[];
  artifacts: string[]; // TODO
}

export class Experiment implements ExperimentInit, DatabaseModelPart {
  // stored
  id: string;
  name: string;
  description = '';
  subexperiments: Experiment[] = [];
  artifacts: string[] = [];

  // non stored
  parent?: Experiment;
  level: number;

  constructor(
    entry: ExperimentEntry | undefined,
    init: ExperimentInit | undefined,
    parent: Experiment | undefined
  ) {
    this.parent = parent;
    this.level = this.parent ? this.parent.level + 1 : 1;
    let element;
    if (entry != null) {
      element = entry;
      this.subexperiments = entry.subexperiments.map(
        (experiment) => new Experiment(experiment, undefined, this)
      );
    } else if (init != null) {
      element = init;
      this.subexperiments =
        init.subexperiments?.map(
          (experiment) => new Experiment(undefined, experiment, this)
        ) ?? this.subexperiments;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.id = element.id;
    this.name = element.name;
    this.description = element.description ?? this.description;
    this.artifacts = element.artifacts?.slice() ?? this.artifacts;
  }

  /**
   * Update this experiment with new values
   *
   * @param experiment the new values of this experiment (values will be copied to the current object)
   */
  update(experiment: Partial<Experiment>): void {
    Object.assign(this, experiment);
  }

  /**
   * Add a new subexperiment to this experiment
   *
   * @param experiment the experiment to add to the experiment (values will be copied to a new object)
   * @return the added experiment
   */
  addSubexperiment(experiment: ExperimentInit): Experiment {
    const newExperiment = new Experiment(undefined, experiment, this);
    this.subexperiments.push(newExperiment);
    return newExperiment;
  }

  /**
   * Remove a subexperiment from this experiment
   *
   * @param id the id of the experiment to remove
   */
  removeSubexperiment(id: string): void {
    this.subexperiments = this.subexperiments.filter(
      (subexperiment) => subexperiment.id !== id
    );
  }

  /**
   * Get list with all experiments
   */
  getExperimentList(): Experiment[] {
    return [
      this,
      ...this.subexperiments
        .map((subexperiment) => subexperiment.getExperimentList())
        .reduce((acc, experiments) => acc.concat(experiments), []),
    ];
  }

  /**
   * Get an experiment
   *
   * @param experimentId the id of the experiment
   */
  getExperiment(experimentId: string): Experiment {
    const experiment = this.getExperimentList().find(
      (e) => e.id === experimentId
    );
    if (experiment == null) {
      throw new Error('Experiment with id ' + experimentId + ' does not exist');
    }
    return experiment;
  }

  toDb(): ExperimentEntry {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      subexperiments: this.subexperiments.map((experiment) =>
        experiment.toDb()
      ),
      artifacts: this.artifacts,
    };
  }

  /**
   * Get the next unique experiment id by name
   *
   * @param experimentName the name of the experiment
   */
  getExperimentId(experimentName: string): string {
    return getId(
      experimentName,
      this.getExperimentList().map((e) => e.id)
    );
  }

  /**
   * Gets the id of the root experiment
   *
   * @return the id of the root experiment
   */
  getExperimentDefinitionId(): string {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let experiment: Experiment = this;
    while (experiment.parent != null) {
      experiment = experiment.parent;
    }
    return experiment.id;
  }
}
