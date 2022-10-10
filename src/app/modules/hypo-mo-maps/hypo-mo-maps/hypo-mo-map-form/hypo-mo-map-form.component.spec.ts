import { HypoMoMapFormComponent } from './hypo-mo-map-form.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveFormsModule } from '@angular/forms';

describe('HypoMoMapFormComponent', () => {
  let spectator: Spectator<HypoMoMapFormComponent>;
  const createComponent = createComponentFactory({
    component: HypoMoMapFormComponent,
    declarations: [],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
