import { HypothesisInfoComponent } from './hypothesis-info.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';

describe('HypothesisInfoComponent', () => {
  let spectator: Spectator<HypothesisInfoComponent>;
  const createComponent = createComponentFactory({
    component: HypothesisInfoComponent,
    declarations: [MockComponent(NgbRating)],
  });

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          hypothesis: new Hypothesis(
            undefined,
            { name: 'Test', id: 'test-id', priority: 1 },
            undefined
          ),
        },
      }))
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
