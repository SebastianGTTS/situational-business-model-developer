import {
  Hypothesis,
  HypothesisState,
  SubhypothesesConnections,
} from './hypothesis';

describe('Hypothesis', () => {
  let hypothesis: Hypothesis;

  beforeEach(() => {
    hypothesis = new Hypothesis(
      undefined,
      {
        id: 'test-id',
        name: 'Test hypothesis',
        priority: 1,
      },
      undefined
    );
  });

  it('should be created', () => expect(hypothesis).toBeTruthy());

  it('should be possible to apply experiment result', () => {
    const experimentResult = { evidence: 3, approved: true };
    hypothesis.applyExperimentResult(experimentResult);
    expect(hypothesis.evidenceScore).toBe(experimentResult.evidence);
    expect(hypothesis.state).toBe(HypothesisState.VALIDATED);
  });

  describe('when adding a subhypothesis', () => {
    let subhypothesis: Hypothesis;

    beforeEach(() => {
      subhypothesis = hypothesis.addSubhypothesis({
        id: 'test2',
        name: 'Test hypothesis 2',
        priority: 2,
      });
    });

    it('should be created', () => expect(subhypothesis).toBeTruthy());

    it('should be included in the hypothesis list', () => {
      expect(
        hypothesis.getHypothesisList().find((h) => h.id === subhypothesis.id)
      ).toBe(subhypothesis);
    });

    it('should update parent after application of experiment results', () => {
      subhypothesis.applyExperimentResult({ evidence: 2, approved: true });
      expect(subhypothesis.evidenceScore).toBe(2);
      expect(subhypothesis.state).toBe(HypothesisState.VALIDATED);
      expect(hypothesis.evidenceScore).toBe(2);
      expect(hypothesis.state).toBe(HypothesisState.VALIDATED);
    });

    it('should not update parent if parent has higher evidence score', () => {
      hypothesis.evidenceScore = 5;
      hypothesis.state = HypothesisState.VALIDATED;
      subhypothesis.applyExperimentResult({ evidence: 4, approved: false });
      expect(subhypothesis.evidenceScore).toBe(4);
      expect(subhypothesis.state).toBe(HypothesisState.DISAPPROVED);
      expect(hypothesis.evidenceScore).toBe(5);
      expect(hypothesis.state).toBe(HypothesisState.VALIDATED);
    });

    describe('and another subhypothesis AND connected', () => {
      let subhypothesis2: Hypothesis;

      beforeEach(() => {
        hypothesis.subhypothesesConnections = SubhypothesesConnections.AND;
        subhypothesis2 = hypothesis.addSubhypothesis({
          id: 'test3',
          name: 'Test hypothesis 3',
          priority: 3,
        });
      });

      it('should be approved with the lowest evidence score', () => {
        subhypothesis.applyExperimentResult({ evidence: 4, approved: true });
        expect(hypothesis.evidenceScore).toBeUndefined();
        expect(hypothesis.state).toBe(HypothesisState.UNTESTED);
        subhypothesis2.applyExperimentResult({ evidence: 3, approved: true });
        expect(hypothesis.evidenceScore).toBe(3);
        expect(hypothesis.state).toBe(HypothesisState.VALIDATED);
      });

      it('should be disapproved with the highest disapproved evidence score', () => {
        subhypothesis.applyExperimentResult({ evidence: 5, approved: false });
        expect(hypothesis.evidenceScore).toBe(5);
        expect(hypothesis.state).toBe(HypothesisState.DISAPPROVED);
        subhypothesis2.applyExperimentResult({ evidence: 3, approved: true });
        expect(hypothesis.evidenceScore).toBe(5);
        expect(hypothesis.state).toBe(HypothesisState.DISAPPROVED);
      });

      it('should not be approved even if evidence of approved is higher on one subhypothesis', () => {
        subhypothesis.applyExperimentResult({ evidence: 5, approved: true });
        expect(hypothesis.evidenceScore).toBeUndefined();
        expect(hypothesis.state).toBe(HypothesisState.UNTESTED);
        subhypothesis2.applyExperimentResult({ evidence: 3, approved: false });
        expect(hypothesis.evidenceScore).toBe(3);
        expect(hypothesis.state).toBe(HypothesisState.DISAPPROVED);
      });

      it('should only update if the evidence score is better', () => {
        hypothesis.evidenceScore = 4;
        hypothesis.state = HypothesisState.DISAPPROVED;
        subhypothesis.applyExperimentResult({ evidence: 3, approved: true });
        expect(hypothesis.evidenceScore).toBe(4);
        expect(hypothesis.state).toBe(HypothesisState.DISAPPROVED);
        subhypothesis2.applyExperimentResult({ evidence: 5, approved: true });
        expect(hypothesis.evidenceScore).toBe(4);
        expect(hypothesis.state).toBe(HypothesisState.DISAPPROVED);
      });

      it('should set disapproved if evidence score is high enough', () => {
        hypothesis.evidenceScore = 4;
        hypothesis.state = HypothesisState.VALIDATED;
        subhypothesis.applyExperimentResult({ evidence: 3, approved: true });
        expect(hypothesis.evidenceScore).toBe(4);
        expect(hypothesis.state).toBe(HypothesisState.VALIDATED);
        subhypothesis.applyExperimentResult({ evidence: 5, approved: false });
        expect(hypothesis.evidenceScore).toBe(5);
        expect(hypothesis.state).toBe(HypothesisState.DISAPPROVED);
      });
    });
  });
});
