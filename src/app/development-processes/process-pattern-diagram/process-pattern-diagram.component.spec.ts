import { ProcessPatternDiagramComponent } from './process-pattern-diagram.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { ProcessPatternTypesFormComponent } from '../process-pattern-types-form/process-pattern-types-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ProcessPatternDiagramComponent', () => {
  let spectator: Spectator<ProcessPatternDiagramComponent>;
  const createComponent = createComponentFactory({
    component: ProcessPatternDiagramComponent,
    declarations: [
      MockComponent(ProcessPatternTypesFormComponent),
    ],
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
