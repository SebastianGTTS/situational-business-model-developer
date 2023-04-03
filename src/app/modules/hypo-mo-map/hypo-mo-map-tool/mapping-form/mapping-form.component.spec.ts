import { MappingFormComponent } from './mapping-form.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveFormsModule } from '@angular/forms';

describe('MappingFormComponent', () => {
  let spectator: Spectator<MappingFormComponent>;
  const createComponent = createComponentFactory({
    component: MappingFormComponent,
    declarations: [],
    imports: [ReactiveFormsModule],
  });

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          experimentList: {},
        },
      }))
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
