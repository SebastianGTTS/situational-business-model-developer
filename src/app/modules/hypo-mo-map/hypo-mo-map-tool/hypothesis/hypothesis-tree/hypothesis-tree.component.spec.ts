import { HypothesisTreeComponent } from './hypothesis-tree.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { HypothesisInfoComponent } from '../hypothesis-info/hypothesis-info.component';
import { ExperimentInfoComponent } from '../../experiment/experiment-info/experiment-info.component';

describe('HypothesisTreeComponent', () => {
  let spectator: Spectator<HypothesisTreeComponent>;
  const createComponent = createComponentFactory({
    component: HypothesisTreeComponent,
    declarations: [
      MockComponent(ExperimentInfoComponent),
      MockComponent(HypothesisInfoComponent),
    ],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
