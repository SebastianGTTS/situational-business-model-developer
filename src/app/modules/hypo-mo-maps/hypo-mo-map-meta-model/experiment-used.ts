import { Experiment, ExperimentEntry, ExperimentInit } from './experiment';

export interface ExperimentUsedInit extends ExperimentInit {
  maxEvidence?: number;
  costs?: number;
  subexperiments?: ExperimentUsedInit[];
}

export interface ExperimentUsedEntry extends ExperimentEntry {
  maxEvidence?: number;
  costs?: number;
  subexperiments: ExperimentUsedEntry[];
}

export class ExperimentUsed extends Experiment implements ExperimentUsedInit {
  maxEvidence?: number;
  costs?: number;
  subexperiments: ExperimentUsed[] = [];

  constructor(
    entry: ExperimentUsedEntry | undefined,
    init: ExperimentUsedInit | undefined,
    parent: Experiment | undefined
  ) {
    super(entry, init, parent);
    let element;
    if (entry != null) {
      element = entry;
      this.subexperiments = entry.subexperiments.map(
        (experiment) => new ExperimentUsed(experiment, undefined, this)
      );
    } else if (init != null) {
      element = init;
      this.subexperiments =
        init.subexperiments?.map(
          (experiment) => new ExperimentUsed(undefined, experiment, this)
        ) ?? this.subexperiments;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.maxEvidence = element.maxEvidence;
    this.costs = element.costs;
    this.validate();
  }

  /**
   * Update this experiment with new values
   *
   * @param experiment the new values of this experiment (values will be copied to the current object)
   */
  update(experiment: Partial<ExperimentUsed>): void {
    Object.assign(this, experiment);
  }

  validate(): void {
    if (
      this.maxEvidence != null &&
      (this.maxEvidence < 1 || this.maxEvidence > 5)
    ) {
      throw new Error('ExperimentUsed: maxEvidence should be between 1 and 5');
    }
    if (this.costs != null && (this.costs < 1 || this.costs > 5)) {
      throw new Error('ExperimentUsed: costs should be between 1 and 5');
    }
  }

  toDb(): ExperimentUsedEntry {
    return {
      ...super.toDb(),
      maxEvidence: this.maxEvidence,
      costs: this.costs,
      subexperiments: this.subexperiments.map((experiment) =>
        experiment.toDb()
      ),
    };
  }
}
