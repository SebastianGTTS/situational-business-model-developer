import { DescriptionFormComponent } from './description-form.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule } from '@angular/forms';

describe('DescriptionFormComponent', () => {
  let spectator: Spectator<DescriptionFormComponent>;
  const createComponent = createComponentFactory({
    component: DescriptionFormComponent,
    declarations: [],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
