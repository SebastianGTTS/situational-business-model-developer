import { Type } from './type';

describe('Type', () => {
  let type: Type;

  beforeEach(() => {
    type = new Type(undefined, {
      name: 'Test Name',
      list: 'Test List',
    });
  });

  it('should create', () => {
    expect(type).toBeTruthy();
    expect(type.type).toBe(Type.typeName);
    expect(type._id).toBeTruthy();
    expect(type._rev).toBeFalsy();
    expect(type.description).toBeFalsy();
    expect(type.name).toBe('Test Name');
    expect(type.list).toBe('Test List');
  });

  it('should copy', () => {
    const newType = new Type(undefined, type);
    newType.resetDatabaseState();
    expect(newType._id).not.toBe(type._id);
    expect(newType.name).toBe(type.name);
    expect(newType.list).toBe(type.list);
  });
});
