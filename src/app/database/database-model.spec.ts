import { DatabaseModel } from './database-model';
import { DatabaseRootEntry, DatabaseRootInit, DbType } from './database-entry';

class TestType extends DatabaseModel {
  static readonly typeName = 'TestType';

  constructor(
    entry: DatabaseRootEntry | undefined,
    init: DatabaseRootInit | undefined,
    type: DbType
  ) {
    super(entry, init, type);
  }
}

describe('DatabaseModel', () => {
  it('should be created', () => {
    const model = new TestType(undefined, {}, TestType.typeName);
    expect(model).toBeTruthy();
    expect(model.type).toBe(TestType.typeName);
    expect(model._id).toBeTruthy();
    expect(model._rev).toBeUndefined();
  });

  it('should create from entry', () => {
    const entry: DatabaseRootEntry = {
      type: TestType.typeName,
      _id: 'TestId',
      _rev: 'TestRev',
    };
    const model = new TestType(entry, undefined, TestType.typeName);
    expect(model.type).toBe(TestType.typeName);
    expect(model._id).toBeTruthy();
    expect(model._id).toBe('TestId');
    expect(model._rev).toBeTruthy();
    expect(model._rev).toBe('TestRev');
  });

  it('should maintain id and revision on init', () => {
    const model = new TestType(
      undefined,
      {
        _id: 'TestId',
        _rev: 'TestRev',
      },
      TestType.typeName
    );
    expect(model._id).toBe('TestId');
    expect(model._rev).toBe('TestRev');
  });

  it('should export to entry', () => {
    const model = new TestType(undefined, {}, TestType.typeName);
    const entry = model.toDb();
    expect(entry).toBeTruthy();
    expect(entry.type).toBe(TestType.typeName);
    expect(entry._id).toBe(model._id);
    expect(entry._rev).toBeUndefined();
  });

  it('should error if both entry and init not supplied', () => {
    expect(
      () => new TestType(undefined, undefined, TestType.typeName)
    ).toThrow();
  });

  it('should reset id and revision on resetDatabaseState', () => {
    const model = new TestType(
      undefined,
      {
        _id: 'TestId',
        _rev: 'TestRev',
      },
      TestType.typeName
    );
    model.resetDatabaseState();
    expect(model._id).not.toBe('TestId');
    expect(model._rev).toBeUndefined();
  });
});
