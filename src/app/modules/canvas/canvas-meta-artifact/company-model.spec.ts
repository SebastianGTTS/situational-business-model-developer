import { CompanyModel } from './company-model';
import { CanvasDefinition } from './canvas-definition';

describe('Company Model', () => {
  let definition: CanvasDefinition;

  beforeAll(() => {
    definition = new CanvasDefinition(undefined, {
      name: 'Test',
      rows: [
        [
          {
            isSpacer: false,
            id: 'key-partners',
            name: 'Key Partners',
            rowspan: 2,
            colspan: 2,
          },
        ],
        [
          {
            isSpacer: false,
            id: 'key-resources',
            name: 'Key Resources',
            rowspan: 1,
            colspan: 2,
          },
        ],
      ],
      relationshipTypes: ['required', 'excludes'],
    });
  });

  it('should be created', () => {
    const companyModel = new CompanyModel(undefined, {
      name: 'Test',
      $definition: definition.toDb(),
    });
    expect(companyModel.name).toBe('Test');
    expect(companyModel.expertModelTraces).toStrictEqual({});
    expect(companyModel.createdByMethod).toBe(false);
  });
});
