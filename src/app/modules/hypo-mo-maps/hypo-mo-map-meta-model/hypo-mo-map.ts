import { Hypothesis, HypothesisEntry, HypothesisInit } from './hypothesis';
import { getId } from '../../../model/utils';
import { Mapping, MappingEntry, MappingInit } from './mapping';
import {
  ExperimentUsed,
  ExperimentUsedEntry,
  ExperimentUsedInit,
} from './experiment-used';
import { ExperimentDefinition } from './experiment-definition';
import { DatabaseEntry, DatabaseInit } from '../../../database/database-entry';
import { DatabaseModelPart } from '../../../database/database-model-part';
import { OptionalOmit } from '../../../shared/utils';

export interface HypothesisMappingsMap {
  [hypothesisId: string]: { metric: string; experiment: ExperimentUsed }[];
}

export interface HypoMoMapInit extends DatabaseInit {
  id: string;
  name: string;
  hypotheses?: HypothesisInit[];
  usedExperiments?: { [id: string]: ExperimentUsedInit };
  mappings?: MappingInit[];
  adaptions?: HypoMoMapInit[];
}

export interface HypoMoMapEntry extends DatabaseEntry {
  id: string;
  name: string;
  hypotheses: HypothesisEntry[];
  usedExperiments: { [id: string]: ExperimentUsedEntry };
  mappings: MappingEntry[];
  adaptions: HypoMoMapEntry[];
}

export class HypoMoMap implements HypoMoMapInit, DatabaseModelPart {
  // stored
  id: string;
  name: string;
  hypotheses: Hypothesis[] = [];
  usedExperiments: { [id: string]: ExperimentUsed } = {};

  mappings: Mapping[] = [];

  adaptions: HypoMoMap[] = [];

  get usedExperimentsList(): ExperimentUsed[] {
    return Object.values(this.usedExperiments);
  }

  // non stored
  parent?: HypoMoMap;

