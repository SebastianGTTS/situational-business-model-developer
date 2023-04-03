import { ExperimentInfoComponent } from './experiment-info.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';

describe('ExperimentInfoComponent', () => {
  let spectator: Spectator<ExperimentInfoComponent>;
  const createComponent = createComponentFactory({
    component: ExperimentInfoComponent,
    declarations: [MockComponent(NgbRating)],
  });

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          experiment: new ExperimentUsed(
            undefined,
            {
              id: 'test-id',
              name: 'Test Experiment',
            },
            undefined
          ),
        },
      }))
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
