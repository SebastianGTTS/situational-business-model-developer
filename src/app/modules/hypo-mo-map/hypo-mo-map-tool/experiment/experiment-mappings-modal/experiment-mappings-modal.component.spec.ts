import { ExperimentMappingsModalComponent } from './experiment-mappings-modal.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { HypothesisInfoComponent } from '../../hypothesis/hypothesis-info/hypothesis-info.component';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ExperimentMappingsModalComponent', () => {
  let spectator: Spectator<ExperimentMappingsModalComponent>;
  const createComponent = createComponentFactory({
    component: ExperimentMappingsModalComponent,
    declarations: [MockComponent(HypothesisInfoComponent)],
    mocks: [NgbActiveModal],
  });

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          experiment: new ExperimentUsed(
            undefined,
            {
              name: 'Test experiment',
              id: 'test-experiment',
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
