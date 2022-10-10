import { ElementDecision } from './element-decision';
import { Tool } from '../method-elements/tool/tool';
import { MultipleSelection } from '../development-method/multiple-selection';

describe('Element Decision', () => {
  let multipleSelectionDefault: Readonly<MultipleSelection<Tool>>;
  let multipleSelectionMultiple: Readonly<MultipleSelection<Tool>>;
  let multipleSelectionMultipleOptional: Readonly<MultipleSelection<Tool>>;
  let multipleSelectionOptional: Readonly<MultipleSelection<Tool>>;
  let multipleSelectionElement: Readonly<MultipleSelection<Tool>>;

  beforeAll(() => {
    multipleSelectionDefault = new MultipleSelection<Tool>(
      undefined,
      {
        list: 'Test List',
      },
      Tool
    );
    multipleSelectionMultiple = new MultipleSelection<Tool>(
      undefined,
      {
        list: 'Test List',
        multiple: true,
      },
      Tool
    );
    multipleSelectionMultipleOptional = new MultipleSelection<Tool>(
      undefined,
      {
        list: 'Test List',
        multiple: true,
        optional: true,
      },
      Tool
    );
    multipleSelectionOptional = new MultipleSelection<Tool>(
      undefined,
      {
        list: 'Test List',
        optional: true,
      },
      Tool
    );
    multipleSelectionElement = new MultipleSelection<Tool>(
      undefined,
      {
        list: 'Test List',
        element: new Tool(undefined, {
          list: 'Test List',
          name: 'Test Tool',
        }),
      },
      Tool
    );
  });

  it('should create', () => {
    const elementDecision = new ElementDecision(
      undefined,
      {},
      Tool,
      multipleSelectionDefault
    );
    expect(elementDecision).toBeTruthy();
    expect(elementDecision.element).toBeUndefined();
    expect(elementDecision.elements).toBeUndefined();
  });

  it('should not create without entry or init', () => {
    expect(
      () =>
        new ElementDecision(
          undefined,
          undefined,
          Tool,
          multipleSelectionDefault
        )
    ).toThrow();
  });

  it('should export entry', () => {
    const elementDecision = new ElementDecision(
      undefined,
      {},
      Tool,
      multipleSelectionDefault
    );
    const entry = elementDecision.toDb();
    expect(entry).toBeTruthy();
    expect(entry.element).toBeUndefined();
    expect(entry.elements).toBeUndefined();
  });

  it('should set elements', () => {
    const elementDecision = new ElementDecision(
      undefined,
      {},
      Tool,
      multipleSelectionMultiple
    );
    expect(elementDecision).toBeTruthy();
    expect(elementDecision.element).toBeUndefined();
    expect(elementDecision.elements).toStrictEqual([]);
  });

  describe('isComplete', () => {
    it('not without element', () => {
      const elementDecision = new ElementDecision(
        undefined,
        {},
        Tool,
        multipleSelectionDefault
      );
      expect(elementDecision.isComplete()).toBe(false);
    });

    it('with predeclared element', () => {
      const elementDecision = new ElementDecision(
        undefined,
        {},
        Tool,
        multipleSelectionElement
      );
      expect(elementDecision.isComplete()).toBe(true);
    });

    it('with custom element', () => {
      const elementDecision = new ElementDecision(
        undefined,
        {
          element: new Tool(undefined, {
            list: 'Test List',
            name: 'Test Tool',
          }),
        },
        Tool,
        multipleSelectionDefault
      );
      expect(elementDecision.isComplete()).toBe(true);
    });

    it('if multiple allowed and optional', () => {
      const elementDecision = new ElementDecision(
        undefined,
        {},
        Tool,
        multipleSelectionMultipleOptional
      );
      expect(elementDecision.isComplete()).toBe(true);
    });

    it('not if multiple allowed and not at least one selection', () => {
      const elementDecision = new ElementDecision(
        undefined,
        {},
        Tool,
        multipleSelectionMultiple
      );
      expect(elementDecision.isComplete()).toBe(false);
    });

    it('if multiple allowed and at least one selection', () => {
      const elementDecision = new ElementDecision(
        undefined,
        {
          elements: [
            {
              list: 'Test List',
              name: 'Test Tool',
            },
          ],
        },
        Tool,
        multipleSelectionMultiple
      );
      expect(elementDecision.isComplete()).toBe(true);
    });

    it('if optional', () => {
      const elementDecision = new ElementDecision(
        undefined,
        {},
        Tool,
        multipleSelectionOptional
      );
      expect(elementDecision.isComplete()).toBe(true);
    });
  });

  describe('getSelectedElements', () => {
    it('with no selection', () => {
      const elementDecision = new ElementDecision(
        undefined,
        {},
        Tool,
        multipleSelectionDefault
      );
      expect(elementDecision.getSelectedElements()).toStrictEqual([]);
    });

    it('with single predefined selection', () => {
      const elementDecision = new ElementDecision(
        undefined,
        {},
        Tool,
        multipleSelectionElement
      );
      expect(elementDecision.getSelectedElements()).toStrictEqual([
        multipleSelectionElement.element,
      ]);
    });

    it('with single custom selection', () => {
      const tool = new Tool(undefined, {
        list: 'Test List',
        name: 'Test Tool',
      });
      const elementDecision = new ElementDecision(
        undefined,
        {
          element: tool,
        },
        Tool,
        multipleSelectionDefault
      );
      expect(elementDecision.getSelectedElements()).toStrictEqual([tool]);
    });

    it('with multiple but no elements selected', () => {
      const elementDecision = new ElementDecision(
        undefined,
        {},
        Tool,
        multipleSelectionMultiple
      );
      expect(elementDecision.getSelectedElements()).toStrictEqual([]);
    });

    it('with multiple selections', () => {
      const toolA = new Tool(undefined, {
        list: 'Test List',
        name: 'Test Tool A',
      });
      const toolB = new Tool(undefined, {
        list: 'Test List',
        name: 'Test Tool B',
      });
      const elementDecision = new ElementDecision(
        undefined,
        {
          elements: [toolA, toolB],
        },
        Tool,
        multipleSelectionMultiple
      );
      expect(elementDecision.getSelectedElements()).toStrictEqual([
        toolA,
        toolB,
      ]);
    });
  });

  describe('equals', () => {
    let elementDecision: ElementDecision<Tool>;

    beforeAll(() => {
      elementDecision = new ElementDecision<Tool>(
        undefined,
        {},
        Tool,
        multipleSelectionDefault
      );
    });

    it('not undefined', () => {
      expect(elementDecision.equals(undefined)).toBe(false);
    });

    it('itself', () => {
      expect(elementDecision.equals(elementDecision)).toBe(true);
    });

    it('same values', () => {
      expect(
        elementDecision.equals(
          new ElementDecision<Tool>(
            undefined,
            {},
            Tool,
            multipleSelectionDefault
          )
        )
      ).toBe(true);
    });

    it('not if element', () => {
      const tool = new Tool(undefined, {
        list: 'Test List',
        name: 'Test Tool',
      });
      expect(
        elementDecision.equals(
          new ElementDecision<Tool>(
            undefined,
            {
              element: tool,
            },
            Tool,
            multipleSelectionDefault
          )
        )
      ).toBe(false);
    });
  });
});
