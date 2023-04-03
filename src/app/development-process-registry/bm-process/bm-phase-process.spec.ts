import { BmPhaseProcess, isBmPhaseProcessEntry } from './bm-phase-process';
import { Phase } from '../phase/phase';
import { DevelopmentMethod } from '../development-method/development-method';

describe('Bm Phase Process', () => {
  const phases: Phase[] = [
    new Phase(undefined, { name: 'Phase 1' }),
    new Phase(undefined, { name: 'Phase 2' }),
    new Phase(undefined, { name: 'Phase 3' }),
  ];
  const block1 = new DevelopmentMethod(undefined, {
    name: 'Test Building Block',
    author: {},
  });
  const block2 = new DevelopmentMethod(undefined, {
    name: 'Test method',
    author: {},
  });

  it('should create', () => {
    const bmProcess = new BmPhaseProcess(undefined, {
      name: 'Test Process',
    });
    expect(bmProcess).toBeTruthy();
    expect(bmProcess.initial).toBe(true);
    expect(bmProcess.phases).toStrictEqual([]);
    expect(bmProcess.isComplete()).toBe(true);
    const db = bmProcess.toDb();
    expect(db).toBeTruthy();
    expect(db.phases).toStrictEqual([]);
    expect(isBmPhaseProcessEntry(db)).toBe(true);
  });

  it('should be able to add phases', () => {
    const bmProcess = new BmPhaseProcess(undefined, {
      name: 'Test Process',
    });
    bmProcess.updatePhases(phases);
    expect(bmProcess.phases).toHaveLength(3);
    expect(bmProcess.phases.map((phase) => phase.phase)).toStrictEqual(phases);
  });

  it('should be able to add building blocks to phases', () => {
    const bmProcess = new BmPhaseProcess(undefined, {
      name: 'Test Process',
    });
    bmProcess.updatePhases(phases);
    bmProcess.addDecision(phases[0].id, block1);
    expect(bmProcess.phases[0].decisions).toHaveLength(1);
    expect(bmProcess.phases[0].decisions[0].decision.method).toStrictEqual(
      block1
    );
  });

  it('should be able to update phases', () => {
    const bmProcess = new BmPhaseProcess(undefined, {
      name: 'Test Process',
    });
    bmProcess.updatePhases(phases);
    bmProcess.addDecision(phases[0].id, block1);
    bmProcess.updatePhases([phases[1], phases[0]]);
    expect(bmProcess.phases).toHaveLength(2);
    expect(bmProcess.phases[0].phase).toStrictEqual(phases[1]);
    expect(bmProcess.phases[1].phase).toStrictEqual(phases[0]);
    expect(bmProcess.phases[1].decisions).toHaveLength(1);
    expect(bmProcess.phases[1].decisions[0].decision.method).toStrictEqual(
      block1
    );
  });

  it('should get all phase method decisions', () => {
    const bmProcess = new BmPhaseProcess(undefined, {
      name: 'Test Process',
    });
    bmProcess.updatePhases(phases);
    bmProcess.addDecision(phases[0].id, block1);
    bmProcess.addDecision(phases[1].id, block2);
    const decisions = bmProcess.getAllPhaseMethodDecisions();
    expect(decisions).toHaveLength(2);
    expect(decisions[0].id).not.toEqual(decisions[1].id);
  });

  it('should get all phase method decisions in correct order', () => {
    const bmProcess = new BmPhaseProcess(undefined, {
      name: 'Test Process',
    });
    bmProcess.updatePhases(phases);
    const d1 = bmProcess.addDecision(phases[0].id, block1);
    const d2 = bmProcess.addDecision(phases[1].id, block2);
    bmProcess.updateDecisionNumber(d2.id, 1);
    bmProcess.updateDecisionNumber(d1.id, 2);
    const sortedDecisions = bmProcess.getSortedPhaseMethodDecisions();
    expect(sortedDecisions).toHaveLength(2);
    expect(sortedDecisions[0]).toBe(d2);
    expect(sortedDecisions[1]).toBe(d1);
    expect(bmProcess.getPhaseMethodDecisionByExecutionNumber(1)).toBe(d2);
    expect(bmProcess.getPhaseMethodDecisionByExecutionNumber(2)).toBe(d1);
  });

  it('should remove decisions', () => {
    const bmProcess = new BmPhaseProcess(undefined, {
      name: 'Test Process',
    });
    bmProcess.updatePhases(phases);
    const d1 = bmProcess.addDecision(phases[0].id, block1);
    bmProcess.removeDecision(d1.id);
    expect(bmProcess.getAllPhaseMethodDecisions()).toHaveLength(0);
  });
});
