import { DevelopmentMethod } from './development-method';
import { MultipleMappingSelection } from './multiple-mapping-selection';
import { Artifact } from '../method-elements/artifact/artifact';

describe('Development Method', () => {
  it('should create', () => {
    const method = new DevelopmentMethod(undefined, {
      name: 'Test',
      author: {},
    });
    expect(method).toBeTruthy();
    expect(method.name).toBe('Test');
    expect(method.examples).toStrictEqual([]);
    expect(method.types).toStrictEqual([]);
    expect(method.situationalFactors).toStrictEqual([]);
    expect(method.inputArtifacts).toStrictEqual([]);
    expect(method.outputArtifacts).toStrictEqual([]);
    expect(method.stakeholders).toStrictEqual([]);
    expect(method.tools).toStrictEqual([]);
    expect(method.executionSteps).toStrictEqual([]);
  });

  it('should represent input artifacts', () => {
    const method = new DevelopmentMethod(undefined, {
      name: 'Test',
      author: {},
      inputArtifacts: [
        [
          {
            list: 'Test',
            element: {
              list: 'Test',
              name: 'Test Artifact',
            },
            multiple: false,
            multipleElements: false,
          },
        ],
      ],
    });
    expect(method.inputArtifacts).toHaveLength(1);
    expect(method.inputArtifacts[0]).toHaveLength(1);
    const inputArtifact: MultipleMappingSelection<Artifact> =
      method.inputArtifacts[0][0];
    expect(inputArtifact).toBeTruthy();
  });
});
