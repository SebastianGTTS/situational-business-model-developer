import { Feature } from './feature';

describe('Feature', () => {
  it('should create', () => {
    const feature = new Feature(
      undefined,
      {
        name: 'Test Feature',
      },
      'test-feature',
      undefined
    );
    expect(feature).toBeTruthy();
    expect(feature.id).toBe('test-feature');
    expect(feature.name).toBe('Test Feature');
    expect(feature.parent).toBeUndefined();
    expect(feature.level).toBe(1);
    expect(feature.guidingQuestions).toStrictEqual([]);
  });

  it('should have level', () => {
    const feature = new Feature(
      undefined,
      {
        name: 'Main Feature',
        subfeatures: {
          'lower-feature': {
            name: 'Lower Feature',
          },
        },
      },
      'main-feature',
      undefined
    );
    const subfeatures = feature.getAllSubfeatures();
    expect(subfeatures).toHaveLength(1);
    const lowerFeature = subfeatures[0];
    expect(lowerFeature).toBeTruthy();
    expect(lowerFeature.id).toBe('lower-feature');
    expect(lowerFeature.name).toBe('Lower Feature');
    expect(lowerFeature.parent).toBe(feature);
    expect(lowerFeature.level).toBe(2);
    expect(feature.getLevelname()).toBe('- Main Feature');
    expect(lowerFeature.getLevelname()).toBe('-- Lower Feature');
  });
});
