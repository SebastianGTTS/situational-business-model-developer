import { HypothesisMappingsModalComponent } from './hypothesis-mappings-modal.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { ExperimentInfoComponent } from '../../experiment/experiment-info/experiment-info.component';
import { Hypothesis } from '../../../hypo-mo-map-meta-artifact/hypothesis';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('HypothesisMappingsModalComponent', () => {
  let spectator: Spectator<HypothesisMappingsModalComponent>;
  const createComponent = createComponentFactory({
    component: HypothesisMappingsModalComponent,
    declarations: [MockComponent(ExperimentInfoComponent)],
    mocks: [NgbActiveModal],
  });

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          hypothesis: new Hypothesis(
            undefined,
            {
              id: 'test-id',
              name: 'Test Hypothesis',
              priority: 1,
            },
            undefined
          ),
          mappings: [],
        },
      }))
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
