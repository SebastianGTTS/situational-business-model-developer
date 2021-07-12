import { MethodElementFormComponent } from './method-element-form.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule } from '@angular/forms';

describe('MethodElementFormComponent', () => {
  let spectator: Spectator<MethodElementFormComponent>;
  const createComponent = createComponentFactory({
    component: MethodElementFormComponent,
    declarations: [],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
