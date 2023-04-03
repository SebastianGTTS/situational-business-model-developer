import { ExperimentTreeComponent } from './experiment-tree.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

describe('ExperimentTreeComponent', () => {
  let spectator: Spectator<ExperimentTreeComponent>;
  const createComponent = createComponentFactory({
    component: ExperimentTreeComponent,
    declarations: [],
  });

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          experiments: [],
        },
      }))
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