  constructor(
    entry: HypoMoMapEntry | undefined,
    init: HypoMoMapInit | undefined,
    parent: HypoMoMap | undefined
  ) {
    this.parent = parent;
    let element;
    if (entry != null) {
      element = entry;
      this.hypotheses = entry.hypotheses.map(
        (hypothesis) => new Hypothesis(hypothesis, undefined, undefined)
      );
      Object.entries(entry.usedExperiments).forEach(
        ([id, experiment]) =>
          (this.usedExperiments[id] = new ExperimentUsed(
            experiment,
            undefined,
            undefined
          ))
      );
      this.mappings = entry.mappings.map(
        (mapping) => new Mapping(mapping, undefined)
      );
      this.adaptions = entry.adaptions.map(
        (adaption) => new HypoMoMap(adaption, undefined, this)
      );
    } else if (init != null) {
      element = init;
      this.hypotheses =
        init.hypotheses?.map(
          (hypothesis) => new Hypothesis(undefined, hypothesis, undefined)
        ) ?? this.hypotheses;
      if (init.usedExperiments != null) {
        Object.entries(init.usedExperiments).forEach(
          ([id, experiment]) =>
            (this.usedExperiments[id] = new ExperimentUsed(
              undefined,
              experiment,
              undefined
            ))
        );
      }
      this.mappings =
        init.mappings?.map((mapping) => new Mapping(undefined, mapping)) ??
        this.mappings;
      this.adaptions =
        init.adaptions?.map(
          (adaption) => new HypoMoMap(undefined, adaption, this)
        ) ?? this.adaptions;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.id = element.id;
    this.name = element.name;
  }

  /**
   * Update this HypoMoMap with new values
   *
   * @param hypoMoMap the new values of this HypoMoMap (values will be copied to the current object)
   */
  update(hypoMoMap: Partial<HypoMoMap>): void {
    Object.assign(this, hypoMoMap);
  }

  /**
   * Remove an adaption of this HypoMoMap
   *
   * @param hypoMoMapId the id of the HypoMoMap to remove
   */
  removeAdaption(hypoMoMapId: string): void {
    this.adaptions = this.adaptions.filter(
      (adaption) => adaption.id !== hypoMoMapId
    );
  }

  /**
   * Get the latest adaption of all HypoMoMaps in this tree
   */
  getLatestAdaption(): HypoMoMap {
    const adaptionsLength = this.adaptions.length;
    if (adaptionsLength === 0) {
      return this;
    }
    return this.adaptions[adaptionsLength - 1].getLatestAdaption();
  }

  /**
   * Add hypothesis to this HypoMoMap
   *
   * @param hypothesis the hypothesis to add (values will be copied to new object)
   * @param parentId the id of the parent hypothesis
   * @return the added hypothesis
   */
  addHypothesis(
    hypothesis: OptionalOmit<HypothesisInit, 'id'>,
    parentId: string | undefined
  ): Hypothesis {
    if (hypothesis.id == null) {
      hypothesis.id = getId(
        hypothesis.name,
        this.getHypothesisList().map((h) => h.id)
      );
    }
    if (parentId != null) {
      return this.getHypothesis(parentId).addSubhypothesis(
        hypothesis as HypothesisInit
      );
    } else {
      return this.addRootHypothesis(hypothesis as HypothesisInit);
    }
  }

  /**
   * Add root hypothesis to this HypoMoMap
   *
   * @param hypothesis the hypothesis to add (values will be copied to new object)
   */
  private addRootHypothesis(hypothesis: HypothesisInit): Hypothesis {
    const newHypothesis = new Hypothesis(undefined, hypothesis, undefined);
    this.hypotheses.push(newHypothesis);
    return newHypothesis;
  }

  /**
   * Update an hypothesis of this HypoMoMap
   *
   * @param hypothesisId the id of the hypothesis
   * @param parentHypothesisId the hypothesis id of the parent hypothesis
   * @param hypothesis the new values of the hypothesis (values will be copied to the current object)
   */
  updateHypothesis(
    hypothesisId: string,
    parentHypothesisId: string | undefined,
    hypothesis: Partial<Hypothesis>
  ): void {
    const currentHypothesis = this.getHypothesis(hypothesisId);
    const currentParent = currentHypothesis.parent;
    currentHypothesis.update(hypothesis);
    if (currentParent == null && parentHypothesisId != null) {
      const newParent = this.getHypothesis(parentHypothesisId);
      this.removeRootHypothesis(hypothesisId);
      newParent.addSubhypothesis(currentHypothesis);
    } else if (currentParent != null && parentHypothesisId == null) {
      currentParent.removeSubhypothesis(hypothesisId);
      this.addRootHypothesis(currentHypothesis);
    } else if (
      currentParent != null &&
      parentHypothesisId != null &&
      currentParent.id !== parentHypothesisId
    ) {
      const newParent = this.getHypothesis(parentHypothesisId);
      currentParent.removeSubhypothesis(hypothesisId);
      newParent.addSubhypothesis(currentHypothesis);
    }
  }

  /**
   * Remove an hypothesis
   *
   * @param hypothesisId the id of the hypothesis
   */
  removeHypothesis(hypothesisId: string): void {
    const hypothesis = this.getHypothesis(hypothesisId);
    const hypothesisSet = new Set<string>(
      hypothesis.getHypothesisList().map((subHypothesis) => subHypothesis.id)
    );
    if (hypothesis.parent) {
      hypothesis.parent.removeSubhypothesis(hypothesis.id);
    } else {
      this.removeRootHypothesis(hypothesisId);
    }

    // Remove all mappings
    this.mappings = this.mappings.filter(
      (mapping) => !hypothesisSet.has(mapping.hypothesisId)
    );
  }

  /**
   * Remove root hypothesis from this HypoMoMap
   *
   * @param hypothesisId the id of the hypothesis to remove
   */
  private removeRootHypothesis(hypothesisId: string): void {
    this.hypotheses = this.hypotheses.filter((h) => h.id !== hypothesisId);
  }

  /**
   * Get a hypothesis
   *
   * @param hypothesisId the id of the hypothesis
   */
  getHypothesis(hypothesisId: string): Hypothesis {
    const hypothesis = this.getHypothesisList().find(
      (h) => h.id === hypothesisId
    );
    if (!hypothesis) {
      throw new Error('Hypothesis with id ' + hypothesisId + ' does not exist');
    }
    return hypothesis;
  }

  /**
   * Get a list with all hypothesis
   */
  getHypothesisList(): Hypothesis[] {
    return this.hypotheses
      .map((hypothesis) => hypothesis.getHypothesisList())
      .reduce((acc, hypotheses) => acc.concat(hypotheses), []);
  }

  // Experiments

  /**
   * Add experiment definition to this HypoMoMap.
   *
   * @param experimentDefinition the definition of the experiment
   */
  addExperimentDefinition(experimentDefinition: ExperimentDefinition): void {
    this.usedExperiments[experimentDefinition._id] = new ExperimentUsed(
      undefined,
      { ...experimentDefinition.experiment, id: experimentDefinition._id },
      undefined
    );
  }

  /**
   * Remove experiment definition from this HypoMoMap.
   *
   * @param id the id of the experiment definition
   */
  removeExperimentDefinition(id: string): void {
    delete this.usedExperiments[id];

    // Remove all mappings
    this.mappings = this.mappings.filter(
      (mapping) => mapping.experimentDefinitionId !== id
    );
  }

  /**
   * Update an experiment of this HypoMoMap with new values
   *
   * @param experimentDefinitionId the id of the experiment definition
   * @param experimentId the id of the experiment
   * @param experiment the new values of the experiment (values will be copied to the current object)
   */
  updateExperiment(
    experimentDefinitionId: string,
    experimentId: string,
    experiment: Partial<ExperimentUsed>
  ): void {
    const rootExperiment = this.usedExperiments[experimentDefinitionId];
    const currentExperiment = rootExperiment.getExperiment(
      experimentId
    ) as ExperimentUsed;
    currentExperiment.update(experiment);
  }

  // Mapping

  /**
   * Add a mapping to this HypoMoMap
   *
   * @param mapping the mapping to add (values will be copied to a new object)
   */
  addMapping(mapping: MappingInit): void {
    const newMapping = new Mapping(undefined, mapping);
    this.getHypothesis(newMapping.hypothesisId);
    this.usedExperiments[newMapping.experimentDefinitionId].getExperiment(
      mapping.experimentId
    );
    if (
      this.mappings.find(
        (m) =>
          m.experimentDefinitionId === newMapping.experimentDefinitionId &&
          m.experimentId === newMapping.experimentId &&
          m.hypothesisId === newMapping.hypothesisId
      )
    ) {
      throw new Error('Mapping already defined');
    }
    this.mappings.push(newMapping);
  }

  /**
   * Remove a mapping from this HypoMoMap
   *
   * @param experimentDefinitionId the id of the experiment definition
   * @param experimentId the id of the experiment
   * @param hypothesisId the id of the hypothesis
   */
  removeMapping(
    experimentDefinitionId: string,
    experimentId: string,
    hypothesisId: string
  ): void {
    this.mappings = this.mappings.filter(
      (mapping) =>
        mapping.experimentDefinitionId !== experimentDefinitionId ||
        mapping.experimentId !== experimentId ||
        mapping.hypothesisId !== hypothesisId
    );
  }

  /**
   * Get a mapping from a hypothesis id to all mappings of this hypothesis
   * containing the experiment and the metric
   */
  getHypothesisMappingsMap(): HypothesisMappingsMap {
    const hypothesisMappingsMap: HypothesisMappingsMap = {};
    const hypothesisList = this.getHypothesisList();
    hypothesisList.forEach(
      (hypothesis) => (hypothesisMappingsMap[hypothesis.id] = [])
    );
    this.mappings.forEach((mapping) => {
      hypothesisMappingsMap[mapping.hypothesisId].push({
        experiment: this.usedExperiments[
          mapping.experimentDefinitionId
        ].getExperiment(mapping.experimentId) as ExperimentUsed,
        metric: mapping.metric,
      });
    });
    return hypothesisMappingsMap;
  }

  // Execute experiment

  /**
   * Execute an experiment and adapt this HypoMoMap
   * A new HypoMoMap will be created that is adapted.
   *
   * @param experimentDefinitionId the id of the experiment definition
   * @param experimentId the id of the experiment
   * @param experimentResults the results of the experiment
   * @return an adapted HypoMoMap
   */
  executeExperiment(
    experimentDefinitionId: string,
    experimentId: string,
    experimentResults: {
      hypothesisId: string;
      evidence: number;
      approved: boolean;
    }[]
  ): HypoMoMap {
    const hypoMoMap = new HypoMoMap(
      undefined,
      {
        ...this,
        id: String(Date.now()),
        name: this.getHypoMoMapAdaptionName(),
        adaptions: [],
      },
      this
    );
    experimentResults.forEach((result) => {
      const hypothesis = hypoMoMap.getHypothesis(result.hypothesisId);
      hypothesis.applyExperimentResult(result);
    });
    hypoMoMap.mappings = hypoMoMap.mappings.filter((mapping) => {
      if (
        mapping.experimentDefinitionId !== experimentDefinitionId ||
        mapping.experimentId !== experimentId
      ) {
        const hypothesis = hypoMoMap.getHypothesis(mapping.hypothesisId);
        const experiment = hypoMoMap.usedExperiments[
          mapping.experimentDefinitionId
        ].getExperiment(mapping.experimentId) as ExperimentUsed;
        if (
          hypothesis.evidenceScore == null ||
          // TODO
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          hypothesis.evidenceScore <= experiment.maxEvidence!
        ) {
          return true;
        }
      }
      return false;
    });
    this.adaptions.push(hypoMoMap);
    return hypoMoMap;
  }

  /**
   * Get an adaption name for the next adaption of this HypoMoMap
   */
  private getHypoMoMapAdaptionName(): string {
    const regex = /^(.+) - Adaption #([0-9]+)([a-z]*)$/;
    const result = regex.exec(this.name);
    if (result) {
      const adaptionNumber = parseInt(result[2], 10);
      return (
        result[1] +
        ' - Adaption #' +
        (adaptionNumber + 1) +
        result[3] +
        this.getAdaptionBranch()
      );
    } else {
      return this.name + ' - Adaption #1' + this.getAdaptionBranch();
    }
  }

  private getAdaptionBranch(): string {
    if (this.adaptions.length > 0) {
      const branch = 'a'.charCodeAt(0);
      if (this.adaptions.length > 26) {
        return ' - Adaption #1';
      } else {
        return String.fromCharCode(branch + (this.adaptions.length - 1));
      }
    }
    return '';
  }

  toDb(): HypoMoMapEntry {
    const usedExperiments: { [id: string]: ExperimentUsedEntry } = {};
    Object.entries(this.usedExperiments).forEach(
      ([id, experiment]) => (usedExperiments[id] = experiment.toDb())
    );
    return {
      id: this.id,
      name: this.name,
      hypotheses: this.hypotheses.map((hypothesis) => hypothesis.toDb()),
      usedExperiments,
      mappings: this.mappings.map((mapping) => mapping.toDb()),
      adaptions: this.adaptions.map((hypoMoMap) => hypoMoMap.toDb()),
    };
  }
}
