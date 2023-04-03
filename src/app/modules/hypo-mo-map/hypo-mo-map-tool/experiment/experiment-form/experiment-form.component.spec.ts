import { ExperimentFormComponent } from './experiment-form.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveFormsModule } from '@angular/forms';

describe('ExperimentFormComponent', () => {
  let spectator: Spectator<ExperimentFormComponent>;
  const createComponent = createComponentFactory({
    component: ExperimentFormComponent,
    declarations: [],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
