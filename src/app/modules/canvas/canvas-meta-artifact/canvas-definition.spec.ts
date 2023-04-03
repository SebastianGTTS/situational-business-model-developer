import { CanvasDefinition } from './canvas-definition';

describe('Canvas Definition', () => {
  it('should create', () => {
    const definition = new CanvasDefinition(undefined, {
      name: 'My definition',
    });
    expect(definition.relationshipTypes).toStrictEqual([]);
    expect(definition.rows).toStrictEqual([]);
    expect(definition.name).toBe('My definition');
    expect(definition.description).toBe('');
  });
});
