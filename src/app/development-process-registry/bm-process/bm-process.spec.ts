import { BmProcess } from './bm-process';

describe('Bm Process', () => {
  it('should create', () => {
    const bmProcess = new BmProcess(undefined, {
      name: 'Test Process',
    });
    expect(bmProcess).toBeTruthy();
    expect(bmProcess.initial).toBe(true);
    const db = bmProcess.toDb();
    expect(db).toBeTruthy();
    expect(db.initial).toBe(true);
    expect(db.name).toBe('Test Process');
    expect(db.domains).toStrictEqual([]);
    expect(db.situationalFactors).toStrictEqual([]);
  });

  it('finishInitialization', () => {
    const bmProcess = new BmProcess(undefined, {
      name: 'Test Process',
    });
    bmProcess.finishInitialization();
    expect(bmProcess.initial).toBe(false);
  });
});
