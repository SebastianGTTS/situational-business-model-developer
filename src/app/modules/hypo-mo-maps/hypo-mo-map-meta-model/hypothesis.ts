import { DatabaseEntry, DatabaseInit } from '../../../database/database-entry';
import { DatabaseModelPart } from '../../../database/database-model-part';

export enum HypothesisState {
  VALIDATED = 'validated',
  DISAPPROVED = 'disapproved',
  UNTESTED = 'untested',
}

export enum SubhypothesesConnections {
  AND = 'and',
  OR = 'or',
}

export interface HypothesisInit extends DatabaseInit {
  id: string;
  name: string;
  state?: HypothesisState;
  evidenceScore?: number;
  priority: number;
  subhypothesesConnections?: SubhypothesesConnections;
  subhypotheses?: HypothesisInit[];
}

export interface HypothesisEntry extends DatabaseEntry {
  id: string;
  name: string;
  state: HypothesisState;
  evidenceScore?: number;
  priority: number;
  subhypothesesConnections: SubhypothesesConnections;
  subhypotheses: HypothesisEntry[];
}

export class Hypothesis implements HypothesisInit, DatabaseModelPart {
  // stored
  id: string;
  name: string;
  state: HypothesisState = HypothesisState.UNTESTED;

  evidenceScore?: number;
  priority: number;

  subhypothesesConnections: SubhypothesesConnections =
    SubhypothesesConnections.OR;
  subhypotheses: Hypothesis[] = [];

  // non stored
  parent?: Hypothesis;
  level: number;

  constructor(
    entry: HypothesisEntry | undefined,
    init: HypothesisInit | undefined,
    parent: Hypothesis | undefined
  ) {
    this.parent = parent;
    this.level = this.parent ? this.parent.level + 1 : 1;
    let element;
    if (entry != null) {
      element = entry;
      this.subhypotheses = entry.subhypotheses.map(
        (hypothesis) => new Hypothesis(hypothesis, undefined, this)
      );
    } else if (init != null) {
      element = init;
      this.subhypotheses =
        init.subhypotheses?.map(
          (hypothesis) => new Hypothesis(undefined, hypothesis, this)
        ) ?? this.subhypotheses;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.id = element.id;
    this.name = element.name;
    this.state = element.state ?? this.state;
    this.evidenceScore = element.evidenceScore;
    this.priority = element.priority;
    this.subhypothesesConnections =
      element.subhypothesesConnections ?? this.subhypothesesConnections;
    this.validate();
  }

  /**
   * Update this hypothesis with new values
   *
   * @param hypothesis the new values of this hypothesis (values will be copied to the current object)
   */
  update(hypothesis: Partial<Hypothesis>): void {
    Object.assign(this, hypothesis);
  }

  validate(): void {
    if (
      this.evidenceScore != null &&
      (this.evidenceScore < 1 || this.evidenceScore > 5)
    ) {
      throw new Error('Hypothesis: evidenceScore should be between 1 and 5');
    }
    if (this.priority < 1 || this.priority > 5) {
      throw new Error('Hypothesis: priority should be between 1 and 5');
    }
  }

  toDb(): HypothesisEntry {
    return {
      id: this.id,
      name: this.name,
      state: this.state,
      evidenceScore: this.evidenceScore,
      priority: this.priority,
      subhypothesesConnections: this.subhypothesesConnections,
      subhypotheses: this.subhypotheses.map((hypothesis) => hypothesis.toDb()),
    };
  }

  /**
   * Add a new subhypothesis to this hypothesis
   *
   * @param hypothesis the hypothesis to add to the hypothesis (values will be copied to a new object)
   * @return the added hypothesis
   */
  addSubhypothesis(hypothesis: HypothesisInit): Hypothesis {
    const newHypothesis = new Hypothesis(undefined, hypothesis, this);
    this.subhypotheses.push(newHypothesis);
    return newHypothesis;
  }

  /**
   * Remove a subhypothesis from this hypothesis
   *
   * @param id the id of the hypothesis to remove
   */
  removeSubhypothesis(id: string): void {
    this.subhypotheses = this.subhypotheses.filter(
      (subhypothesis) => subhypothesis.id !== id
    );
  }

  /**
   * Apply an experiment result to this hypothesis
   *
   * @param experimentResult the result of the experiment
   */
  applyExperimentResult(experimentResult: {
    evidence: number;
    approved: boolean;
  }): void {
    if (
      this.evidenceScore == null ||
      this.evidenceScore <= experimentResult.evidence
    ) {
      this.evidenceScore = experimentResult.evidence;
      this.state = experimentResult.approved
        ? HypothesisState.VALIDATED
        : HypothesisState.DISAPPROVED;
      this.applyExperimentResultToParents();
    }
  }

  /**
   * Apply the experiment result to all parents
   */
  private applyExperimentResultToParents(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: Hypothesis = this;
    // evidenceScore set before calling this method
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let currentEvidenceScore: number = this.evidenceScore!;
    let parent: Hypothesis | undefined = this.parent;
    while (parent != null) {
      if (parent.subhypothesesConnections === SubhypothesesConnections.OR) {
        if (
          parent.evidenceScore == null ||
          parent.evidenceScore <= currentEvidenceScore
        ) {
          parent.evidenceScore = currentEvidenceScore;
          parent.state = current.state;
        } else {
          return;
        }
      } else {
        const approved: boolean = parent.subhypotheses.every(
          (hypothesis) => hypothesis.state === HypothesisState.VALIDATED
        );
        const disapproved: boolean = parent.subhypotheses.some(
          (hypothesis) => hypothesis.state === HypothesisState.DISAPPROVED
        );
        if (approved) {
          const min = Math.min(
            ...parent.subhypotheses.map(
              // all hypothesis are VALIDATED => all have an evidence score != null
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              (hypothesis) => hypothesis.evidenceScore!
            )
          );
          if (parent.evidenceScore == null || parent.evidenceScore <= min) {
            parent.evidenceScore = min;
            parent.state = HypothesisState.VALIDATED;
          } else {
            return;
          }
        } else if (disapproved) {
          const max = Math.max(
            ...parent.subhypotheses
              .filter(
                (hypothesis) => hypothesis.state === HypothesisState.DISAPPROVED
              )
              // All hypothesis are DISAPPROVED => all have an evidence score != null
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              .map((hypothesis) => hypothesis.evidenceScore!)
          );
          if (parent.evidenceScore == null || parent.evidenceScore <= max) {
            parent.evidenceScore = max;
            parent.state = HypothesisState.DISAPPROVED;
          } else {
            return;
          }
        } else {
          return;
        }
      }
      current = parent;
      currentEvidenceScore = parent.evidenceScore;
      parent = parent.parent;
    }
  }

  /**
   * Get list with all hypotheses
   */
  getHypothesisList(): Hypothesis[] {
    return [
      this,
      ...this.subhypotheses
        .map((subhypothesis) => subhypothesis.getHypothesisList())
        .reduce((acc, hypotheses) => acc.concat(hypotheses), []),
    ];
  }
}
