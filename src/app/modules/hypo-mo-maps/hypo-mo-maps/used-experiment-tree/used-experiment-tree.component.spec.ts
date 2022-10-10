import { UsedExperimentTreeComponent } from './used-experiment-tree.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { ExperimentInfoComponent } from '../experiment-info/experiment-info.component';

describe('UsedExperimentTreeComponent', () => {
  let spectator: Spectator<UsedExperimentTreeComponent>;
  const createComponent = createComponentFactory({
    component: UsedExperimentTreeComponent,
    declarations: [MockComponent(ExperimentInfoComponent)],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
