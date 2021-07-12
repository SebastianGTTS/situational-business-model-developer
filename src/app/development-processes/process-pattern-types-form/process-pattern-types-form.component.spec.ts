import { ProcessPatternTypesFormComponent } from './process-pattern-types-form.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { FormArrayListComponent } from '../../shared/form-array-list/form-array-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoCompletionService } from '../../auto-completion.service';

describe('ProcessPatternTypesFormComponent', () => {
  let spectator: Spectator<ProcessPatternTypesFormComponent>;
  const createComponent = createComponentFactory({
    component: ProcessPatternTypesFormComponent,
    declarations: [
      MockComponent(FormArrayListComponent),
    ],
    detectChanges: false,
    imports: [ReactiveFormsModule],
    mocks: [AutoCompletionService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(AutoCompletionService).getValues.and.returnValue(Promise.resolve([]));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
