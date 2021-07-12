import { FormArrayListComponent } from './form-array-list.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

describe('FormArrayListComponent', () => {
  let spectator: Spectator<FormArrayListComponent>;
  const createComponent = createComponentFactory({
    component: FormArrayListComponent,
    declarations: [],
    imports: [NgbTypeaheadModule, ReactiveFormsModule],
  });

  beforeEach(() => spectator = createComponent({
    props: {
      formArray: new FormArray([])
    }
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
