import { HypoMoMap } from './hypo-mo-map';
import { ExperimentDefinition } from './experiment-definition';
import {
  Hypothesis,
  HypothesisState,
  SubhypothesesConnections,
} from './hypothesis';
import { Experiment } from './experiment';
import { Mapping } from './mapping';

describe('HypoMoMap', () => {
  let hypoMoMap: HypoMoMap;

  beforeEach(() => {
    hypoMoMap = new HypoMoMap(
      undefined,
      { id: 'Test Id', name: 'Test HypoMoMap' },
      undefined
    );
  });

  it('should be created', () => expect(hypoMoMap).toBeTruthy());

  describe('when adding a hypothesis', () => {
    let hypothesis: Hypothesis;

    beforeEach(() => {
      hypothesis = new Hypothesis(
        undefined,
        { id: 'test-hypothesis', name: 'Test Hypothesis', priority: 1 },
        undefined
      );
      hypoMoMap.addHypothesis(hypothesis, undefined);
    });

    it('should exist', () => {
      expect(hypoMoMap.getHypothesis(hypothesis.id)).toBeTruthy();
      expect(hypoMoMap.getHypothesis(hypothesis.id).name).toBe(hypothesis.name);
    });

    it('should not be equal', () => {
      expect(hypoMoMap.getHypothesis(hypothesis.id)).not.toBe(hypothesis);
    });

    describe('and adding an experiment', () => {
      let experiment: ExperimentDefinition;

      beforeEach(() => {
        experiment = new ExperimentDefinition(undefined, {
          author: {},
          _id: '1',
          experiment: new Experiment(
            undefined,
            {
              id: 'Test-Experiment',
              name: 'Test Experiment',
              subexperiments: [
                new Experiment(
                  undefined,
                  { id: 'subexperiment', name: 'subexperiment' },
                  undefined
                ),
              ],
            },
            undefined
          ),
        });
        hypoMoMap.addExperimentDefinition(experiment);
      });

      it('should exist', () => {
        expect(hypoMoMap.usedExperiments[experiment._id]).toBeTruthy();
      });

      it('should not be possible to add a mapping twice', () => {
        hypoMoMap.addMapping(
          new Mapping(undefined, {
            experimentDefinitionId: experiment._id,
            experimentId: experiment._id,
            hypothesisId: hypothesis.id,
            metric: 'Test',
          })
        );
        expect(() =>
          hypoMoMap.addMapping(
            new Mapping(undefined, {
              experimentDefinitionId: experiment._id,
              experimentId: experiment._id,
              hypothesisId: hypothesis.id,
              metric: 'Test 2',
            })
          )
        ).toThrow();
      });

      it('should remove the mappings after removing the experiment', () => {
        hypoMoMap.addMapping(
          new Mapping(undefined, {
            experimentDefinitionId: experiment._id,
            experimentId: experiment._id,
            hypothesisId: hypothesis.id,
            metric: 'Test',
          })
        );
        expect(hypoMoMap.mappings).toHaveLength(1);
        hypoMoMap.removeHypothesis(hypothesis.id);
        expect(hypoMoMap.mappings).toHaveLength(0);
      });

      it('should remove mappings of subhypotheses', () => {
        const innerHypothesis = hypoMoMap.addHypothesis(
          {
            name: 'Test inner hypothesis',
            priority: 1,
          },
          hypothesis.id
        );
        hypoMoMap.addMapping({
          experimentDefinitionId: experiment._id,
          experimentId: experiment._id,
          hypothesisId: innerHypothesis.id,
          metric: 'Test',
        });
        expect(hypoMoMap.mappings).toHaveLength(1);
        hypoMoMap.removeHypothesis(hypothesis.id);
        expect(hypoMoMap.mappings).toHaveLength(0);
      });

      it('should update parents after execution of experiment', () => {
        const experimentDefinitionId = hypoMoMap.usedExperimentsList[0].id;
        const experimentAId = experimentDefinitionId;
        const experimentBId =
          hypoMoMap.usedExperimentsList[0].subexperiments[0].id;
        hypoMoMap.updateHypothesis(hypothesis.id, undefined, {
          subhypothesesConnections: SubhypothesesConnections.AND,
        });
        hypoMoMap.updateExperiment(experimentDefinitionId, experimentAId, {
          maxEvidence: 5,
          costs: 4,
        });
        hypoMoMap.updateExperiment(experimentDefinitionId, experimentBId, {
          maxEvidence: 3,
          costs: 2,
        });
        const subhypothesis1 = hypoMoMap.addHypothesis(
          { name: 'subhypothesis1', priority: 1 },
          hypothesis.id
        );
        const subhypothesis2 = hypoMoMap.addHypothesis(
          { name: 'subhypothesis2', priority: 1 },
          hypothesis.id
        );
        hypoMoMap.addMapping(
          new Mapping(undefined, {
            experimentDefinitionId,
            experimentId: experimentAId,
            hypothesisId: subhypothesis1.id,
            metric: 'Test',
          })
        );
        hypoMoMap.addMapping(
          new Mapping(undefined, {
            experimentDefinitionId,
            experimentId: experimentBId,
            hypothesisId: subhypothesis2.id,
            metric: 'Test',
          })
        );
        const adaptedHypoMoMap = hypoMoMap.executeExperiment(
          experimentDefinitionId,
          experimentAId,
          [{ hypothesisId: subhypothesis1.id, evidence: 2, approved: true }]
        );
        expect(adaptedHypoMoMap.getHypothesis(subhypothesis1.id).state).toBe(
          HypothesisState.VALIDATED
        );
        expect(adaptedHypoMoMap.getHypothesis(subhypothesis2.id).state).toBe(
          HypothesisState.UNTESTED
        );
        expect(adaptedHypoMoMap.getHypothesis(hypothesis.id).state).toBe(
          HypothesisState.UNTESTED
        );
        const adaptedHypoMoMap2 = adaptedHypoMoMap.executeExperiment(
          experimentDefinitionId,
          experimentBId,
          [{ hypothesisId: subhypothesis2.id, evidence: 3, approved: true }]
        );
        expect(adaptedHypoMoMap2.getHypothesis(subhypothesis1.id).state).toBe(
          HypothesisState.VALIDATED
        );
        expect(adaptedHypoMoMap2.getHypothesis(subhypothesis2.id).state).toBe(
          HypothesisState.VALIDATED
        );
        expect(adaptedHypoMoMap2.getHypothesis(hypothesis.id).state).toBe(
          HypothesisState.VALIDATED
        );
        expect(
          adaptedHypoMoMap2.getHypothesis(hypothesis.id).evidenceScore
        ).toBe(2);
      });
    });
  });
});
