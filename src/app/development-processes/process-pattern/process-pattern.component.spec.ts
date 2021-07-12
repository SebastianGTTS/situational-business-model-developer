import { ProcessPatternComponent } from './process-pattern.component';
import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { ProcessPatternDiagramComponent } from '../process-pattern-diagram/process-pattern-diagram.component';
import { AuthorFormComponent } from '../../shared/author-form/author-form.component';
import { ProcessPatternService } from '../../development-process-registry/process-pattern/process-pattern.service';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';

describe('ProcessPatternComponent', () => {
  let spectator: Spectator<ProcessPatternComponent>;
  const createComponent = createRoutingFactory({
    component: ProcessPatternComponent,
    declarations: [
      MockComponent(AuthorFormComponent),
      MockComponent(ProcessPatternDiagramComponent),
    ],
    detectChanges: false,
    mocks: [ProcessPatternService],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(ProcessPatternService).getProcessPattern.and.returnValue(Promise.resolve(new ProcessPattern({name: 'Test Pattern'})));
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
