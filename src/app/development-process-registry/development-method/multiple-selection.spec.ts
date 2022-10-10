import { MultipleSelection } from './multiple-selection';
import { Tool } from '../method-elements/tool/tool';

describe('Multiple Selection', () => {
  it('should create', () => {
    const multipleSelection = new MultipleSelection(
      undefined,
      {
        list: 'Test List',
      },
      Tool
    );
    expect(multipleSelection).toBeTruthy();
    expect(multipleSelection.list).toBe('Test List');
    expect(multipleSelection.element).toBeUndefined();
    expect(multipleSelection.multiple).toBe(false);
    expect(multipleSelection.optional).toBe(false);
  });

  it('should export entry', () => {
    const multipleSelection = new MultipleSelection(
      undefined,
      {
        list: 'Test List',
      },
      Tool
    );
    const entry = multipleSelection.toDb();
    expect(entry).toBeTruthy();
    expect(entry.optional).toBe(false);
    expect(entry.multiple).toBe(false);
    expect(entry.list).toBe('Test List');
    expect(entry.element).toBeUndefined();
  });

  describe('equals', () => {
    let multipleSelection: MultipleSelection<Tool>;

    beforeAll(
      () =>
        (multipleSelection = new MultipleSelection(
          undefined,
          {
            list: 'Test List',
          },
          Tool
        ))
    );

    it('not undefined', () => {
      expect(multipleSelection.equals(undefined)).toBe(false);
    });

    it('itself', () => {
      expect(multipleSelection.equals(multipleSelection)).toBe(true);
    });

    it('same values', () => {
      expect(
        multipleSelection.equals(
          new MultipleSelection<Tool>(
            undefined,
            {
              list: 'Test List',
            },
            Tool
          )
        )
      ).toBe(true);
    });

    it('not other list', () => {
      expect(
        multipleSelection.equals(
          new MultipleSelection<Tool>(
            undefined,
            {
              list: 'Other List',
            },
            Tool
          )
        )
      ).toBe(false);
    });

    it('not element is set', () => {
      const tool = new Tool(undefined, {
        list: 'Test List',
        name: 'Test Tool',
      });
      expect(
        multipleSelection.equals(
          new MultipleSelection<Tool>(
            undefined,
            {
              list: 'Test List',
              element: tool,
            },
            Tool
          )
        )
      ).toBe(false);
    });

    it('not optional is set', () => {
      expect(
        multipleSelection.equals(
          new MultipleSelection<Tool>(
            undefined,
            {
              list: 'Test List',
              optional: true,
            },
            Tool
          )
        )
      ).toBe(false);
    });

    it('not multiple is set', () => {
      expect(
        multipleSelection.equals(
          new MultipleSelection<Tool>(
            undefined,
            {
              list: 'Test List',
              multiple: true,
            },
            Tool
          )
        )
      ).toBe(false);
    });
  });
});
