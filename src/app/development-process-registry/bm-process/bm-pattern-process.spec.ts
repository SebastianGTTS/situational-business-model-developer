import {
  BmPatternProcess,
  isBmPatternProcessEntry,
} from './bm-pattern-process';
import { DevelopmentMethod } from '../development-method/development-method';

describe('Bm Pattern Process', () => {
  const block1 = new DevelopmentMethod(undefined, {
    name: 'Test Building Block',
    author: {},
  });

  it('should create', () => {
    const bmProcess = new BmPatternProcess(undefined, {
      name: 'Test Process',
      processDiagram: 'TEST DIAGRAM',
    });
    expect(bmProcess).toBeTruthy();
    expect(bmProcess.processDiagram).toBe('TEST DIAGRAM');
    expect(bmProcess.isComplete()).toBe(true);
    const db = bmProcess.toDb();
    expect(db).toBeTruthy();
    expect(isBmPatternProcessEntry(db)).toBe(true);
    expect(db.processDiagram).toBe('TEST DIAGRAM');
    expect(db.decisions).toStrictEqual({});
  });

  it('can add decisions', () => {
    const bmProcess = new BmPatternProcess(undefined, {
      name: 'Test Process',
      processDiagram: 'TEST DIAGRAM',
    });
    const d1 = bmProcess.addDecision('TESTID', block1);
    expect(d1.method).toStrictEqual(block1);
    expect(bmProcess.decisions['TESTID']).toBe(d1);
    expect(Object.entries(bmProcess.decisions)).toHaveLength(1);
  });

  it('can remove decisions', () => {
    const bmProcess = new BmPatternProcess(undefined, {
      name: 'Test Process',
      processDiagram: 'TEST DIAGRAM',
    });
    bmProcess.addDecision('TESTID', block1);
    expect(Object.entries(bmProcess.decisions)).toHaveLength(1);
    bmProcess.removeDecision('TESTID');
    expect(Object.entries(bmProcess.decisions)).toHaveLength(0);
  });
});
