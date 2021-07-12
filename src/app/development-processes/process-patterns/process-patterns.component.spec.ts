import { ProcessPatternsComponent } from './process-patterns.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { AuthorInfoComponent } from '../../shared/author-info/author-info.component';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';

describe('ProcessPatternsComponent', () => {
  let spectator: Spectator<ProcessPatternsComponent>;
  const createComponent = createRoutingFactory({
    component: ProcessPatternsComponent,
    declarations: [
      MockComponent(AuthorInfoComponent),
    ],
    detectChanges: false,
    imports: [ReactiveFormsModule],
    mocks: [ProcessPatternService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(ProcessPatternService).getProcessPatternList.and.returnValue(Promise.resolve([]));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
