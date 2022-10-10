import { Selection } from './selection';
import { Type } from '../method-elements/type/type';

describe('Selection', () => {
  let selection: Selection<Type>;

  beforeEach(() => {
    selection = new Selection<Type>(
      undefined,
      {
        list: 'Test List',
        element: {
          list: 'Test List',
          name: 'Test Name',
        },
      },
      Type
    );
  });

  it('should create', () => {
    expect(selection).toBeTruthy();
    expect(selection.list).toBe('Test List');
    expect(selection.element).toBeTruthy();
    expect(selection.element?.list).toBe('Test List');
    expect(selection.element?.name).toBe('Test Name');
  });

  it('should export to db', () => {
    const entry = selection.toDb();
    expect(entry.list).toBe('Test List');
    expect(entry.element).toBeTruthy();
    expect(entry.element?.list).toBe('Test List');
    expect(entry.element?.name).toBe('Test Name');
  });
});
