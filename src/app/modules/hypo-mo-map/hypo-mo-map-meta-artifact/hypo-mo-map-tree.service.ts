import { Injectable } from '@angular/core';
import { HypoMoMap } from './hypo-mo-map';
import { Hypothesis, HypothesisInit } from './hypothesis';
import { ExperimentDefinition } from './experiment-definition';
import { ExperimentUsed } from './experiment-used';
import { MappingInit } from './mapping';
import { HypoMoMapTree, HypoMoMapTreeInit } from './hypo-mo-map-tree';
import { DefaultElementService } from '../../../database/default-element.service';
import { OptionalOmit } from '../../../shared/utils';

@Injectable()
export class HypoMoMapTreeService extends DefaultElementService<
  HypoMoMapTree,
  HypoMoMapTreeInit
> {
  protected readonly typeName = HypoMoMapTree.typeName;

  protected readonly elementConstructor = HypoMoMapTree;

  async addByName(name: string): Promise<HypoMoMapTree> {
    const instance = new HypoMoMapTree(undefined, this.getHypoMoMapTree(name));
    await this.save(instance);
    return instance;
  }

  /**
   * Get an initialization for a new HypoMoMapTree.
   *
   * @param name name of the HypoMoMapTree
   */
  getHypoMoMapTree(name: string): HypoMoMapTreeInit {
    return {
      rootHypoMoMap: {
        name: name,
        id: String(Date.now()),
      },
    };
  }

  /**
   * Update a HypoMoMap of a HypoMoMapTree.
   *
   * @param id id of the HypoMoMapTree
   * @param hypoMoMapId the id of the HypoMoMap
   * @param hypoMoMap the new values of the HypoMoMap (values will be copied to the current object)
   */
  async updateHypoMoMap(
    id: string,
    hypoMoMapId: string,
    hypoMoMap: Partial<HypoMoMap>
  ): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hypoMoMapTree.getHypoMoMap(hypoMoMapId)!.update(hypoMoMap);
    await this.save(hypoMoMapTree);
  }

  /**
   * Delete a HypoMoMap of a HypoMoMapTree.
   *
   * @param id id of the HypoMoMapTree
   * @param hypoMoMapId id of the HypoMoMap
   */
  async deleteHypoMoMap(id: string, hypoMoMapId: string): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    hypoMoMapTree.deleteHypoMoMap(hypoMoMapId);
    await this.save(hypoMoMapTree);
  }

  /**
   * Add hypothesis to a HypoMoMap
   *
   * @param id the id of the HypoMoMapTree
   * @param hypoMoMapId the id of the HypoMoMap
   * @param hypothesis the hypothesis to add (values will be copied to new object)
   * @param parentId the id of the parent hypothesis
   */
  async addHypothesis(
    id: string,
    hypoMoMapId: string,
    hypothesis: OptionalOmit<HypothesisInit, 'id'>,
    parentId: string | undefined
  ): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hypoMoMap = hypoMoMapTree.getHypoMoMap(hypoMoMapId)!;
    hypoMoMap.addHypothesis(hypothesis, parentId);
    await this.save(hypoMoMapTree);
  }

  /**
   * Update a hypothesis of a HypoMoMap
   *
   * @param id the id of the HypoMoMapTree
   * @param hypoMoMapId the id of the HypoMoMap
   * @param hypothesisId the id of the hypothesis
   * @param parentHypothesisId the hypothesis id of the parent hypothesis
   * @param hypothesis the new values of the hypothesis (values will be copied to the current object)
   */
  async updateHypothesis(
    id: string,
    hypoMoMapId: string,
    hypothesisId: string,
    parentHypothesisId: string | undefined,
    hypothesis: Partial<Hypothesis>
  ): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hypoMoMap = hypoMoMapTree.getHypoMoMap(hypoMoMapId)!;
    hypoMoMap.updateHypothesis(hypothesisId, parentHypothesisId, hypothesis);
    await this.save(hypoMoMapTree);
  }

  /**
   * Remove a hypothesis from a HypoMoMap
   *
   * @param id the id of the HypoMoMapTree
   * @param hypoMoMapId the id of the HypoMoMap
   * @param hypothesisId the id of the hypothesis to remove
   */
  async removeHypothesis(
    id: string,
    hypoMoMapId: string,
    hypothesisId: string
  ): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hypoMoMap = hypoMoMapTree.getHypoMoMap(hypoMoMapId)!;
    hypoMoMap.removeHypothesis(hypothesisId);
    await this.save(hypoMoMapTree);
  }

  /**
   * Add a new experiment definition to a HypoMoMap
   *
   * @param id the id of the HypoMoMapTree
   * @param hypoMoMapId the id of the HypoMoMap
   * @param experimentDefinition the ExperimentDefinition
   */
  async addExperimentDefinition(
    id: string,
    hypoMoMapId: string,
    experimentDefinition: ExperimentDefinition
  ): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hypoMoMap = hypoMoMapTree.getHypoMoMap(hypoMoMapId)!;
    hypoMoMap.addExperimentDefinition(experimentDefinition);
    await this.save(hypoMoMapTree);
  }

  /**
   * Remove an experiment definition from a HypoMoMap
   *
   * @param id the id of the HypoMoMapTree
   * @param hypoMoMapId the id of the HypoMoMap
   * @param experimentDefinitionId the id of the ExperimentDefinition
   */
  async removeExperimentDefinition(
    id: string,
    hypoMoMapId: string,
    experimentDefinitionId: string
  ): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hypoMoMap = hypoMoMapTree.getHypoMoMap(hypoMoMapId)!;
    hypoMoMap.removeExperimentDefinition(experimentDefinitionId);
    await this.save(hypoMoMapTree);
  }

  /**
   * Update an experiment of a HypoMoMap
   *
   * @param id the id of the HypoMoMapTree
   * @param hypoMoMapId the id of the HypoMoMap
   * @param experimentDefinitionId the id of the ExperimentDefinition
   * @param experimentId the id of the Experiment
   * @param experiment the new values of the experiment (values will be copied to the current object)
   */
  async updateExperiment(
    id: string,
    hypoMoMapId: string,
    experimentDefinitionId: string,
    experimentId: string,
    experiment: Partial<ExperimentUsed>
  ): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hypoMoMap = hypoMoMapTree.getHypoMoMap(hypoMoMapId)!;
    hypoMoMap.updateExperiment(
      experimentDefinitionId,
      experimentId,
      experiment
    );
    await this.save(hypoMoMapTree);
  }

  /**
   * Add mapping to a HypoMoMap
   *
   * @param id the id of the HypoMoMapTree
   * @param hypoMoMapId the id of the HypoMoMap
   * @param mapping the mapping to add (values will be copied to new object)
   */
  async addMapping(
    id: string,
    hypoMoMapId: string,
    mapping: MappingInit
  ): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hypoMoMap = hypoMoMapTree.getHypoMoMap(hypoMoMapId)!;
    hypoMoMap.addMapping(mapping);
    await this.save(hypoMoMapTree);
  }

  /**
   * Remove a mapping from a HypoMoMap
   *
   * @param id the id of the HypoMoMapTree
   * @param hypoMoMapId the id of the HypoMoMap
   * @param experimentDefinitionId the id of the experiment definition
   * @param experimentId the id of the experiment
   * @param hypothesisId the id of the hypothesis
   */
  async removeMapping(
    id: string,
    hypoMoMapId: string,
    experimentDefinitionId: string,
    experimentId: string,
    hypothesisId: string
  ): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hypoMoMap = hypoMoMapTree.getHypoMoMap(hypoMoMapId)!;
    hypoMoMap.removeMapping(experimentDefinitionId, experimentId, hypothesisId);
    await this.save(hypoMoMapTree);
  }

  /**
   * Execute an experiment and adapt a HypoMoMap. Creates a new HypoMoMap.
   *
   * @param id the id of the HypoMoMapTree
   * @param hypoMoMapId the id of the HypoMoMap
   * @param experimentDefinitionId the id of the experiment definition
   * @param experimentId the id of the executed experiment
   * @param experimentResults the results of the experiment execution
   */
  async executeExperiment(
    id: string,
    hypoMoMapId: string,
    experimentDefinitionId: string,
    experimentId: string,
    experimentResults: {
      hypothesisId: string;
      evidence: number;
      approved: boolean;
    }[]
  ): Promise<void> {
    const hypoMoMapTree = await this.get(id);
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hypoMoMap = hypoMoMapTree.getHypoMoMap(hypoMoMapId)!;
    hypoMoMap.executeExperiment(
      experimentDefinitionId,
      experimentId,
      experimentResults
    );
    await this.save(hypoMoMapTree);
  }
}
