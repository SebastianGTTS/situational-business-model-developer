import { EvidenceCostsFormComponent } from './evidence-costs-form.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

describe('EvidenceCostsFormComponent', () => {
  let spectator: Spectator<EvidenceCostsFormComponent>;
  const createComponent = createComponentFactory({
    component: EvidenceCostsFormComponent,
    declarations: [MockComponent(NgbRating)],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
