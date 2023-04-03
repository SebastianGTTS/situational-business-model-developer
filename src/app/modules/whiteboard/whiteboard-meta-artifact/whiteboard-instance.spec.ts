import { WhiteboardInstance } from './whiteboard-instance';

describe('WhiteboardInstance', () => {
  it('should create', () => {
    const instance = new WhiteboardInstance(undefined, {
      name: 'Test',
      whiteboard: '',
    });
    expect(instance).toBeTruthy();
    expect(instance.name).toBe('Test');
    expect(instance.type).toBe(WhiteboardInstance.typeName);
  });
});
