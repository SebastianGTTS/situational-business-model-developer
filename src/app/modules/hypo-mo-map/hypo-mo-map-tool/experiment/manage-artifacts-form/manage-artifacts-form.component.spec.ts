import { ManageArtifactsFormComponent } from './manage-artifacts-form.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { FormArrayListComponent } from '../../../../../shared/form-array-list/form-array-list.component';

describe('ManageArtifactsFormComponent', () => {
  let spectator: Spectator<ManageArtifactsFormComponent>;
  const createComponent = createComponentFactory({
    component: ManageArtifactsFormComponent,
    declarations: [MockComponent(FormArrayListComponent)],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
