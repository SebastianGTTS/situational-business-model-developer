import { WhiteboardTemplate } from './whiteboard-template';
import { Author } from '../../../model/author';

describe('WhiteboardTemplate', () => {
  it('should create', () => {
    const whiteboardTemplate = new WhiteboardTemplate(undefined, {
      whiteboard: '',
      name: 'Test',
    });
    expect(whiteboardTemplate).toBeTruthy();
    expect(whiteboardTemplate.whiteboard).toBe('');
    expect(whiteboardTemplate.name).toBe('Test');
    expect(whiteboardTemplate.author).toBeTruthy();
    expect(whiteboardTemplate.author).toBeInstanceOf(Author);
  });
});
