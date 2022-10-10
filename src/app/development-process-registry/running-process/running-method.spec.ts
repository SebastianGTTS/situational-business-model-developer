import { RunningMethod } from './running-method';

describe('Running Method', () => {
  it('should create', () => {
    const runningMethod = new RunningMethod(undefined, {
      decision: {
        method: {
          name: 'Test Method',
          author: {},
        },
      },
    });
    expect(runningMethod).toBeTruthy();
  });

  it('should handle undefined input artifacts', () => {
    const runningMethod = new RunningMethod(undefined, {
      decision: {
        method: {
          name: 'Test Method',
          author: {},
          inputArtifacts: {
            groups: [
              {
                items: [
                  {
                    list: 'Test List',
                    optional: true,
                    element: {
                      name: 'Test Element',
                      list: 'Test List',
                    },
                  },
                ],
              },
            ],
          },
        },
        inputArtifacts: {
          groupIndex: 0,
        },
      },
      inputArtifacts: [undefined],
    });
    expect(runningMethod).toBeTruthy();
    const entry = runningMethod.toDb();
    expect(entry).toBeTruthy();
    const runningMethodFromEntry = new RunningMethod(entry, undefined);
    expect(runningMethodFromEntry).toBeTruthy();
  });
});
