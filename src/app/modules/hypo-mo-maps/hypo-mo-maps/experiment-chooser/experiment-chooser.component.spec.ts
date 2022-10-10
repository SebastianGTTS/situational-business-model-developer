import { ExperimentChooserComponent } from './experiment-chooser.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { ExperimentInfoComponent } from '../experiment-info/experiment-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HypothesisInfoComponent } from '../hypothesis-info/hypothesis-info.component';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';

describe('ExperimentChooserComponent', () => {
  let spectator: Spectator<ExperimentChooserComponent>;
  const createComponent = createComponentFactory({
    component: ExperimentChooserComponent,
    declarations: [
      MockComponent(ExperimentInfoComponent),
      MockComponent(HypothesisInfoComponent),
      MockComponent(NgbRating),
    ],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
