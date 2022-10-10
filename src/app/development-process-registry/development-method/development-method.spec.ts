import { DevelopmentMethod } from './development-method';
import { ArtifactMultipleMappingSelection } from './artifact-multiple-mapping-selection';
import { ArtifactGroups } from './artifact-groups';
import { Groups } from './groups';
import { ArtifactGroup } from './artifact-group';

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
    expect(method.inputArtifacts).toBeInstanceOf(ArtifactGroups);
    expect(method.inputArtifacts.groups).toStrictEqual([]);
    expect(method.outputArtifacts).toBeInstanceOf(Groups);
    expect(method.outputArtifacts.groups).toStrictEqual([]);
    expect(method.stakeholders).toBeInstanceOf(Groups);
    expect(method.stakeholders.groups).toStrictEqual([]);
    expect(method.tools).toBeInstanceOf(Groups);
    expect(method.tools.groups).toStrictEqual([]);
    expect(method.executionSteps).toStrictEqual([]);
  });

  it('should represent input artifacts', () => {
    const method = new DevelopmentMethod(undefined, {
      name: 'Test',
      author: {},
      inputArtifacts: {
        groups: [
          {
            items: [
              {
                list: 'Test',
                element: {
                  list: 'Test',
                  name: 'Test Artifact',
                },
                multiple: false,
                optional: false,
              },
            ],
          },
        ],
      },
    });
    expect(method.inputArtifacts).toBeInstanceOf(ArtifactGroups);
    expect(method.inputArtifacts.groups).toHaveLength(1);
    expect(method.inputArtifacts.groups[0]).toBeInstanceOf(ArtifactGroup);
    expect(method.inputArtifacts.groups[0].items).toHaveLength(1);
    const inputArtifact: ArtifactMultipleMappingSelection =
      method.inputArtifacts.groups[0].items[0];
    expect(inputArtifact).toBeTruthy();
  });
});
