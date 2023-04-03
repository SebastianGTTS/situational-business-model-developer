import { FeatureModel } from './feature-model';
import { CanvasDefinition } from './canvas-definition';
import { InstanceType } from './instance';
import { FeatureType } from './feature';

describe('Feature Model', () => {
  let definition: CanvasDefinition;
  let featureModel: FeatureModel;

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
            guidingQuestions: ['Test guiding question?'],
            examples: ['Test example'],
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

  beforeEach(() => {
    featureModel = new FeatureModel(
      undefined,
      {
        name: 'Test',
        $definition: definition,
      },
      'Test Type'
    );
    featureModel.definition = definition;
  });

  it('should create', () => {
    expect(featureModel).toBeTruthy();
  });

  it('should have guiding questions and examples', () => {
    const feature = featureModel.getFeature('key-partners');
    expect(feature).toBeTruthy();
    expect(feature.guidingQuestions).toStrictEqual(['Test guiding question?']);
    expect(feature.examples).toStrictEqual(['Test example']);
  });

  it('should export guiding questions and examples', () => {
    const jsonObject = JSON.parse(JSON.stringify(featureModel));
    expect(jsonObject).toBeTruthy();
    expect(jsonObject.features).toBeTruthy();
    const feature = jsonObject.features['key-partners'];
    expect(feature).toBeTruthy();
    expect(feature.guidingQuestions).toStrictEqual(['Test guiding question?']);
    expect(feature.examples).toStrictEqual(['Test example']);
  });

  it('should set correct instance ids', () => {
    featureModel.addInstance({
      name: 'Test 0',
      type: InstanceType.EXAMPLE,
    });
    const instance1 = featureModel.addInstance({
      name: 'Test 1',
      type: InstanceType.EXAMPLE,
    });
    const instance2 = featureModel.addInstance({
      name: 'Test 2',
      type: InstanceType.EXAMPLE,
    });
    featureModel.removeInstance(instance1.id);
    // Fake reload
    featureModel = new FeatureModel(
      featureModel.toDb(),
      undefined,
      featureModel.type
    );
    const instance3 = featureModel.addInstance({
      name: 'Test 3',
      type: InstanceType.EXAMPLE,
    });
    expect(instance2.id).not.toBe(instance3.id);
  });

  it('should allow setting root features to mandatory', () => {
    const feature = featureModel.getFeature('key-partners');
    expect(feature.type).toBe(FeatureType.OPTIONAL);
    featureModel.updateFeature(feature.id, undefined, {
      type: FeatureType.MANDATORY,
    });
    expect(feature.type).toBe(FeatureType.MANDATORY);
  });
});
