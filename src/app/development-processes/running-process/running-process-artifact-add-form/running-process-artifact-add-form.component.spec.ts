import { RunningProcessArtifactAddFormComponent } from './running-process-artifact-add-form.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { MethodElementSelectionFormComponent } from '../../development-method/method-element-selection-form/method-element-selection-form.component';
import { RunningProcessSelectOutputArtifactComponent } from '../running-process-select-output-artifact/running-process-select-output-artifact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ArtifactService } from '../../../development-process-registry/method-elements/artifact/artifact.service';

describe('RunningProcessArtifactAddFormComponent', () => {
  let spectator: Spectator<RunningProcessArtifactAddFormComponent>;
  const createComponent = createRoutingFactory({
    component: RunningProcessArtifactAddFormComponent,
    declarations: [
      MockComponent(MethodElementSelectionFormComponent),
      MockComponent(RunningProcessSelectOutputArtifactComponent),
    ],
    mocks: [ArtifactService],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
