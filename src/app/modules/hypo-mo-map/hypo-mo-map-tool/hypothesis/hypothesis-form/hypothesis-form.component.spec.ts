import { HypothesisFormComponent } from './hypothesis-form.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';

describe('HypothesisFormComponent', () => {
  let spectator: Spectator<HypothesisFormComponent>;
  const createComponent = createComponentFactory({
    component: HypothesisFormComponent,
    declarations: [MockComponent(NgbRating)],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
