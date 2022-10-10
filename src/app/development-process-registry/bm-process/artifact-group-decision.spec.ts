import { ArtifactGroupDecision } from './artifact-group-decision';
import { ArtifactGroups } from '../development-method/artifact-groups';

describe('Artifact Group Decision', () => {
  it('should create', () => {
    const artifactGroupDecision = new ArtifactGroupDecision(
      undefined,
      {},
      new ArtifactGroups(undefined, {
        groups: [
          {
            items: [
              {
                list: 'Test List',
                element: {
                  list: 'Test List',
                  name: 'Test Element',
                },
                mapping: [
                  {
                    output: true,
                    group: 0,
                    artifact: 0,
                  },
                ],
              },
            ],
          },
        ],
      })
    );
    artifactGroupDecision.groupIndex = 0;
    expect(artifactGroupDecision).toBeTruthy();
    expect(artifactGroupDecision.group).toBeTruthy();
    expect(artifactGroupDecision.group?.items).toBeTruthy();
    expect(artifactGroupDecision.group?.items).toHaveLength(1);
    expect(artifactGroupDecision.group?.items[0].mapping).toBeTruthy();
    expect(artifactGroupDecision.group?.items[0].mapping).toHaveLength(1);
    expect(artifactGroupDecision.group?.items[0].mapping[0].output).toBe(true);
    expect(artifactGroupDecision.elementDecisions).toBeTruthy();
    expect(artifactGroupDecision.elementDecisions).toHaveLength(1);
    expect(
      artifactGroupDecision.elementDecisions?.[0].getSelectedElements()
    ).toHaveLength(1);
  });
});
